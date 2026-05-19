import React, { useState } from 'react';
import { Property, ValuationResult } from '../../types';
import { DownloadIcon } from '../icons/DownloadIcon';
import { generatePDF } from '../../utils/pdfGenerator';

interface ReportActionsProps {
    property: Property;
    result: ValuationResult;
    reportRef: React.RefObject<HTMLDivElement>;
    onReset: () => void;
}

const ReportActions: React.FC<ReportActionsProps> = ({ property, result, reportRef, onReset }) => {
    const [pdfProgress, setPdfProgress] = useState<number | null>(null);
    const isGeneratingPDF = pdfProgress !== null && pdfProgress < 100;

    const handleDownloadPDF = async () => {
        const reportElement = reportRef.current;
        if (!reportElement) return;

        setPdfProgress(0);
        try {
            await generatePDF(reportElement, property, result, setPdfProgress);
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert('Error al generar el PDF. Por favor, intentá de nuevo.');
        } finally {
            setTimeout(() => setPdfProgress(null), 1500);
        }
    };

    const handleDownloadHTML = () => {
        const reportElement = reportRef.current;
        if (!reportElement) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte de Tasación - ${property.address}</title>
                <script src="https://cdn.tailwindcss.com"><\/script>
            </head>
            <body class="bg-[#0f172a] p-4 sm:p-8 font-sans text-slate-200">
                <div class="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl p-4 sm:p-8 rounded-3xl border border-white/10">
                    ${reportElement.innerHTML}
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const addressForFile = (property.address || 'propiedad').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        a.href = url;
        a.download = `tasacion_${addressForFile}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-white/5 pdf-exclude">
            {/* PDF Progress Bar */}
            {pdfProgress !== null && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            {pdfProgress < 100 ? 'Generando PDF...' : '✓ PDF listo'}
                        </span>
                        <span className="text-[10px] font-black text-slate-500">{pdfProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-300"
                            style={{ width: `${pdfProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-4">
                {/* Reset */}
                <button
                    onClick={onReset}
                    disabled={isGeneratingPDF}
                    className="w-full sm:w-auto group py-4 sm:py-5 px-8 sm:px-10 rounded-2xl bg-white/5 text-white text-xs sm:text-sm font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                    Reiniciar Secuencia
                </button>

                {/* HTML Export */}
                <button
                    onClick={handleDownloadHTML}
                    disabled={isGeneratingPDF}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 sm:py-5 px-8 sm:px-10 rounded-2xl bg-white/5 text-slate-400 text-xs sm:text-sm font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all disabled:opacity-40"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Exportar HTML
                </button>

                {/* PDF Export — primary CTA */}
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-3 sm:gap-4 py-4 sm:py-5 px-8 sm:px-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 group"
                >
                    {isGeneratingPDF ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Generando...</span>
                        </>
                    ) : (
                        <>
                            <DownloadIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-0.5 transition-transform" />
                            <span>Descargar PDF</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReportActions;
