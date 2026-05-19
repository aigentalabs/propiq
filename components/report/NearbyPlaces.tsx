import React from 'react';
import { NearbyPlaces as NearbyPlacesType, NearbyPlace } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { BuildingIcon } from '../icons/BuildingIcon';
import { InformationCircleIcon } from '../icons/InformationCircleIcon';
import { MapPinIcon } from '../icons/MapPinIcon';

interface NearbyPlacesProps {
    nearbyPlaces: NearbyPlacesType;
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ nearbyPlaces }) => {
    if (!nearbyPlaces) return null;

    return (
        <div className="mb-12 print:break-inside-avoid">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-500 mb-6 flex items-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                <MapPinIcon className="w-5 h-5 mr-3" />
                Ecosistema de Entorno & Micro-Localización
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Parks */}
                {nearbyPlaces.parks && nearbyPlaces.parks.length > 0 && (
                    <div className="bg-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <SparklesIcon className="w-4 h-4 text-emerald-500" />
                            </div>
                            <h4 className="font-black text-white text-[10px] uppercase tracking-widest">Espacios Verdes</h4>
                        </div>
                        <ul className="space-y-3 text-xs">
                            {nearbyPlaces.parks.map((park: NearbyPlace, i: number) => (
                                <li key={i} className="flex justify-between items-center group">
                                    <span className="text-slate-400 group-hover:text-white transition-colors">{park.name}</span>
                                    <span className="font-black bg-emerald-500/10 px-3 py-1 rounded-full text-[9px] text-emerald-400 border border-emerald-500/20 ml-2 flex-shrink-0">{park.distance}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Schools */}
                {nearbyPlaces.schools && (nearbyPlaces.schools.primary?.length > 0 || nearbyPlaces.schools.secondary?.length > 0) && (
                    <div className="bg-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <BuildingIcon className="w-4 h-4 text-indigo-500" />
                            </div>
                            <h4 className="font-black text-white text-[10px] uppercase tracking-widest">Nodos Educativos</h4>
                        </div>
                        {nearbyPlaces.schools.primary && nearbyPlaces.schools.primary.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[9px] font-black text-indigo-400 mb-2 uppercase tracking-widest opacity-60">Primaria/Inicial</p>
                                <ul className="space-y-2 text-[11px]">
                                    {nearbyPlaces.schools.primary.map((school: NearbyPlace, i: number) => (
                                        <li key={i} className="flex justify-between items-center group">
                                            <span className="text-slate-400 group-hover:text-white transition-colors">{school.name}</span>
                                            <span className="font-black bg-indigo-500/10 px-2 py-0.5 rounded-full text-[9px] text-indigo-400 ml-2 flex-shrink-0">{school.distance}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {nearbyPlaces.schools.secondary && nearbyPlaces.schools.secondary.length > 0 && (
                            <div>
                                <p className="text-[9px] font-black text-indigo-400 mb-2 uppercase tracking-widest opacity-60">Media/Técnica</p>
                                <ul className="space-y-2 text-[11px]">
                                    {nearbyPlaces.schools.secondary.map((school: NearbyPlace, i: number) => (
                                        <li key={i} className="flex justify-between items-center group">
                                            <span className="text-slate-400 group-hover:text-white transition-colors">{school.name}</span>
                                            <span className="font-black bg-indigo-500/10 px-2 py-0.5 rounded-full text-[9px] text-indigo-400 ml-2 flex-shrink-0">{school.distance}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Hospitals */}
                {nearbyPlaces.hospitals && nearbyPlaces.hospitals.length > 0 && (
                    <div className="bg-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-red-500/20 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <InformationCircleIcon className="w-4 h-4 text-red-500" />
                            </div>
                            <h4 className="font-black text-white text-[10px] uppercase tracking-widest">Infraestructura Médica</h4>
                        </div>
                        <ul className="space-y-3 text-xs">
                            {nearbyPlaces.hospitals.map((hospital: NearbyPlace, i: number) => (
                                <li key={i} className="flex justify-between items-start group">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-300 group-hover:text-white transition-colors truncate">{hospital.name}</p>
                                        <p className="text-[9px] text-red-400/60 uppercase font-bold">{hospital.type}</p>
                                    </div>
                                    <span className="font-black bg-red-500/10 px-3 py-1 rounded-full text-[9px] text-red-400 ml-2 flex-shrink-0">{hospital.distance}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NearbyPlaces;
