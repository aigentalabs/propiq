import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix default icon issue with Leaflet + bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    lat: number;
    lng: number;
    address?: string;
}

export const MapView: React.FC<MapViewProps> = ({ lat, lng, address }) => {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Initialize map
        const map = L.map(containerRef.current).setView([lat, lng], 15);
        mapRef.current = map;

        // Add Dark Matter tiles for premium look
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Add marker
        const marker = L.marker([lat, lng]).addTo(map);

        if (address) {
            marker.bindPopup(`<b>${address}</b>`).openPopup();
        }

        // Cleanup on unmount
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [lat, lng, address]);

    return (
        <div
            ref={containerRef}
            className="w-full h-[400px] rounded-3xl shadow-lg border border-white/10"
            style={{ zIndex: 1 }}
        />
    );
};
