import React, { useState } from 'react';
import { HistoryRecord, deleteHistoryRecord, clearHistory, formatHistoryDate } from '../services/historyService';
import { formatCurrency } from '../utils/formatters';

interface HistoryPanelProps {
    records: HistoryRecord[];
    onLoad: (record: HistoryRecord) => void;
    onClose: () => void;
    onRefresh: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ records, onLoad, onClose, onRefresh }) => {
    const [confirmClear, setConfirmClear] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        deleteHistoryRecord(id);
        setDeletingId(null);
        onRefresh();
    };

    const handleClear = () => {
        clearHistory();
        setConfirmClear(false);
        onRefresh();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
            <div className="bg-[#0f172a] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5 flex-shrink-0">
                    <div>
                        <h2 className="text-base font-black text-white uppercase tracking-tight">📁 Historial de Tasaciones</h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">{records.length} tasación{records.length !== 1 ? 'es' : ''} guardada{records.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {records.length > 0 && (
                            <button
                                onClick={() => setConfirmClear(true)}
                                className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                            >
                                Borrar todo
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Confirm clear */}
                {confirmClear && (
                    <div className="p-4 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between gap-4">
                        <p className="text-xs text-red-400 font-medium">¿Borrar todo el historial permanentemente?</p>
                        <div className="flex gap-2">
                            <button onClick={() => setConfirmClear(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-[10px] font-black uppercase hover:bg-white/10 transition-all">Cancelar</button>
                            <button onClick={handleClear} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-black uppercase hover:bg-red-500/30 transition-all">Sí, borrar</button>
                        </div>
                    </div>
                )}

                {/* Records list */}
                <div className="overflow-y-auto flex-1">
                    {records.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm font-bold">Sin tasaciones guardadas</p>
                            <p className="text-xs mt-1 text-slate-700">Completá una tasación para verla aquí</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {records.map(record => (
                                <div key={record.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-colors group">
                                    <div className="flex items-stretch">
                                        {/* Thumbnail */}
                                        <div className="w-20 sm:w-24 flex-shrink-0 bg-black/30">
                                            {record.uploadedImages[0] ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${record.uploadedImages[0]}`}
                                                    alt="Propiedad"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 p-3 sm:p-4 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className="text-xs sm:text-sm font-black text-white truncate leading-tight">
                                                    {record.property.address || 'Sin dirección'}
                                                </p>
                                                <span className={`flex-shrink-0 text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${record.property.listingType === 'sale' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                    {record.property.listingType === 'sale' ? 'Venta' : 'Alquiler'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mb-2">{formatHistoryDate(record.createdAt)}</p>
                                            <div className="flex items-center justify-between gap-2">
                                                <div>
                                                    <p className="text-[9px] text-slate-600 uppercase font-bold">Valor mercado</p>
                                                    <p className="text-sm font-black text-emerald-400">{formatCurrency(record.result.valuation.pricingScenarios.marketPrice)}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {deletingId === record.id ? (
                                                        <>
                                                            <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-lg bg-white/5 text-slate-500 text-[9px] font-black uppercase hover:bg-white/10 transition-all">No</button>
                                                            <button onClick={() => handleDelete(record.id)} className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[9px] font-black uppercase hover:bg-red-500/30 transition-all">Sí</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => setDeletingId(record.id)} className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => { onLoad(record); onClose(); }}
                                                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 active:scale-[0.97] transition-all"
                                                            >
                                                                Ver reporte
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPanel;
