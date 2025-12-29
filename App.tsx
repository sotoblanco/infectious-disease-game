import React, { useState, useEffect } from 'react';
import { GamePhase, PlayerStats, Disease, Prescription, SimulationConfig, TextbookSection } from './types';
import { DISEASES, DRUG_FAMILIES, TEXTBOOK_SECTIONS } from './constants';
import { VitalsPanel } from './components/VitalsPanel';
import { PrescriptionPhase } from './components/PrescriptionPhase';
import { ShooterGame } from './components/ShooterGame';
import { ArrowRight, AlertTriangle, CheckCircle, Skull, Info, FileText, Play, BookOpen, Shuffle, ChevronDown, ChevronRight, Lock, Home, BrainCircuit, Loader2, Stethoscope, ClipboardCheck } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// Defines how much drug MG represents one "bullet" in the game.
const MG_PER_SHOT = 1000;

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.MENU);
  const [gameMode, setGameMode] = useState<'RANDOM' | 'SEQUENTIAL'>('SEQUENTIAL');
  const [stats, setStats] = useState<PlayerStats>({
    bpSystolic: 120,
    creatinine: 0.8,
    resistanceScore: 0,
    level: 1
  });

  const [currentDisease, setCurrentDisease] = useState<Disease>(DISEASES[0]);
  const [simConfig, setSimConfig] = useState<SimulationConfig | null>(null);
  
  // Store AI evaluation result to display after game
  const [roundResult, setRoundResult] = useState<{message: string, success: boolean, reasoning?: string} | null>(null);
  const [lastPrescription, setLastPrescription] = useState<Prescription | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<{title: string, reasoning: string, approved: boolean, efficacyScore: number, safetyScore: number} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Chapter Select State
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Check Game Over
  useEffect(() => {
    if (stats.bpSystolic < 80 || stats.creatinine > 2.5) {
      setPhase(GamePhase.GAME_OVER);
    }
  }, [stats]);

  const goHome = () => {
    setPhase(GamePhase.MENU);
    setStats({
      bpSystolic: 120,
      creatinine: 0.8,
      resistanceScore: 0,
      level: 1
    });
    setSimConfig(null);
    setRoundResult(null);
    setLastPrescription(null);
    setAiEvaluation(null);
    setExpandedSection(null);
    setIsAnalyzing(false);
  };

  const startRandomGame = () => {
    setGameMode('RANDOM');
    setStats(prev => ({ ...prev, level: 1, bpSystolic: 120, creatinine: 0.8 }));
    pickRandomDisease();
    setPhase(GamePhase.PRESCRIPTION);
  };

  const openChapterSelect = () => {
    setPhase(GamePhase.CHAPTER_SELECT);
    setExpandedSection(null);
  };

  const selectChapter = (disease: Disease) => {
    setGameMode('SEQUENTIAL');
    setStats(prev => ({ ...prev, level: 1, bpSystolic: 120, creatinine: 0.8 }));
    setCurrentDisease(disease);
    setPhase(GamePhase.PRESCRIPTION);
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const pickRandomDisease = () => {
    const randomIndex = Math.floor(Math.random() * DISEASES.length);
    setCurrentDisease(DISEASES[randomIndex]);
  };

  const getDrugName = (id: string) => {
    for (const family of DRUG_FAMILIES) {
      const drug = family.drugs.find(d => d.id === id);
      if (drug) return drug.name;
    }
    return id;
  };

  const evaluatePrescriptionWithAI = async (
    disease: Disease, 
    rx: Prescription
  ): Promise<{ approved: boolean; efficacyScore: number; safetyScore: number; title: string; reasoning: string }> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Act as a strict Senior Infectious Disease Specialist Board Examiner.
        Your task is to Evaluate the user's antibiotic prescription for the given case.

        CASE DETAILS:
        - Diagnosis: ${disease.name}
        - Pathogen: ${disease.pathogen}
        - Clinical Context: ${disease.description}
        
        GOLD STANDARD PROTOCOL (For Reference):
        - Drug: ${getDrugName(disease.optimalTreatment.drugId)}
        - Dose: ${disease.optimalTreatment.doseMg}mg
        - Interval: q${disease.optimalTreatment.intervalHours}h
        - Duration: ${disease.optimalTreatment.durationDays} days

        USER PRESCRIPTION (To Evaluate):
        - Drug: ${rx.drug.name}
        - Dose: ${rx.doseMg}mg
        - Interval: q${rx.intervalHours}h
        - Duration: ${rx.durationDays} days
        
        EVALUATION CRITERIA:
        1. **approved** (Boolean): 
           - RETURN TRUE if the drug effectively treats the specific pathogen AND the dosage is therapeutic (sufficient to kill the bacteria).
           - RETURN TRUE for valid alternatives (e.g., using Levofloxacin for E. coli when Cipro is standard, provided it works).
           - RETURN FALSE if the drug is resistant, wrong spectrum, or ineffective.
           - RETURN FALSE if the dose is significantly sub-therapeutic or lethally toxic.
           - BE FAIR: If it works clinically, pass it, even if it's not the absolute #1 choice.
        
        2. **efficacyScore** (0-100):
           - 100: Optimal drug and dose (Gold Standard).
           - 80-90: Effective alternative drug, or optimal drug with slight dosing deviation.
           - 50-70: Suboptimal but effective (e.g. broad spectrum when narrow exists, or barely therapeutic dose).
           - 0-40: Ineffective, Resistant, or Wrong Spectrum.

        3. **safetyScore** (0-100):
           - 100: Safe.
           - <50: Significant nephrotoxicity risk or dangerous overdose.

        4. **reasoning**:
           - concise clinical explanation. Must explicitly justify the PASS/FAIL decision.

        Output strictly in JSON format.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              approved: { type: Type.BOOLEAN, description: "Final Pass/Fail decision based on clinical efficacy." },
              efficacyScore: { type: Type.NUMBER },
              safetyScore: { type: Type.NUMBER },
              title: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["approved", "efficacyScore", "safetyScore", "title", "reasoning"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (error) {
      console.error("AI Evaluation failed", error);
    }

    // Fallback if AI fails: Use strict matching from constants
    const strictMatch = disease.susceptibleTo.includes(rx.drug.id) || rx.drug.id === disease.optimalTreatment.drugId;
    return {
      approved: strictMatch,
      efficacyScore: strictMatch ? 100 : 0,
      safetyScore: 100,
      title: strictMatch ? "Standard Protocol" : "Treatment Failed",
      reasoning: "System Offline. Evaluation based on rigid protocol matching."
    };
  };

  const handlePrescribe = async (rx: Prescription) => {
    setLastPrescription(rx);
    setIsAnalyzing(true);

    // 1. AI Evaluation
    const evaluation = await evaluatePrescriptionWithAI(currentDisease, rx);
    setAiEvaluation(evaluation);

    // 2. Base Physics Calculation (Bio-Load)
    const optimalDailyDoses = 24 / currentDisease.optimalTreatment.intervalHours;
    const optimalTotalMg = currentDisease.optimalTreatment.doseMg * optimalDailyDoses * currentDisease.optimalTreatment.durationDays;
    const userDailyDoses = 24 / rx.intervalHours;
    const userTotalMg = rx.doseMg * userDailyDoses * rx.durationDays;
    
    // 3. Adjust Game Parameters based on AI Efficacy
    let baseBacteriaCount = Math.ceil(optimalTotalMg / MG_PER_SHOT);
    
    let adjustedBacteriaCount = baseBacteriaCount;
    // If efficacy is acceptable but not perfect, increase difficulty
    if (evaluation.efficacyScore > 0 && evaluation.efficacyScore < 100) {
        const difficultyMultiplier = 1 + ((100 - evaluation.efficacyScore) / 80); 
        adjustedBacteriaCount = Math.ceil(baseBacteriaCount * difficultyMultiplier);
    }

    let ammoCount = Math.floor(userTotalMg / MG_PER_SHOT);
    
    // CRITICAL FIX: Potency Correction
    // If the AI approves the drug, it means the dose is therapeutic regardless of raw MG weight.
    // Some drugs (like Cefadroxil) are more potent per MG than others (like Cephalexin).
    // We must ensure the simulation is mathematically winnable (Ammo >= Bacteria).
    if (evaluation.approved) {
       // Cap bacteria to be at least 1 less than ammo (allow 1 miss), or keep original if easier.
       if (adjustedBacteriaCount >= ammoCount) {
          adjustedBacteriaCount = Math.max(1, ammoCount - 1);
       }
    }
    
    // 4. Toxicity Calculation based on AI Safety Score
    let baseToxicity = rx.drug.nephrotoxicity * 0.1;
    // Lower safety score = higher toxicity per shot
    const safetyMultiplier = 1 + ((100 - evaluation.safetyScore) / 50); 
    const toxicityPerShot = baseToxicity * safetyMultiplier;

    const config: SimulationConfig = {
      ammoCount: ammoCount,
      // If AI says NOT APPROVED, damage is 0 (Impossible to win simulation).
      // If Approved, damage is 1 (Possible to win).
      damagePerShot: evaluation.approved ? 1 : 0, 
      toxicityPerShot: toxicityPerShot,
      bacteriaCount: adjustedBacteriaCount,
      // Lower score = faster bacteria
      bacteriaSpeed: evaluation.efficacyScore < 90 ? (evaluation.efficacyScore < 60 ? 3 : 1.5) : 0.5,
      bacteriaColor: currentDisease.bacteriaColor,
      isCorrectDrug: evaluation.approved
    };

    setSimConfig(config);
    setIsAnalyzing(false);
    setPhase(GamePhase.PLAYING);
  };

  const handleStatUpdate = (bpDrop: number, kidneyHit: number) => {
    setStats(prev => ({
      ...prev,
      bpSystolic: Math.max(0, prev.bpSystolic - bpDrop),
      creatinine: prev.creatinine + kidneyHit
    }));
  };

  const handleGameEnd = (results: { remainingBacteria: number; remainingAmmo: number; kidneyDamage: number }) => {
    let bpDrop = 0;
    let creatinineRise = 0;
    let success = false;
    let message = "";
    
    // Use stored AI reasoning
    const reasoning = aiEvaluation?.reasoning || "Evaluation unavailable.";
    const title = aiEvaluation?.title || "Treatment Complete";
    const approved = aiEvaluation?.approved || false;

    // 1. Calculate Physical Toll
    if (results.remainingBacteria > 0) {
      bpDrop = results.remainingBacteria * 4;
    }
    creatinineRise += results.kidneyDamage;

    // Check bio-load / Overdose penalty in post-game
    const opt = currentDisease.optimalTreatment;
    if (lastPrescription) {
       const optimalDaily = 24 / opt.intervalHours;
       const optimalLoad = opt.doseMg * optimalDaily * opt.durationDays;
       const userDaily = 24 / lastPrescription.intervalHours;
       const userLoad = lastPrescription.doseMg * userDaily * lastPrescription.durationDays;
       
       if (userLoad > optimalLoad * 1.5) { 
           creatinineRise += 0.3; 
       }
       if (results.remainingAmmo > 4) {
         creatinineRise += (results.remainingAmmo - 4) * 0.05;
       }
    }

    // 2. Synthesize Results
    // Win Condition: Bacteria Cleared AND AI Approved
    if (results.remainingBacteria === 0 && approved) {
      success = true;
      message = title; 
    } 
    // Mechanical Win but Clinical Fail (Should be rare if damagePerShot is 0, but possible via bugs/edge cases)
    else if (results.remainingBacteria === 0 && !approved) {
      success = false;
      message = "Bacteria Eradicated, but Clinical Failure";
      stats.resistanceScore += 10;
    } 
    // Mechanical Fail
    else {
      success = false;
      // If the drug was approved but they lost the minigame
      if (approved) {
          message = "Clinical Choice Valid, but Bacterial Load Overwhelming";
      } else {
          message = "Treatment Failed: Ineffective Regimen";
      }
    }
    
    setStats(prev => ({
      ...prev,
      bpSystolic: prev.bpSystolic - bpDrop,
      creatinine: prev.creatinine + creatinineRise
    }));

    setRoundResult({ message, success, reasoning });
    setPhase(GamePhase.ROUND_RESULT);
  };

  const nextLevel = () => {
    setStats(prev => ({ ...prev, level: prev.level + 1 }));
    if (gameMode === 'RANDOM') {
      pickRandomDisease();
    } else {
      const currentIndex = DISEASES.findIndex(d => d.id === currentDisease.id);
      const nextIndex = (currentIndex + 1) % DISEASES.length;
      setCurrentDisease(DISEASES[nextIndex]);
    }
    setPhase(GamePhase.PRESCRIPTION);
    setAiEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 relative overflow-y-auto">
      
      {/* Global Home Button */}
      {phase !== GamePhase.MENU && (
        <button
          onClick={goHome}
          className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-3 rounded-full border border-slate-600 shadow-lg transition-all hover:scale-105 group"
          title="Return to Menu"
        >
          <Home size={24} className="group-hover:text-blue-400" />
        </button>
      )}

      {phase !== GamePhase.MENU && phase !== GamePhase.CHAPTER_SELECT && phase !== GamePhase.GAME_OVER && (
        <VitalsPanel stats={stats} aiEvaluation={phase === GamePhase.PLAYING ? aiEvaluation : null} />
      )}

      {phase === GamePhase.MENU && (
        <div className="text-center space-y-8 max-w-lg animate-fade-in mt-20">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">
            PharmaShooter
          </h1>
          <p className="text-xl text-slate-300">
            Medical Stewardship Arcade
          </p>
          
          <div className="grid grid-cols-1 gap-4 w-full">
            <button 
              onClick={startRandomGame}
              className="bg-blue-600 hover:bg-blue-500 text-white p-6 rounded-xl font-bold text-xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3"
            >
              <Shuffle size={24} /> Quick Play (Random)
            </button>
            
            <button 
              onClick={openChapterSelect}
              className="bg-slate-700 hover:bg-slate-600 text-white p-6 rounded-xl font-bold text-xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3 border border-slate-600"
            >
              <BookOpen size={24} /> Select Case
            </button>
          </div>
          
          <div className="text-slate-500 text-sm mt-8">
            Treat infections. Protect kidneys. Survive.
          </div>
        </div>
      )}

      {phase === GamePhase.CHAPTER_SELECT && (
        <div className="w-full max-w-4xl animate-fade-in flex flex-col h-[80vh] mt-10">
          <div className="flex items-center gap-4 mb-4 shrink-0 pl-16">
            <h2 className="text-2xl font-bold text-white">Select Case by Chapter</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar pb-10">
            {TEXTBOOK_SECTIONS.map((section) => (
              <div key={section.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-750 transition-colors"
                >
                  <span className="font-bold text-slate-200">{section.title}</span>
                  {expandedSection === section.id ? <ChevronDown size={20} className="text-blue-400"/> : <ChevronRight size={20} className="text-slate-500"/>}
                </button>
                
                {expandedSection === section.id && (
                  <div className="bg-slate-900/50 p-2 space-y-1">
                    {section.chapters.map(chapter => {
                      const playableDisease = DISEASES.find(d => d.chapterId === chapter.id);
                      return (
                        <div key={chapter.id} className={`p-3 rounded flex items-center justify-between ${playableDisease ? 'bg-slate-800 hover:bg-slate-700 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${playableDisease ? 'text-white' : 'text-slate-500'}`}>{chapter.title}</h4>
                            {playableDisease && <p className="text-xs text-blue-400 mt-1">{playableDisease.name}</p>}
                          </div>
                          
                          {playableDisease ? (
                            <button 
                              onClick={() => selectChapter(playableDisease)}
                              className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
                            >
                              <Play size={12} /> Play
                            </button>
                          ) : (
                            <span className="text-xs text-slate-600 flex items-center gap-1"><Lock size={10} /> Locked</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Screen Overlay during Analysis */}
      {isAnalyzing && (
         <div className="fixed inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center animate-fade-in">
           <Loader2 size={64} className="text-blue-400 animate-spin mb-6" />
           <h2 className="text-2xl font-bold text-white mb-2">Analyzing Treatment Protocol...</h2>
           <p className="text-slate-400">Consulting Global Medical Guidelines</p>
        </div>
      )}

      {phase === GamePhase.PRESCRIPTION && !isAnalyzing && (
        <PrescriptionPhase 
          disease={currentDisease} 
          onPrescribe={handlePrescribe} 
        />
      )}

      {phase === GamePhase.PLAYING && simConfig && (
        <>
          <div className="w-full max-w-4xl mb-4 bg-slate-800 p-4 rounded-lg border border-blue-500/30 flex justify-between items-center shadow-lg">
             <div className="flex items-center gap-3">
              <div className="bg-blue-900/50 p-2 rounded-full">
                <Info className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider">Pathogen</h3>
                <p className="text-white font-semibold text-sm md:text-base">{currentDisease.pathogen}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end text-slate-400 text-xs uppercase tracking-wider">
                Target Protocol <FileText size={12}/>
              </div>
               <p className="text-white font-mono text-sm">
                 {getDrugName(currentDisease.optimalTreatment.drugId)} {currentDisease.optimalTreatment.doseMg}mg 
                q{currentDisease.optimalTreatment.intervalHours}h × {currentDisease.optimalTreatment.durationDays}d
              </p>
            </div>
          </div>
          <ShooterGame 
            config={simConfig} 
            aiReasoning={aiEvaluation?.reasoning}
            onGameEnd={handleGameEnd}
            onUpdateStats={handleStatUpdate}
          />
        </>
      )}

      {phase === GamePhase.ROUND_RESULT && roundResult && lastPrescription && (
        <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-700 animate-fade-in mb-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8 border-b border-slate-700 pb-6">
            <div className="flex-1 text-center md:text-left">
               <h2 className={`text-4xl font-extrabold mb-2 ${roundResult.success ? "text-green-400" : "text-red-400"}`}>
                {roundResult.message}
              </h2>
               <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2">
                 <Stethoscope size={18} /> Clinical Review
               </p>
            </div>
            <div className="flex-shrink-0 bg-slate-900 p-4 rounded-full border border-slate-600">
               {roundResult.success ? <CheckCircle size={64} className="text-green-500" /> : <AlertTriangle size={64} className="text-red-500" />}
            </div>
          </div>

          {/* AI Clinical Note */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border-l-4 border-purple-500 mb-8 shadow-inner">
             <div className="flex items-center gap-3 mb-3 text-purple-400 font-bold uppercase tracking-wide text-sm">
               <BrainCircuit size={20} />
               Senior Specialist Evaluation
             </div>
             <p className="text-slate-200 text-lg italic leading-relaxed font-serif">
               "{roundResult.reasoning}"
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* User Selection */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-blue-500 transition-colors">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
               <h3 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2">
                  <ClipboardCheck size={14}/> Your Prescription
               </h3>
               <div className="space-y-1">
                 <p className="text-white font-bold text-xl">{lastPrescription.drug.name}</p>
                 <p className="text-slate-300 font-mono text-sm">
                   {lastPrescription.doseMg}mg | q{lastPrescription.intervalHours}h | {lastPrescription.durationDays} days
                 </p>
                 <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-500">TOTAL LOAD</span>
                    <span className="text-blue-400 font-mono text-sm">
                        {Math.floor(lastPrescription.doseMg * (24/lastPrescription.intervalHours) * lastPrescription.durationDays).toLocaleString()} mg
                    </span>
                 </div>
               </div>
            </div>

            {/* Correct Selection */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-green-500 transition-colors">
               <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
               <h3 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2">
                  <BookOpen size={14}/> Gold Standard
               </h3>
               <div className="space-y-1">
                 <p className="text-white font-bold text-xl">{getDrugName(currentDisease.optimalTreatment.drugId)}</p>
                 <p className="text-slate-300 font-mono text-sm">
                   {currentDisease.optimalTreatment.doseMg}mg | q{currentDisease.optimalTreatment.intervalHours}h | {currentDisease.optimalTreatment.durationDays} days
                 </p>
                 <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-500">TARGET LOAD</span>
                    <span className="text-green-400 font-mono text-sm">
                        {Math.floor(currentDisease.optimalTreatment.doseMg * (24/currentDisease.optimalTreatment.intervalHours) * currentDisease.optimalTreatment.durationDays).toLocaleString()} mg
                    </span>
                 </div>
               </div>
            </div>
          </div>
          
          <button 
            onClick={nextLevel}
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 w-full shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-green-900/20 text-lg"
          >
            Next Patient <ArrowRight size={24} />
          </button>
        </div>
      )}

      {phase === GamePhase.GAME_OVER && (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 animate-fade-in my-10">
          <div className="text-center mb-8">
             <Skull size={80} className="text-red-600 mx-auto mb-6 animate-bounce" />
             <h1 className="text-5xl font-bold text-white mb-4">PATIENT LOST</h1>
             <p className="text-xl text-red-400">
               {stats.bpSystolic < 80 ? "Cause of Death: Septic Shock" : "Cause of Death: Acute Renal Failure"}
             </p>
          </div>

          {lastPrescription && (
            <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full border border-slate-700 mb-8">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                  <Stethoscope size={24} className="text-slate-400" /> 
                  <h2 className="text-2xl font-bold text-white">Post-Mortem Analysis</h2>
               </div>

               {/* AI Clinical Note */}
               {aiEvaluation?.reasoning && (
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border-l-4 border-purple-500 mb-8 shadow-inner text-left">
                    <div className="flex items-center gap-3 mb-3 text-purple-400 font-bold uppercase tracking-wide text-sm">
                    <BrainCircuit size={20} />
                    Senior Specialist Evaluation
                    </div>
                    <p className="text-slate-200 text-lg italic leading-relaxed font-serif">
                    "{aiEvaluation.reasoning}"
                    </p>
                </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                    {/* User Selection */}
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 relative overflow-hidden opacity-75">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <h3 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2">
                            <ClipboardCheck size={14}/> Fatal Prescription
                        </h3>
                        <div className="space-y-1">
                            <p className="text-white font-bold text-xl">{lastPrescription.drug.name}</p>
                            <p className="text-slate-300 font-mono text-sm">
                            {lastPrescription.doseMg}mg | q{lastPrescription.intervalHours}h | {lastPrescription.durationDays} days
                            </p>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-500">TOTAL LOAD</span>
                                <span className="text-red-400 font-mono text-sm">
                                    {Math.floor(lastPrescription.doseMg * (24/lastPrescription.intervalHours) * lastPrescription.durationDays).toLocaleString()} mg
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Correct Selection */}
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <h3 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2">
                            <BookOpen size={14}/> Gold Standard
                        </h3>
                        <div className="space-y-1">
                            <p className="text-white font-bold text-xl">{getDrugName(currentDisease.optimalTreatment.drugId)}</p>
                            <p className="text-slate-300 font-mono text-sm">
                            {currentDisease.optimalTreatment.doseMg}mg | q{currentDisease.optimalTreatment.intervalHours}h | {currentDisease.optimalTreatment.durationDays} days
                            </p>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-500">TARGET LOAD</span>
                                <span className="text-green-400 font-mono text-sm">
                                    {Math.floor(currentDisease.optimalTreatment.doseMg * (24/currentDisease.optimalTreatment.intervalHours) * currentDisease.optimalTreatment.durationDays).toLocaleString()} mg
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}

          <button 
            onClick={goHome}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg w-full max-w-md"
          >
            Return to Menu
          </button>
        </div>
      )}
    </div>
  );
}