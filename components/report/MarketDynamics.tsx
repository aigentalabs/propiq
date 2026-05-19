import React from 'react';
import { MarketInsights, RecentSale } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';

interface MarketDynamicsProps {
    marketInsights: MarketInsights;
}

const MarketDynamics: React.FC<MarketDynamicsProps> = ({ marketInsights }) => {
    return (
        <div className="print:break-after-page mb-12">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                <TrendingUpIcon className="w-5 h-5 mr-3" />
                Market Dynamics & Local Insight
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 print:break-inside-avoid">
                {/* Demand Index */}
                <div className="md:col-span-1 bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5 flex flex-col justify-center">
                    <h4 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">Absorción de Stock</h4>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 leading-tight mb-2">{marketInsights.demandIndex.title}</p>
                    <p className="text-xs text-slate-400 font-light italic leading-relaxed">{marketInsights.demandIndex.description}</p>
                </div>

                {/* Recent Sales Table */}
                <div className="md:col-span-2 bg-black/20 p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5">
                    <h4 className="text-[10px] font-black text-slate-500 mb-4 sm:mb-6 uppercase tracking-widest">Vectores de Cierre Recientes</h4>
                    
                    {/* Mobile: Card layout */}
                    <div className="sm:hidden space-y-3">
                        {marketInsights.recentSales.map((sale: RecentSale, i: number) => (
                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-slate-300 font-bold text-xs mb-1">{sale.address}</p>
                                <p className="text-[10px] text-slate-500 mb-2">{sale.saleDate}</p>
                                <div className="flex justify-between">
                                    <span className="text-slate-300 font-black text-xs">{formatCurrency(sale.pricePerM2)}/m²</span>
                                    <span className="text-emerald-400 font-black text-xs">{formatCurrency(sale.priceUSD)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table layout */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/5 text-[11px]">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-widest">Geo-Nodo</th>
                                    <th className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-4 py-3 text-right font-black text-slate-500 uppercase tracking-widest">Valor/m²</th>
                                    <th className="px-4 py-3 text-right font-black text-slate-500 uppercase tracking-widest">Asset Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {marketInsights.recentSales.map((sale: RecentSale, i: number) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap text-slate-300 font-bold">{sale.address}</td>
                                        <td className="px-4 py-4 text-slate-500">{sale.saleDate}</td>
                                        <td className="px-4 py-4 text-right text-slate-300 font-black">{formatCurrency(sale.pricePerM2)}</td>
                                        <td className="px-4 py-4 text-right text-emerald-400 font-black">{formatCurrency(sale.priceUSD)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketDynamics;
