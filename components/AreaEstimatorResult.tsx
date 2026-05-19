import React, { useState } from 'react';

interface AreaEstimationResult {
    estimatedWidth: number;
    estimatedLength: number;
    estimatedM2: number;
    confidence: 'alta' | 'media' | 'baja';
    references: string[];
    notes: string;
    disclaimer: string;
}

interface AreaEstimatorResultProps {
    result: AreaEstimationResult;
    imagePreview: string;
    roomLabel: string;
    onAccept: (m2: number, label: string) => void;
    onRetry: () => void;
}

const confidenceConfig = {
    alta: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: '✓ Alta confianza', dot: 'bg-emerald-500' },
    media: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: '~ Confianza media', dot: 'bg-amber-500' },
    baja: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: '! Baja confianza', dot: 'bg-red-500' },
};

const AreaEstimatorResult: React.FC<AreaEstimatorResultProps> = ({ result, imagePreview, roomLabel, onAccept, onRetry }) => {
    const [width, setWidth] = useState(result.estimatedWidth);
    const [length, setLength] = useState(result.estimatedLength);
    const computedM2 = parseFloat((width * length).toFixed(2));

    const conf = confidenceConfig[result.confidence];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
            <div className="bg-[#0f172a] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-y-auto" style={{ maxHeight: '95vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div>
                        <h2 className="text-base font-black text-white uppercase tracking-tight">Resultado de estimación</h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">{roomLabel}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${conf.bg} ${conf.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                        {conf.label}
                    </div>
                </div>

                <div className="p-5 space-y-5">
                    {/* Image + M² overlay */}
                    <div className="relative rounded-2xl overflow-hidden bg-black">
                        <img src={imagePreview} alt="Ambiente analizado" className="w-full object-cover" style={{ maxHeight: '200px' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <p className="text-4xl font-black text-white">{computedM2} <span className="text-xl text-slate-400">m²</span></p>
                            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">{width.toFixed(1)}m × {length.toFixed(1)}m</p>
                        </div>
                    </div>

                    {/* Adjustable sliders */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ajustar dimensiones</p>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-slate-400">Ancho</label>
                                <span className="text-sm font-black text-white">{width.toFixed(1)} m</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="15" step="0.1"
                                value={width}
                                onChange={e => setWidth(parseFloat(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-white/10 accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                                <span>1m</span><span>15m</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-slate-400">Largo</label>
                                <span className="text-sm font-black text-white">{length.toFixed(1)} m</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="20" step="0.1"
                                value={length}
                                onChange={e => setLength(parseFloat(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-white/10 accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                                <span>1m</span><span>20m</span>
                            </div>
                        </div>
                    </div>

                    {/* AI reasoning */}
                    <div className="bg-black/20 rounded-2xl p-4 space-y-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Referencias usadas por la IA</p>
                        <ul className="space-y-1.5">
                            {result.references.map((ref, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                    <span className="text-emerald-500 flex-shrink-0">→</span>
                                    {ref}
                                </li>
                            ))}
                        </ul>
                        {result.notes && (
                            <p className="text-[11px] text-slate-500 italic border-t border-white/5 pt-3">{result.notes}</p>
                        )}
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-amber-400/80 italic">{result.disclaimer}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pb-1">
                        <button
                            onClick={onRetry}
                            className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition-all"
                        >
                            Reintentar
                        </button>
                        <button
                            onClick={() => onAccept(computedM2, roomLabel)}
                            className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Usar {computedM2} m²
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreaEstimatorResult;
