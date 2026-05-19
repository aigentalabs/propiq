import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ValuationResult, Property } from '../types';
import { formatCurrency } from './formatters';

const BRAND_DARK = '#0f172a';
const BRAND_EMERALD = '#10b981';
const BRAND_SLATE = '#94a3b8';
const BRAND_WHITE = '#f8fafc';

/**
 * Renders a DOM element to a canvas and adds it to the PDF.
 * Handles multi-page automatically.
 */
async function addElementToPDF(
    pdf: jsPDF,
    element: HTMLElement,
    startY: number,
    pageHeight: number,
    pageWidth: number,
    padding: number
): Promise<number> {
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: BRAND_DARK,
        logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const imgWidth = pageWidth - padding * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = startY;

    // If it doesn't fit on current page, add a new page
    if (y + imgHeight > pageHeight - padding) {
        pdf.addPage();
        y = padding;
    }

    pdf.addImage(imgData, 'JPEG', padding, y, imgWidth, imgHeight);
    return y + imgHeight + 8; // return next Y position with gap
}

/**
 * Draws the cover page entirely with jsPDF primitives (no html2canvas needed).
 */
function drawCoverPage(pdf: jsPDF, property: Property, result: ValuationResult) {
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();

    // Background
    pdf.setFillColor(15, 23, 42); // #0f172a
    pdf.rect(0, 0, W, H, 'F');

    // Emerald accent bar (left side)
    pdf.setFillColor(16, 185, 129); // emerald-500
    pdf.rect(0, 0, 4, H, 'F');

    // Top gradient band
    pdf.setFillColor(16, 185, 129);
    pdf.setGState(new (pdf as any).GState({ opacity: 0.06 }));
    pdf.rect(0, 0, W, H * 0.4, 'F');
    pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

    // PropIQ logo text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(32);
    pdf.setTextColor(248, 250, 252);
    pdf.text('PropIQ', 20, 30);

    pdf.setFontSize(10);
    pdf.setTextColor(16, 185, 129);
    pdf.setFont('helvetica', 'normal');
    pdf.text('by AIGENTA — Inteligencia Inmobiliaria', 20, 40);

    // Divider
    pdf.setDrawColor(16, 185, 129);
    pdf.setLineWidth(0.5);
    pdf.line(20, 48, W - 20, 48);

    // INFORME heading
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(148, 163, 184);
    pdf.text('INFORME DE TASACIÓN ESTRATÉGICA', 20, 62);

    // Address
    pdf.setFontSize(22);
    pdf.setTextColor(248, 250, 252);
    const addressLines = pdf.splitTextToSize(property.address || 'Propiedad', W - 40);
    pdf.text(addressLines, 20, 76);

    // Operation badge
    const opLabel = property.listingType === 'sale' ? 'VENTA' : 'ALQUILER';
    const opColor: [number, number, number] = property.listingType === 'sale' ? [16, 185, 129] : [99, 102, 241];
    pdf.setFillColor(...opColor);
    pdf.setGState(new (pdf as any).GState({ opacity: 0.15 }));
    pdf.roundedRect(20, 88, 38, 10, 3, 3, 'F');
    pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
    pdf.setTextColor(...opColor);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(opLabel, 24, 95);

    // Pricing section
    const yPricing = 118;
    pdf.setDrawColor(255, 255, 255);
    pdf.setGState(new (pdf as any).GState({ opacity: 0.05 }));
    pdf.roundedRect(20, yPricing - 8, W - 40, 58, 6, 6, 'F');
    pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text('VALOR ÓPTIMO DE MERCADO', 30, yPricing);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.setTextColor(16, 185, 129);
    pdf.text(formatCurrency(result.valuation.pricingScenarios.marketPrice), 30, yPricing + 16);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text('ESCENARIO DE VENTA RÁPIDA', 30, yPricing + 28);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(248, 250, 252);
    pdf.text(formatCurrency(result.valuation.pricingScenarios.quickSalePrice), 30, yPricing + 38);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`PRECIO PROMEDIO POR m²: ${formatCurrency(result.valuation.avgPricePerM2)}`, 30, yPricing + 50);

    // Executive summary
    const ySummary = yPricing + 68;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(16, 185, 129);
    pdf.text('RESUMEN EJECUTIVO', 20, ySummary);

    pdf.setDrawColor(16, 185, 129);
    pdf.setLineWidth(0.3);
    pdf.line(20, ySummary + 2, 100, ySummary + 2);

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.setTextColor(203, 213, 225);
    const summaryLines = pdf.splitTextToSize(result.executiveSummary, W - 40);
    const maxLines = summaryLines.slice(0, 8); // max 8 lines on cover
    pdf.text(maxLines, 20, ySummary + 10);

    // Property specs grid
    const ySpecs = ySummary + 10 + maxLines.length * 5.5 + 12;
    const specs = [
        { label: 'TIPO', value: property.propertyType.join(' / ').toUpperCase() },
        { label: 'COBERTURA', value: `${property.coveredArea} m²` },
        { label: 'DORMITORIOS', value: String(property.bedrooms) },
        { label: 'BAÑOS', value: String(property.bathrooms) },
        { label: 'COCHERAS', value: String(property.garages) },
        { label: 'ANTIGÜEDAD', value: property.age === 0 ? 'A estrenar' : `${property.age} años` },
    ];

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(16, 185, 129);
    pdf.text('ESPECIFICACIONES TÉCNICAS', 20, ySpecs);

    const colWidth = (W - 40) / 3;
    specs.forEach((spec, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * colWidth;
        const y = ySpecs + 10 + row * 16;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.text(spec.label, x, y);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(248, 250, 252);
        pdf.text(spec.value, x, y + 7);
    });

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(71, 85, 105);
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
    pdf.text(`Generado el ${dateStr} · PropIQ by Aigenta Labs · Uso confidencial`, 20, H - 12);
    pdf.text('© 2026 Aigenta. Todos los derechos reservados.', W - 20, H - 12, { align: 'right' });

    // Watermark
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(60);
    pdf.setTextColor(16, 185, 129);
    pdf.setGState(new (pdf as any).GState({ opacity: 0.03 }));
    pdf.text('PROPIQ', W / 2, H / 2 + 10, { align: 'center', angle: 45 });
    pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
}

/**
 * Draws a consistent page header/footer for content pages.
 */
function drawPageChrome(pdf: jsPDF, property: Property, pageNum: number) {
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();

    // Background
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, W, H, 'F');

    // Left accent
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, 0, 3, H, 'F');

    // Header bar
    pdf.setFillColor(255, 255, 255);
    pdf.setGState(new (pdf as any).GState({ opacity: 0.03 }));
    pdf.rect(3, 0, W - 3, 16, 'F');
    pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(16, 185, 129);
    pdf.text('PropIQ', 10, 10);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(property.address || 'Reporte de Tasación', W / 2, 10, { align: 'center' });
    pdf.text(`Pág. ${pageNum}`, W - 10, 10, { align: 'right' });

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6);
    pdf.setTextColor(51, 65, 85);
    pdf.text('Documento confidencial generado por PropIQ — Aigenta Labs © 2026', W / 2, H - 5, { align: 'center' });
}

/**
 * Main PDF generation service.
 * Renders key sections as canvas screenshots and composes them into a multi-page PDF.
 */
export async function generatePDF(
    reportElement: HTMLElement,
    property: Property,
    result: ValuationResult,
    onProgress?: (pct: number) => void
): Promise<void> {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();
    const PADDING = 12;

    // --- PAGE 1: Cover ---
    onProgress?.(10);
    drawCoverPage(pdf, property, result);

    // --- PAGES 2+: Report sections as screenshots ---
    // Find all the section containers we want to capture
    const sections = reportElement.querySelectorAll<HTMLElement>('[data-pdf-section]');

    onProgress?.(20);

    if (sections.length === 0) {
        // Fallback: capture the entire report element at once
        pdf.addPage();
        drawPageChrome(pdf, property, 2);
        await addElementToPDF(pdf, reportElement, 20, H, W, PADDING);
    } else {
        let pageNum = 2;
        let currentY = 20;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const progress = 20 + Math.round((i / sections.length) * 70);
            onProgress?.(progress);

            // Add new page for each section
            pdf.addPage();
            drawPageChrome(pdf, property, pageNum);
            currentY = 22;

            currentY = await addElementToPDF(pdf, section, currentY, H, W, PADDING);
            pageNum++;
        }
    }

    onProgress?.(95);

    // Save
    const addressSlug = (property.address || 'propiedad')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .substring(0, 40);

    pdf.save(`PropIQ_Tasacion_${addressSlug}.pdf`);
    onProgress?.(100);
}
