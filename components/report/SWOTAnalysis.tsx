import React from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';

interface SWOTAnalysisProps {
    strengths: string[];
    weaknesses: string[];
}

const SWOTAnalysis: React.FC<SWOTAnalysisProps> = ({ strengths, weaknesses }) => {
    return (
        <div className="print:break-after-page mb-12">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                <LightBulbIcon className="w-5 h-5 mr-3" />
                Análisis SWOT (F.O.D.A.) del Activo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-emerald-500/5 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-emerald-500/20 print:break-inside-avoid group hover:bg-emerald-500/10 transition-all duration-500">
                    <h4 className="text-[10px] font-black text-emerald-400 mb-4 flex items-center uppercase tracking-widest">
                        <CheckCircleIcon className="w-5 h-5 mr-3" />Diferenciales Competitivos
                    </h4>
                    <ul className="space-y-3 text-xs text-slate-300 font-light italic leading-relaxed">
                        {strengths.map((s, i) => <li key={i} className="flex gap-2"><span>+</span> {s}</li>)}
                    </ul>
                </div>
                <div className="bg-red-500/5 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-red-500/20 print:break-inside-avoid group hover:bg-red-500/10 transition-all duration-500">
                    <h4 className="text-[10px] font-black text-red-400 mb-4 flex items-center uppercase tracking-widest">
                        <XCircleIcon className="w-5 h-5 mr-3" />Fricciones de Mercado
                    </h4>
                    <ul className="space-y-3 text-xs text-slate-300 font-light italic leading-relaxed">
                        {weaknesses.map((w, i) => <li key={i} className="flex gap-2"><span>-</span> {w}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SWOTAnalysis;
