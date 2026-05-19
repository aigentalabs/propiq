import React from 'react';
import { Comparable } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { SwitchHorizontalIcon } from '../icons/SwitchHorizontalIcon';

interface ComparableCardProps {
    comparable: Comparable;
}

const comparisonStyles = {
    Superior: { text: 'Superior a nuestro inmueble', icon: <ArrowUpIcon />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    Igual: { text: 'Igual a nuestro inmueble', icon: <SwitchHorizontalIcon />, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
    Inferior: { text: 'Inferior a nuestro inmueble', icon: <ArrowDownIcon />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' }
};

const ComparableCard: React.FC<ComparableCardProps> = ({ comparable }) => {
    const style = comparable.visualComparisonResult ? comparisonStyles[comparable.visualComparisonResult] : null;

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col print:break-inside-avoid group hover:border-emerald-500/30 transition-all duration-500">
            {comparable.imageUrl && (
                <div className="h-40 sm:h-48 bg-black/40 relative overflow-hidden">
                    <img
                        src={comparable.imageUrl}
                        alt={comparable.address}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            const container = e.currentTarget.parentElement;
                            if (container) container.style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
            )}
            <div className="p-4 sm:p-6 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-3 gap-2">
                    <a href={comparable.url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-tighter line-clamp-1 min-w-0">
                        {comparable.address}
                    </a>
                    <span className={`px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border shadow-lg flex-shrink-0 ${comparable.status === 'Sold' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        comparable.status === 'Reserved' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        }`}>
                        {comparable.status}
                    </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fuente: {comparable.sourcePortal}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Precio Cierre/Lista</p>
                        <p className="text-lg sm:text-xl font-black text-white">{formatCurrency(comparable.priceUSD)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Métrica m²</p>
                        <p className="text-lg sm:text-xl font-black text-white">{formatCurrency(comparable.pricePerM2)} <span className="text-[10px] text-slate-500">/m²</span></p>
                    </div>
                </div>
                <div className="mt-auto">
                    {style && (
                        <div className={`mb-4 p-3 rounded-xl sm:rounded-2xl border text-center font-black text-[9px] sm:text-[10px] uppercase tracking-widest ${style.bg} ${style.color} shadow-lg`}>
                            <span className="flex items-center justify-center gap-2">
                                {style.icon}
                                {style.text}
                            </span>
                        </div>
                    )}
                    <div className="bg-black/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Análisis de Justificación</p>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed">{comparable.comparisonReason}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparableCard;
