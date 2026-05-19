import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { TagIcon } from '../icons/TagIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';

interface PricingMatrixProps {
    quickSalePrice: number;
    marketPrice: number;
    futurePotentialAnalysis: string;
}

const PricingMatrix: React.FC<PricingMatrixProps> = ({ quickSalePrice, marketPrice, futurePotentialAnalysis }) => {
    return (
        <>
            {/* Pricing Scenarios */}
            <div className="mb-12 print:break-after-page">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    <TagIcon className="w-5 h-5 mr-3" />
                    Pricing Matrix (Confidence Intervals)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-black/20 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 text-center group hover:border-emerald-500/30 transition-all duration-500">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 mb-4">Escenario de Alta Rotación</p>
                        <p className="text-3xl sm:text-4xl font-black text-white mb-2">{formatCurrency(quickSalePrice)}</p>
                        <div className="w-12 h-[2px] bg-emerald-500/30 mx-auto mb-4"></div>
                        <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-tighter">Liquidación Preferente (30-60 Días)</p>
                    </div>
                    <div className="bg-emerald-500/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-emerald-500/30 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden group hover:bg-emerald-500/20 transition-all duration-500">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-black px-3 sm:px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Recomendado</div>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-400 mb-4">Valor Óptimo de Mercado</p>
                        <p className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tighter">{formatCurrency(marketPrice)}</p>
                        <div className="w-12 h-[2px] bg-emerald-500 mx-auto mb-4"></div>
                        <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">Equilibrio Técnico (90-120 Días)</p>
                    </div>
                </div>
            </div>

            {/* Future Potential */}
            <div className="mb-12 print:break-after-page">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    <SparklesIcon className="w-5 h-5 mr-3" />
                    Proyección de Plusvalía & Potencial
                </h3>
                <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 text-sm sm:text-base text-slate-300 font-light leading-relaxed relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUpIcon className="w-16 sm:w-20 h-16 sm:h-20 text-emerald-400" />
                    </div>
                    {futurePotentialAnalysis}
                </div>
            </div>
        </>
    );
};

export default PricingMatrix;
