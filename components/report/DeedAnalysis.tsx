import React from 'react';
import { DeedAnalysis as DeedAnalysisType, RecentSale } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { DocumentCheckIcon } from '../icons/DocumentCheckIcon';
import { InformationCircleIcon } from '../icons/InformationCircleIcon';

interface DeedAnalysisProps {
    deedAnalysis: DeedAnalysisType;
}

const DeedAnalysis: React.FC<DeedAnalysisProps> = ({ deedAnalysis }) => {
    return (
        <div className="print:break-after-page">
            <div className="print:break-after-page mb-12">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    <DocumentCheckIcon className="w-5 h-5 mr-3" />
                    Official Deeds Forensic Analysis
                </h3>

                {/* Summary */}
                <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5 text-sm text-slate-400 mb-6 sm:mb-8 print:break-inside-avoid relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-[10px] font-black text-emerald-400 mb-3 uppercase tracking-widest">Geo-Registry Summary</p>
                    <p className="font-light leading-relaxed mb-4 italic">"{deedAnalysis.summary}"</p>
                    <a href={deedAnalysis.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors">
                        Validar en Colegio de Escribanos <span>&rarr;</span>
                    </a>
                </div>

                {/* Disclaimer */}
                <div className="bg-indigo-500/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 print:break-inside-avoid">
                    <InformationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-400" />
                    <div className="font-light italic leading-relaxed">
                        <span className="font-black uppercase tracking-widest block mb-1">Nota de Cumplimiento Técnico:</span>
                        {deedAnalysis.disclaimer}
                    </div>
                </div>

                {/* Local Deeds Table */}
                {deedAnalysis.localDeeds && deedAnalysis.localDeeds.length > 0 && (
                    <div className="print:break-inside-avoid bg-black/20 p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5">
                        <h4 className="text-[10px] font-black text-slate-500 mb-4 sm:mb-6 uppercase tracking-widest">Escrituras Recientes Validadas (Entorno)</h4>

                        {/* Mobile: Card layout */}
                        <div className="sm:hidden space-y-3">
                            {deedAnalysis.localDeeds.map((deed: RecentSale, i: number) => (
                                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-slate-300 font-bold text-xs mb-1">{deed.address}</p>
                                    <p className="text-[10px] text-slate-500 mb-2">{deed.saleDate}</p>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300 font-black text-xs">{formatCurrency(deed.pricePerM2)}/m²</span>
                                        <span className="text-white font-black text-xs">{formatCurrency(deed.priceUSD)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop: Table layout */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/5 text-[11px]">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-widest">Ubicación</th>
                                        <th className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-widest">Fecha Registro</th>
                                        <th className="px-4 py-3 text-right font-black text-slate-500 uppercase tracking-widest">Escritura/m²</th>
                                        <th className="px-4 py-3 text-right font-black text-slate-500 uppercase tracking-widest">Monto Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {deedAnalysis.localDeeds.map((deed: RecentSale, i: number) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap text-slate-300 font-bold">{deed.address}</td>
                                            <td className="px-4 py-4 text-slate-500">{deed.saleDate}</td>
                                            <td className="px-4 py-4 text-right text-slate-300 font-black">{formatCurrency(deed.pricePerM2)}</td>
                                            <td className="px-4 py-4 text-right text-white font-black">{formatCurrency(deed.priceUSD)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeedAnalysis;
