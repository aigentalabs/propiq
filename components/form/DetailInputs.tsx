import React from 'react';
import { Property } from '../../types';
import { CurrencyDollarIcon } from '../icons/CurrencyDollarIcon';
import { BuildingIcon } from '../icons/BuildingIcon';

interface DetailInputsProps {
    formData: Omit<Property, 'lat' | 'lng'>;
    isApartment: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const valueVectorFields = [
    { name: 'expenses', label: 'Expensas (ARS)', type: 'number', placeholder: '50000' },
    { name: 'brightness', label: 'Luminosidad', type: 'select', options: [{ v: 'very_bright', l: 'Muy Luminoso' }, { v: 'bright', l: 'Luminoso' }, { v: 'dim', l: 'Poco Luminoso' }] },
    { name: 'heatingType', label: 'Calefacción', type: 'select', options: [{ v: 'central_heating', l: 'Losa Radiante' }, { v: 'radiators', l: 'Radiadores' }, { v: 'heaters', l: 'Estufas' }, { v: 'ac_split', l: 'Split F/C' }, { v: 'none', l: 'No tiene' }] },
    { name: 'hotWaterSystem', label: 'Agua Caliente', type: 'select', options: [{ v: 'central', l: 'Central' }, { v: 'water_heater', l: 'Termotanque' }, { v: 'tankless_heater', l: 'Calefón' }] }
];

const roomFields = [
    { name: 'bedrooms', label: 'Dormitorios' },
    { name: 'bathrooms', label: 'Baños' },
    { name: 'toilets', label: 'Toilettes' },
    { name: 'garages', label: 'Cocheras' }
];

const DetailInputs: React.FC<DetailInputsProps> = ({ formData, isApartment, onInputChange }) => {
    return (
        <>
            {/* Value Vectors */}
            <div className="border-t border-white/5 pt-8">
                <h3 className="text-lg sm:text-xl font-black text-white mb-6 flex items-center tracking-tight">
                    <CurrencyDollarIcon className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-emerald-400" />
                    Vectores de Valor
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                    {valueVectorFields.map((field) => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{field.label}</label>
                            {field.type === 'number' ? (
                                <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-3 sm:px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold" placeholder={field.placeholder} />
                            ) : (
                                <select name={field.name} value={(formData as any)[field.name]} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-3 sm:px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none text-sm">
                                    {field.options?.map(opt => <option key={opt.v} value={opt.v} className="bg-[#0f172a]">{opt.l}</option>)}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Layout: Floor, Disposition, Orientation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
                {isApartment && (
                    <div>
                        <label htmlFor="floor" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Piso</label>
                        <input type="text" name="floor" value={formData.floor} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold" placeholder="5, PB..." />
                    </div>
                )}
                <div>
                    <label htmlFor="layout" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Disposición</label>
                    <select name="layout" value={formData.layout} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none">
                        <option value="front" className="bg-[#0f172a]">Frente</option>
                        <option value="back" className="bg-[#0f172a]">Contrafrente</option>
                        <option value="internal" className="bg-[#0f172a]">Interno</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="orientation" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Orientación Solar</label>
                    <select name="orientation" value={formData.orientation} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none">
                        <option value="north" className="bg-[#0f172a]">Norte (Ideal)</option>
                        <option value="south" className="bg-[#0f172a]">Sur</option>
                        <option value="east" className="bg-[#0f172a]">Este</option>
                        <option value="west" className="bg-[#0f172a]">Oeste</option>
                        <option value="northeast" className="bg-[#0f172a]">Noreste</option>
                        <option value="northwest" className="bg-[#0f172a]">Noroeste</option>
                        <option value="southeast" className="bg-[#0f172a]">Sudeste</option>
                        <option value="southwest" className="bg-[#0f172a]">Sudoeste</option>
                    </select>
                </div>
            </div>

            {/* Room Counts */}
            <div className="grid grid-cols-4 gap-3 sm:gap-8">
                {roomFields.map((room) => (
                    <div key={room.name}>
                        <label htmlFor={room.name} className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{room.label}</label>
                        <input type="number" name={room.name} value={(formData as any)[room.name]} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-2 sm:px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all text-lg sm:text-xl font-black text-center" />
                    </div>
                ))}
            </div>

            {/* Building Details (Conditional) */}
            {isApartment && (
                <div className="border-t border-white/5 pt-8">
                    <h3 className="text-lg sm:text-xl font-black text-white mb-6 flex items-center tracking-tight">
                        <BuildingIcon className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-emerald-400" />
                        Infraestructura del Edificio
                    </h3>
                    <div className="grid grid-cols-3 gap-3 sm:gap-8">
                        <div>
                            <label htmlFor="buildingFloors" className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Niveles</label>
                            <input type="number" name="buildingFloors" value={formData.buildingFloors} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-3 sm:px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold" />
                        </div>
                        <div>
                            <label htmlFor="apartmentsPerFloor" className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Unid. x Planta</label>
                            <input type="number" name="apartmentsPerFloor" value={formData.apartmentsPerFloor} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-3 sm:px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold" />
                        </div>
                        <div>
                            <label htmlFor="elevators" className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Ascensores</label>
                            <input type="number" name="elevators" value={formData.elevators} onChange={onInputChange} className="bg-black/20 border border-white/5 rounded-xl block w-full px-3 sm:px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailInputs;
