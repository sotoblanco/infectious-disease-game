import React, { useState, useMemo } from 'react';
import { DRUG_FAMILIES, DOSAGES, INTERVALS, DURATIONS } from '../constants';
import { Disease, Drug, Prescription } from '../types';
import { Pill, Clock, Calendar, Syringe } from 'lucide-react';

interface Props {
  disease: Disease;
  onPrescribe: (prescription: Prescription) => void;
}

export const PrescriptionPhase: React.FC<Props> = ({ disease, onPrescribe }) => {
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [selectedDrugId, setSelectedDrugId] = useState<string>('');
  const [dose, setDose] = useState<number>(500);
  const [interval, setInterval] = useState<number>(12);
  const [duration, setDuration] = useState<number>(7);

  const selectedFamily = useMemo(() => 
    DRUG_FAMILIES.find(f => f.id === selectedFamilyId), 
  [selectedFamilyId]);

  const availableDrugs = useMemo(() => 
    selectedFamily ? selectedFamily.drugs : [], 
  [selectedFamily]);

  const handlePrescribe = () => {
    const drug = availableDrugs.find(d => d.id === selectedDrugId);
    if (!drug) return;

    onPrescribe({
      drug,
      doseMg: dose,
      intervalHours: interval,
      durationDays: duration
    });
  };

  // Calculate Total Bio-Load (Mg) to show player the "Power" of their prescription
  const totalLoadMg = dose * (24 / interval) * duration;
  const estimatedAmmo = Math.floor(totalLoadMg / 1000); // 1000 is the constant MG_PER_SHOT from App.tsx

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl max-w-2xl w-full border border-slate-700">
      <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
        <Syringe className="text-blue-500" /> Rx: {disease.name}
      </h2>
      <p className="text-slate-400 mb-6 italic border-l-4 border-blue-500 pl-4">
        "{disease.description}"
        <br/>
        <span className="text-sm font-bold text-slate-300">Suspected Pathogen: {disease.pathogen}</span>
      </p>

      <div className="space-y-6">
        {/* Drug Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Drug Class</label>
            <select 
              className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-blue-500 outline-none"
              value={selectedFamilyId}
              onChange={(e) => {
                setSelectedFamilyId(e.target.value);
                setSelectedDrugId('');
              }}
            >
              <option value="">Select Class...</option>
              {DRUG_FAMILIES.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Specific Agent</label>
            <select 
              className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-blue-500 outline-none disabled:opacity-50"
              value={selectedDrugId}
              onChange={(e) => setSelectedDrugId(e.target.value)}
              disabled={!selectedFamilyId}
            >
              <option value="">Select Drug...</option>
              {availableDrugs.map(d => (
                <option key={d.id} value={d.id}>{d.name} (Tox: {d.nephrotoxicity}/10)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dosing Matrix - Updated to Selects for handling large lists */}
        <div className="grid grid-cols-3 gap-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2 flex items-center gap-1">
              <Pill size={12} /> Dose
            </label>
            <select
              value={dose}
              onChange={(e) => setDose(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
            >
              {DOSAGES.map(d => (
                <option key={d} value={d}>{d} mg</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2 flex items-center gap-1">
              <Clock size={12} /> Interval
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-purple-500 outline-none"
            >
              {INTERVALS.map(i => (
                <option key={i} value={i}>
                    {i === 24 ? "Every 24h (Daily)" : 
                     i === 48 ? "Every 48h / Single" : 
                     `Every ${i} Hours`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2 flex items-center gap-1">
              <Calendar size={12} /> Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-green-500 outline-none"
            >
              {DURATIONS.map(d => (
                <option key={d} value={d}>{d} Days</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between border-t border-slate-700 pt-4">
          <div className="text-slate-300 text-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-xs uppercase font-bold text-slate-500">Total Bio-Load</span>
              <span className="font-mono text-white">{totalLoadMg.toLocaleString()} mg</span>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-xs uppercase font-bold text-blue-500">Base Power</span>
               <span className="font-bold text-white text-xl">{estimatedAmmo}</span>
            </div>
          </div>
          <button
            onClick={handlePrescribe}
            disabled={!selectedDrugId}
            className="bg-blue-500 hover:bg-blue-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold shadow-lg transform transition-all active:scale-95"
          >
            CONFIRM TREATMENT
          </button>
        </div>
      </div>
    </div>
  );
};