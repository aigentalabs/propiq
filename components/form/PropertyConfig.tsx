import React, { useState } from 'react';
import { Property } from '../../types';
import AreaEstimator from '../AreaEstimator';
import AreaEstimatorResult from '../AreaEstimatorResult';

interface PropertyConfigProps {
    formData: Omit<Property, 'lat' | 'lng'>;
    onListingTypeChange: (type: 'sale' | 'rent') => void;
    onPropertyTypeChange: (type: 'departamento' | 'casa' | 'ph') => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onAgeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSurfaceEstimated: (m2: number, label: string) => void;
}

const propertyTypeOptions: { id: 'departamento' | 'casa' | 'ph'; label: string }[] = [
    { id: 'departamento', label: 'Departamento' },
    { id: 'casa', label: 'Casa' },
    { id: 'ph', label: 'PH' },
];

const ageOptions = [
    { value: 0, label: 'A estrenar' },
    { value: 5, label: 'Hasta 10 años' },
    { value: 15, label: '10 a 20 años' },
    { value: 25, label: '20 a 30 años' },
    { value: 35, label: '30 a 40 años' },
    { value: 45, label: '40 a 50 años' },
    { value: 65, label: '50 a 80 años' },
    { value: 80, label: '80 años o más' },
];

const surfaceFields = [
    { name: 'coveredArea', label: 'Cubierta' },
    { name: 'semiCoveredArea', label: 'Semicubierta' },
    { name: 'uncoveredArea', label: 'Descubierta' },
];

const PropertyConfig: React.FC<PropertyConfigProps> = ({ formData, onListingTypeChange, onPropertyTypeChange, onInputChange, onAgeChange, onSurfaceEstimated }) => {
    const [showEstimator, setShowEstimator] = useState(false);
    const [estimationResult, setEstimationResult] = useState<any>(null);
    const [estimationPreview, setEstimationPreview] = useState('');
    const [estimationLabel, setEstimationLabel] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    const handleEstimationResult = (result: any, preview: string) => {
        setEstimationResult(result);
        setEstimationPreview(preview);
        setEstimationLabel(result.roomLabel || 'Ambiente');
        setShowEstimator(false);
    };

    const handleAcceptEstimation = (m2: number, label: string) => {
        onSurfaceEstimated(m2, label);
        setEstimationResult(null);
        setToast(`✓ ${m2} m² aplicados al campo Superficie Cubierta`);
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <div className="space-y-8">
            {/* Modals */}
            {showEstimator && (
                <AreaEstimator
                    onResult={handleEstimationResult}
                    onClose={() => setShowEstimator(false)}
                />
            )}
            {estimationResult && (
                <AreaEstimatorResult
                    result={estimationResult}
                    imagePreview={estimationPreview}
                    roomLabel={estimationLabel}
                    onAccept={handleAcceptEstimation}
                    onRetry={() => { setEstimationResult(null); setShowEstimator(true); }}
                />
            )}
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-black px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in">
                    {toast}
                </div>
            )}
            {/* Operation Type */}
            <div>
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Vector de Operación</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => onListingTypeChange('sale')}
                        className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-black uppercase tracking-tighter transition-all duration-300 shadow-xl text-sm sm:text-base ${formData.listingType === 'sale'
                            ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-emerald-500/10'
                            : 'border-white/5 bg-black/20 text-slate-500 hover:border-white/10 hover:text-slate-300'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Venta</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => onListingTypeChange('rent')}
                        className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-black uppercase tracking-tighter transition-all duration-300 shadow-xl text-sm sm:text-base ${formData.listingType === 'rent'
                            ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-emerald-500/10'
                            : 'border-white/5 bg-black/20 text-slate-500 hover:border-white/10 hover:text-slate-300'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span>Alquiler</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Property Type */}
            <div>
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Morfología del Activo</label>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    {propertyTypeOptions.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onPropertyTypeChange(option.id)}
                            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 text-xs font-bold transition-all duration-300 ${formData.propertyType.includes(option.id)
                                ? 'border-emerald-500 bg-emerald-500/20 text-white'
                                : 'border-white/5 bg-black/20 text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Surfaces */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Superficies (m²)</label>
                    <button
                        type="button"
                        onClick={() => setShowEstimator(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 active:scale-[0.98] transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        📐 Estimar con IA
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:gap-8">
                    {surfaceFields.map((area) => (
                        <div key={area.name}>
                            <label htmlFor={area.name} className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Sup. {area.label}</label>
                            <input
                                type="number"
                                name={area.name}
                                value={(formData as any)[area.name]}
                                onChange={onInputChange}
                                className="bg-black/20 border border-white/5 rounded-xl block w-full pl-3 sm:pl-4 pr-2 sm:pr-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all text-base sm:text-lg font-bold"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Age and Conservation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                    <label htmlFor="age" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Ciclo de Vida (Antigüedad)</label>
                    <select name="age" value={formData.age} onChange={onAgeChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none">
                        {ageOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-[#0f172a]">{option.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="conservation" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Preservación de Estructura</label>
                    <select
                        name="conservation"
                        value={formData.conservation}
                        onChange={onInputChange}
                        disabled={formData.age === 0}
                        className="bg-black/20 border border-white/5 rounded-xl block w-full px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <option value="new" className="bg-[#0f172a]">Nuevo / Reciclado</option>
                        <option value="excellent" className="bg-[#0f172a]">Excelente</option>
                        <option value="good" className="bg-[#0f172a]">Bueno</option>
                        <option value="needs_renovation" className="bg-[#0f172a]">A refaccionar</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PropertyConfig;
