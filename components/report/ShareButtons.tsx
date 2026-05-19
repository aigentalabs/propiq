import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

interface ShareButtonsProps {
    address: string;
    marketPrice: number;
    quickSalePrice: number;
    executiveSummary: string;
    avgPricePerM2: number;
    listingType: 'sale' | 'rent';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ address, marketPrice, quickSalePrice, executiveSummary, avgPricePerM2, listingType }) => {
    const [copied, setCopied] = useState(false);

    const operationType = listingType === 'sale' ? 'Venta' : 'Alquiler';

    const shareText = [
        `📊 *PropIQ — Tasación Inteligente*`,
        ``,
        `📍 *${address}*`,
        `🏷️ Operación: ${operationType}`,
        ``,
        `💰 *Valor de Mercado: ${formatCurrency(marketPrice)}*`,
        `⚡ Venta Rápida: ${formatCurrency(quickSalePrice)}`,
        `📐 Métrica: ${formatCurrency(avgPricePerM2)}/m²`,
        ``,
        `📋 ${executiveSummary.substring(0, 200)}${executiveSummary.length > 200 ? '...' : ''}`,
        ``,
        `_Generado con PropIQ by Aigenta_`
    ].join('\n');

    const handleWhatsApp = () => {
        const encoded = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${encoded}`, '_blank');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareText.replace(/\*/g, ''));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = shareText.replace(/\*/g, '');
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(`Tasación PropIQ — ${address}`);
        const body = encodeURIComponent(shareText.replace(/\*/g, '').replace(/_/g, ''));
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    };

    return (
        <div className="mb-12 pdf-exclude">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-4 sm:mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartir Tasación
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* WhatsApp */}
                <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center gap-3 py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-black text-xs uppercase tracking-widest hover:bg-[#25D366]/20 active:scale-[0.98] transition-all"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>WhatsApp</span>
                </button>

                {/* Copy Summary */}
                <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-3 py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl border font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all ${
                        copied
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {copied ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>¡Copiado!</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>Copiar Resumen</span>
                        </>
                    )}
                </button>

                {/* Email */}
                <button
                    onClick={handleEmail}
                    className="flex-1 flex items-center justify-center gap-3 py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email</span>
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
