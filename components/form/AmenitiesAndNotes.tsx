import React from 'react';
import { Property } from '../../types';

interface AmenitiesAndNotesProps {
    formData: Omit<Property, 'lat' | 'lng'>;
    isGettingLocation: boolean;
    hasLocation: boolean;
    onAmenityChange: (amenity: string) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const amenitiesOptions = [
    'Pileta', 'SUM', 'Gimnasio', 'Solárium', 'Parrillas', 'Spa', 'Laundry', 'Seguridad 24h', 'Juegos para niños', 'Coworking'
];

const AmenitiesAndNotes: React.FC<AmenitiesAndNotesProps> = ({ formData, isGettingLocation, hasLocation, onAmenityChange, onInputChange }) => {
    return (
        <>
            {/* Amenities */}
            <div>
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Servicios & Amenities</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {amenitiesOptions.map(amenity => (
                        <button
                            key={amenity}
                            type="button"
                            onClick={() => onAmenityChange(amenity)}
                            className={`px-3 sm:px-4 py-2 rounded-xl border transition-all duration-300 text-[11px] sm:text-xs font-bold ${formData.amenities.includes(amenity)
                                ? 'border-emerald-500 bg-emerald-500/20 text-white'
                                : 'border-white/5 bg-black/20 text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 sm:gap-10 border-t border-white/5 pt-8">
                {[
                    { name: 'hasServiceQuarters', label: 'Dep. de Servicio' },
                    { name: 'isProfessionalUseAllowed', label: 'Apto Profesional' }
                ].map((check) => (
                    <label key={check.name} className="flex items-center cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={(formData as any)[check.name]}
                                onChange={onInputChange}
                                name={check.name}
                                className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full border-2 transition-all duration-300 ${(formData as any)[check.name] ? 'bg-emerald-500 border-emerald-500' : 'bg-black/40 border-white/10'}`}></div>
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 ${(formData as any)[check.name] ? 'translate-x-4 bg-white' : 'bg-slate-600'}`}></div>
                        </div>
                        <span className={`ml-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${(formData as any)[check.name] ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                            {check.label}
                        </span>
                    </label>
                ))}
            </div>

            {/* Additional Notes */}
            <div>
                <label htmlFor="additionalNotes" className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Inteligencia de Entorno & Potencial
                </label>
                <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={onInputChange}
                    className="bg-black/20 border border-white/5 rounded-xl sm:rounded-2xl block w-full px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-light leading-relaxed"
                    placeholder="Factores no cuantificables (zonificación, proximidad a hitos, proyectos futuros...)"
                />
            </div>

            {/* Submit */}
            <div className="pt-6 sm:pt-8">
                <button
                    type="submit"
                    disabled={(!hasLocation && !formData.address) || isGettingLocation}
                    className="w-full group relative overflow-hidden py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-base sm:text-lg font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <span>{isGettingLocation ? 'Calculando...' : 'Validar & Siguiente'}</span>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
            </div>
        </>
    );
};

export default AmenitiesAndNotes;
