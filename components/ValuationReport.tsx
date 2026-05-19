import React, { useRef } from 'react';
import { ValuationResult, Property } from '../types';
import { calculateWeightedM2 } from '../utils/formatters';
import ScatterPlot from './ScatterPlot';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CollectionIcon } from './icons/CollectionIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { PhotographIcon } from './icons/PhotographIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

// Sub-components
import ReportHeader from './report/ReportHeader';
import PricingMatrix from './report/PricingMatrix';
import NearbyPlaces from './report/NearbyPlaces';
import SWOTAnalysis from './report/SWOTAnalysis';
import MarketDynamics from './report/MarketDynamics';
import DeedAnalysis from './report/DeedAnalysis';
import GeoZoning from './report/GeoZoning';
import ComparableCard from './report/ComparableCard';
import ComparablesMap from './report/ComparablesMap';
import ShareButtons from './report/ShareButtons';
import ReportActions from './report/ReportActions';
import YieldCalculator from './report/YieldCalculator';

interface ValuationReportProps {
    result: ValuationResult;
    property: Property;
    onReset: () => void;
    uploadedImages: string[];
}

const ValuationReport: React.FC<ValuationReportProps> = ({ result, property, onReset, uploadedImages }) => {
    const { valuation, executiveSummary, futurePotentialAnalysis, valuationFactors, saleExpectancy, influenceZones, comparables, strengths, weaknesses, marketInsights, deedAnalysis, nearbyPlaces } = result;
    const reportRef = useRef<HTMLDivElement>(null);

    const weightedM2 = calculateWeightedM2(property.coveredArea, property.semiCoveredArea, property.uncoveredArea);

    return (
        <div className="bg-white/5 backdrop-blur-3xl p-4 sm:p-6 md:p-12 rounded-2xl sm:rounded-[40px] shadow-2xl border border-white/10 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div ref={reportRef} className="px-0 sm:px-2 relative z-10">
                <ReportHeader
                    property={property}
                    executiveSummary={executiveSummary}
                    uploadedImages={uploadedImages}
                />

                {/* Share Buttons — high visibility, right after header */}
                <ShareButtons
                    address={property.address}
                    marketPrice={valuation.pricingScenarios.marketPrice}
                    quickSalePrice={valuation.pricingScenarios.quickSalePrice}
                    executiveSummary={executiveSummary}
                    avgPricePerM2={valuation.avgPricePerM2}
                    listingType={property.listingType}
                />

                <div data-pdf-section="pricing">
                    <PricingMatrix
                        quickSalePrice={valuation.pricingScenarios.quickSalePrice}
                        marketPrice={valuation.pricingScenarios.marketPrice}
                        futurePotentialAnalysis={futurePotentialAnalysis}
                    />
                </div>

                <div data-pdf-section="nearby">
                    <NearbyPlaces nearbyPlaces={nearbyPlaces} />
                </div>

                {/* Valuation Factors */}
                <div data-pdf-section="factors" className="mb-12 print:break-after-page">
                    <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        <ScaleIcon className="w-5 h-5 mr-3" />
                        Ponderación de Atributos Críticos
                    </h3>
                    <div className="bg-black/20 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5 print:break-inside-avoid">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-light text-slate-400">
                            {valuationFactors.map((factor, index) => (
                                <li key={index} className="flex items-start mb-2 break-inside-avoid group">
                                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-emerald-500/30 transition-colors flex-shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{factor}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                    <div className="print:break-after-page mb-12">
                        <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                            <PhotographIcon className="w-5 h-5 mr-3" />
                            Imágenes de la Propiedad
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                            {uploadedImages.map((img, index) => (
                                <img key={index} src={`data:image/jpeg;base64,${img}`} alt={`Propiedad ${index + 1}`} className="rounded-xl sm:rounded-lg object-cover h-32 sm:h-40 w-full" />
                            ))}
                        </div>
                    </div>
                )}

                <div data-pdf-section="swot">
                    <SWOTAnalysis strengths={strengths} weaknesses={weaknesses} />
                </div>

                <div data-pdf-section="market">
                    <MarketDynamics marketInsights={marketInsights} />
                </div>

                <div data-pdf-section="deeds">
                    <DeedAnalysis deedAnalysis={deedAnalysis} />
                </div>

                <div data-pdf-section="zones">
                    <GeoZoning saleExpectancy={saleExpectancy} influenceZones={influenceZones} />
                </div>

                {/* Yield & Mortgage Calculator */}
                <div data-pdf-section="yield">
                    <YieldCalculator
                        marketPrice={valuation.pricingScenarios.marketPrice}
                        quickSalePrice={valuation.pricingScenarios.quickSalePrice}
                        expenses={property.expenses}
                        listingType={property.listingType}
                        avgPricePerM2={valuation.avgPricePerM2}
                    />
                </div>

                {/* Comparables Map — replaces the old single-pin MapView */}
                {property.lat && property.lng && (
                    <ComparablesMap
                        lat={property.lat}
                        lng={property.lng}
                        address={property.address}
                        comparables={comparables}
                        marketPrice={valuation.pricingScenarios.marketPrice}
                    />
                )}

                {/* Comparables Section */}
                <div className="pdf-exclude">
                    <div className="print:break-after-page mb-12">
                        <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                            <ChartBarIcon className="w-5 h-5 mr-3" />
                            Dispersión de Mercado (Scatter Plot)
                        </h3>
                        <div className="bg-black/20 p-4 sm:p-8 rounded-2xl sm:rounded-[40px] border border-white/5 h-[300px] sm:h-[400px] print:break-inside-avoid relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
                            <ScatterPlot data={comparables} subjectM2={weightedM2} subjectPricePerM2={valuation.avgPricePerM2} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                            <CollectionIcon className="w-5 h-5 mr-3" />
                            Pool de Testigos Comparativos ({comparables.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                            {comparables.map((c) => (
                                <ComparableCard key={c.id} comparable={c} />
                            ))}
                        </div>

                        {/* Development Notice */}
                        <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white/5 rounded-2xl sm:rounded-[32px] border border-white/5">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                                    <InformationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                                </div>
                                <p className="text-xs sm:text-sm text-slate-400 font-light italic">
                                    <span className="font-black text-slate-300 uppercase tracking-widest mr-2">Core Engine Update:</span>
                                    El algoritmo de clustering comparativo se encuentra en fase de refinamiento beta.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ReportActions property={property} result={result} reportRef={reportRef} onReset={onReset} />
        </div>
    );
};

export default ValuationReport;
