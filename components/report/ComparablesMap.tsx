import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Comparable } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ChartBarIcon } from '../icons/ChartBarIcon';

// Fix default icon issue with Leaflet + bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface ComparablesMapProps {
    lat: number;
    lng: number;
    address: string;
    comparables: Comparable[];
    marketPrice: number;
}

const ComparablesMap: React.FC<ComparablesMapProps> = ({ lat, lng, address, comparables, marketPrice }) => {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([lat, lng], 14);
        mapRef.current = map;

        // Dark tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Subject property marker (gold star)
        const subjectIcon = L.divIcon({
            html: `<div style="
                width: 40px; height: 40px; 
                background: linear-gradient(135deg, #f59e0b, #d97706); 
                border: 3px solid #fff; 
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 0 20px rgba(245,158,11,0.6), 0 4px 12px rgba(0,0,0,0.4);
                font-size: 18px;
            ">★</div>`,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        L.marker([lat, lng], { icon: subjectIcon })
            .addTo(map)
            .bindPopup(`
                <div style="font-family: system-ui; min-width: 200px;">
                    <div style="font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 6px;">
                        ★ Tu Propiedad
                    </div>
                    <div style="font-weight: 700; font-size: 13px; color: #1e293b; margin-bottom: 4px;">
                        ${address}
                    </div>
                    <div style="font-weight: 900; font-size: 16px; color: #059669;">
                        ${formatCurrency(marketPrice)}
                    </div>
                    <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Valor óptimo de mercado</div>
                </div>
            `);

        // Comparable markers
        const bounds = L.latLngBounds([[lat, lng]]);

        comparables.forEach((comp, index) => {
            if (!comp.lat || !comp.lng) return;

            bounds.extend([comp.lat, comp.lng]);

            const isPrimary = comp.zone === 'primary';
            const bgColor = isPrimary ? '#10b981' : '#6366f1';
            const shadowColor = isPrimary ? 'rgba(16,185,129,0.5)' : 'rgba(99,102,241,0.5)';

            const compIcon = L.divIcon({
                html: `<div style="
                    width: 28px; height: 28px; 
                    background: ${bgColor}; 
                    border: 2px solid rgba(255,255,255,0.8); 
                    border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 12px ${shadowColor}, 0 2px 8px rgba(0,0,0,0.3);
                    font-size: 11px; font-weight: 900; color: white;
                ">${index + 1}</div>`,
                className: '',
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });

            const statusColors: Record<string, string> = {
                'For Sale': '#6366f1',
                'Sold': '#10b981',
                'Reserved': '#f59e0b',
            };

            L.marker([comp.lat, comp.lng], { icon: compIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="font-family: system-ui; min-width: 180px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${bgColor};">
                                Comparable #${index + 1}
                            </span>
                            <span style="font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: ${statusColors[comp.status] || '#64748b'}20; color: ${statusColors[comp.status] || '#64748b'};">
                                ${comp.status}
                            </span>
                        </div>
                        <div style="font-weight: 600; font-size: 12px; color: #1e293b; margin-bottom: 4px;">
                            ${comp.address}
                        </div>
                        <div style="font-weight: 900; font-size: 15px; color: #0f172a;">
                            ${formatCurrency(comp.priceUSD)}
                        </div>
                        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
                            ${formatCurrency(comp.pricePerM2)}/m² · ${comp.weightedM2.toFixed(0)}m² · ${comp.sourcePortal}
                        </div>
                    </div>
                `);
        });

        // Fit map to show all markers
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        }

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [lat, lng, address, comparables, marketPrice]);

    return (
        <section className="mb-12">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                <ChartBarIcon className="w-5 h-5 mr-3" />
                Cartografía Comparativa de Mercado
            </h3>
            <div className="bg-black/40 shadow-2xl rounded-2xl sm:rounded-[40px] overflow-hidden border border-white/10 relative">
                <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none z-10"></div>
                <div
                    ref={containerRef}
                    className="w-full h-[350px] sm:h-[450px]"
                    style={{ zIndex: 1 }}
                />
                {/* Legend */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 text-[9px] sm:text-[10px] space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[8px]">★</div>
                        <span className="text-amber-400 font-black uppercase tracking-widest">Tu Propiedad</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white/60"></div>
                        <span className="text-slate-400 font-bold">Zona Primaria</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 border border-white/60"></div>
                        <span className="text-slate-400 font-bold">Zona Secundaria</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComparablesMap;
