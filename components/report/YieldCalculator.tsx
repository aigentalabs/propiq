import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

interface YieldCalculatorProps {
    marketPrice: number;
    quickSalePrice: number;
    expenses?: number; // monthly ARS
    listingType: 'sale' | 'rent';
    avgPricePerM2: number;
}

const UVA_RATE = 0.08;       // ~8% TNA estimated UVA
const FIXED_RATE = 0.12;     // ~12% TNA estimated tasa fija
const PLAZO_FIJO_RATE = 0.35; // ~35% TNA reference plazo fijo
const USD_TO_ARS = 1250;      // approximate exchange rate for ARS expenses

const formatPct = (n: number) => `${(n * 100).toFixed(1)}%`;

const YieldCalculator: React.FC<YieldCalculatorProps> = ({
    marketPrice, quickSalePrice, expenses, listingType, avgPricePerM2
}) => {
    const [monthlyRent, setMonthlyRent] = useState<number>(
        Math.round(marketPrice * 0.004) // default: ~0.4% monthly as starting point
    );
    const [downPaymentPct, setDownPaymentPct] = useState(30);
    const [years, setYears] = useState(20);
    const [rateType, setRateType] = useState<'uva' | 'fixed'>('uva');

    // --- YIELD CALCULATIONS ---
    const expensesUSD = expenses ? expenses / USD_TO_ARS : 0;
    const ablEstimate = marketPrice * 0.003 / 12; // ~0.3% annual estimate
    const netMonthlyRent = monthlyRent - expensesUSD - ablEstimate;
    const grossYield = (monthlyRent * 12) / marketPrice;
    const netYield = (netMonthlyRent * 12) / marketPrice;
    const paybackYears = monthlyRent > 0 ? (marketPrice / (monthlyRent * 12)).toFixed(1) : '—';

    // --- MORTGAGE CALCULATIONS ---
    const loanAmount = marketPrice * (1 - downPaymentPct / 100);
    const downPaymentUSD = marketPrice * (downPaymentPct / 100);
    const rate = rateType === 'uva' ? UVA_RATE : FIXED_RATE;
    const monthlyRate = rate / 12;
    const n = years * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const requiredIncome = monthlyPayment / 0.30; // 30% debt-to-income ratio
    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - loanAmount;

    return (
        <div className="mb-12">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Análisis de Rentabilidad & Financiamiento
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* YIELD SECTION */}
                <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Yield & Rentabilidad</h4>
                        <span className="text-[9px] text-slate-500 font-bold">en USD</span>
                    </div>

                    {/* Rent Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-400">Alquiler mensual estimado</label>
                            <span className="text-sm font-black text-white">{formatCurrency(monthlyRent)}/mes</span>
                        </div>
                        <input
                            type="range"
                            min={100} max={Math.round(marketPrice * 0.01)} step={50}
                            value={monthlyRent}
                            onChange={e => setMonthlyRent(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-emerald-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                            <span>{formatCurrency(100)}</span>
                            <span>{formatCurrency(Math.round(marketPrice * 0.01))}</span>
                        </div>
                    </div>

                    {/* Yield metrics */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Yield Bruto Anual</p>
                            <p className="text-xl font-black text-emerald-400">{formatPct(grossYield)}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Yield Neto Anual</p>
                            <p className="text-xl font-black text-white">{formatPct(netYield)}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Recupero Inversión</p>
                            <p className="text-xl font-black text-indigo-400">{paybackYears} años</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Renta neta/mes</p>
                            <p className="text-xl font-black text-white">{formatCurrency(netMonthlyRent)}</p>
                        </div>
                    </div>

                    {/* vs Plazo Fijo */}
                    <div className={`p-3 rounded-xl border text-[11px] font-medium ${grossYield > PLAZO_FIJO_RATE ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                        {grossYield > PLAZO_FIJO_RATE
                            ? `✓ Supera el plazo fijo (ref. ${formatPct(PLAZO_FIJO_RATE)} TNA) por ${formatPct(grossYield - PLAZO_FIJO_RATE)}`
                            : `⚠ Por debajo del plazo fijo (ref. ${formatPct(PLAZO_FIJO_RATE)} TNA) — ajustá el alquiler`}
                    </div>
                </div>

                {/* MORTGAGE SECTION */}
                <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Simulador Hipotecario</h4>
                        <span className="text-[9px] text-slate-500 font-bold">referencial</span>
                    </div>

                    {/* Rate type toggle */}
                    <div className="flex gap-2">
                        {(['uva', 'fixed'] as const).map(r => (
                            <button key={r} type="button" onClick={() => setRateType(r)}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${rateType === r ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-black/20 border-white/5 text-slate-500 hover:text-slate-300'}`}>
                                {r === 'uva' ? `UVA (${formatPct(UVA_RATE)})` : `Tasa fija (${formatPct(FIXED_RATE)})`}
                            </button>
                        ))}
                    </div>

                    {/* Sliders */}
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-slate-400">Anticipo</label>
                                <span className="text-xs font-black text-white">{downPaymentPct}% — {formatCurrency(downPaymentUSD)}</span>
                            </div>
                            <input type="range" min={10} max={80} step={5} value={downPaymentPct}
                                onChange={e => setDownPaymentPct(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-white/10 accent-indigo-500 cursor-pointer" />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-slate-400">Plazo</label>
                                <span className="text-xs font-black text-white">{years} años</span>
                            </div>
                            <input type="range" min={5} max={30} step={1} value={years}
                                onChange={e => setYears(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-white/10 accent-indigo-500 cursor-pointer" />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Cuota mensual</p>
                            <p className="text-lg font-black text-indigo-400">{formatCurrency(monthlyPayment)}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Ingreso mínimo</p>
                            <p className="text-lg font-black text-white">{formatCurrency(requiredIncome)}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Préstamo</p>
                            <p className="text-lg font-black text-slate-300">{formatCurrency(loanAmount)}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Interés total</p>
                            <p className="text-lg font-black text-amber-400">{formatCurrency(totalInterest)}</p>
                        </div>
                    </div>

                    <p className="text-[9px] text-slate-600 italic">
                        * Cuota calculada en USD sobre TNA referencial. Los bancos operan en ARS indexados. Consultar con el banco emisor.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default YieldCalculator;
