import React from 'react';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';

interface GeoZoningProps {
    saleExpectancy: string;
    influenceZones: {
        primary: string;
        secondary: string;
    };
}

const GeoZoning: React.FC<GeoZoningProps> = ({ saleExpectancy, influenceZones }) => {
    return (
        <div className="print:break-after-page">
            <div className="print:break-after-page mb-12">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    <DocumentTextIcon className="w-5 h-5 mr-3" />
                    Geo-Zonificación & Expectativas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-xs print:break-inside-avoid">
                    <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5 group hover:bg-white/10 transition-colors">
                        <h4 className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Velocity Outlook</h4>
                        <p className="text-slate-300 font-light leading-relaxed italic">{saleExpectancy}</p>
                    </div>
                    <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5 group hover:bg-white/10 transition-colors">
                        <h4 className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Influencia Primaria</h4>
                        <p className="text-slate-300 font-light leading-relaxed italic">{influenceZones.primary}</p>
                    </div>
                    <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5 md:col-span-2 group hover:bg-white/10 transition-colors">
                        <h4 className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Influencia Secundaria & Radio de Acción</h4>
                        <p className="text-slate-300 font-light leading-relaxed italic">{influenceZones.secondary}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeoZoning;
