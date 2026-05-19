import React from 'react';
import { MapPinIcon } from '../icons/MapPinIcon';

interface LocationInputProps {
    address: string;
    location: { lat: number; lng: number } | null;
    locationError: string | null;
    isGettingLocation: boolean;
    onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGetLocation: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ address, location, locationError, isGettingLocation, onAddressChange, onGetLocation }) => {
    return (
        <div>
            <label htmlFor="address" className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Geolocalización del Inmueble
                {isGettingLocation && (
                    <span className="ml-3 text-[10px] text-emerald-400 animate-pulse">Sincronizando satélites...</span>
                )}
            </label>
            <div className="mt-1 flex flex-col sm:flex-row rounded-xl overflow-hidden shadow-inner bg-black/20 border border-white/5 focus-within:border-emerald-500/50 transition-all duration-300">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-emerald-500/70" />
                    </div>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        onChange={onAddressChange}
                        className="bg-transparent block w-full pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none sm:text-sm transition-all"
                        placeholder="Calle, Altura, Ciudad..."
                    />
                </div>
                <button
                    type="button"
                    onClick={onGetLocation}
                    disabled={isGettingLocation}
                    className="relative inline-flex items-center justify-center space-x-2 px-6 py-3 sm:py-2 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-tighter hover:bg-emerald-500/20 focus:outline-none disabled:bg-slate-800 disabled:text-slate-600 transition-all border-t sm:border-t-0 sm:border-l border-white/5"
                >
                    <svg className={`w-4 h-4 ${isGettingLocation ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{isGettingLocation ? 'GPS Link...' : 'Auto-Loc'}</span>
                </button>
            </div>

            {location && (
                <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-xs text-emerald-400 flex items-center font-medium">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Coordenadas fijadas: {location.lat.toFixed(5)}°, {location.lng.toFixed(5)}°
                    </p>
                </div>
            )}

            {locationError && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-red-400 flex items-start font-medium">
                        <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {locationError}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationInput;
