import React from 'react';
import { Property } from '../../types';
import { BuildingIcon } from '../icons/BuildingIcon';
import { DocumentChartBarIcon } from '../icons/DocumentChartBarIcon';

interface ReportHeaderProps {
    property: Property;
    executiveSummary: string;
    uploadedImages: string[];
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ property, executiveSummary, uploadedImages }) => {
    return (
        <>
            {/* Header with Property Photo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-emerald-500"></div>
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-emerald-400">PropIQ Intelligence Report</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">Análisis Estratégico de Activo</h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
                        <div className="bg-white/5 border border-white/10 px-4 sm:px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl max-w-full overflow-hidden">
                            <BuildingIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 flex-shrink-0" />
                            <p className="text-sm sm:text-lg font-black text-white tracking-tight truncate">{property.address}</p>
                        </div>
                        <span className={`px-4 sm:px-6 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest border shadow-xl ${property.listingType === 'sale'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                            }`}>
                            {property.listingType === 'sale' ? 'Liquidez Inmediata' : 'Vector de Renta'}
                        </span>
                    </div>
                </div>
                {uploadedImages.length > 0 && (
                    <div className="md:col-span-1">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <img
                                src={`data:image/jpeg;base64,${uploadedImages[0]}`}
                                alt="Vista principal de la propiedad"
                                className="relative rounded-3xl object-cover h-48 sm:h-56 w-full shadow-2xl border border-white/20 transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white text-center">
                                Muestra de Campo N°1
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Executive Summary */}
            <div className="mb-12 p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-[32px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <h3 className="text-[10px] sm:text-xs font-black text-emerald-400 mb-4 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    <DocumentChartBarIcon className="w-5 h-5 mr-3" />
                    Executive Intelligence Summary
                </h3>
                <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed italic">"{executiveSummary}"</p>
            </div>
        </>
    );
};

export default ReportHeader;
