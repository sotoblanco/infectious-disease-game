import React from 'react';
import { PlayerStats } from '../types';
import { HeartPulse, Activity, ShieldAlert, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  aiEvaluation?: {
    efficacyScore: number;
    safetyScore: number;
    title: string;
  } | null;
}

export const VitalsPanel: React.FC<Props> = ({ stats, aiEvaluation }) => {
  // Determine colors based on severity
  const bpColor = stats.bpSystolic < 90 ? 'text-red-500 animate-pulse' : 'text-green-400';
  const crColor = stats.creatinine > 1.5 ? 'text-red-500 animate-pulse' : 'text-blue-400';

  return (
    <div className="bg-slate-800 p-2 md:p-4 rounded-xl shadow-lg border border-slate-700 w-full max-w-4xl mx-auto mb-4">
      
      {/* Upper Row: Physical Vitals */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col items-center flex-1 border-r border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
            <HeartPulse size={16} /> BP (mmHg)
          </div>
          <div className={`text-2xl font-bold ${bpColor}`}>
            {Math.floor(stats.bpSystolic)} / {Math.floor(stats.bpSystolic * 0.66)}
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 border-r border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
            <Activity size={16} /> Creatinine
          </div>
          <div className={`text-2xl font-bold ${crColor}`}>
            {stats.creatinine.toFixed(2)}
          </div>
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
            <ShieldAlert size={16} /> Level
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {stats.level}
          </div>
        </div>
      </div>

      {/* Optional Lower Row: AI Evaluation Monitoring */}
      {aiEvaluation && (
        <div className="border-t border-slate-700 pt-2 mt-1 flex gap-4 justify-center">
            <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Zap size={12} className="text-yellow-400"/> Protocol Efficacy:
                </span>
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${aiEvaluation.efficacyScore > 80 ? 'bg-green-500' : aiEvaluation.efficacyScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${aiEvaluation.efficacyScore}%` }}
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck size={12} className="text-blue-400"/> Safety Rating:
                </span>
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${aiEvaluation.safetyScore > 80 ? 'bg-green-500' : aiEvaluation.safetyScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${aiEvaluation.safetyScore}%` }}
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};