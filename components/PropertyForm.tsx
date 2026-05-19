import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import LocationInput from './form/LocationInput';
import PropertyConfig from './form/PropertyConfig';
import DetailInputs from './form/DetailInputs';
import AmenitiesAndNotes from './form/AmenitiesAndNotes';

interface PropertyFormProps {
    onSubmit: (data: Property) => void;
}

// Reverse geocoding using Nominatim (OpenStreetMap)
const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            { headers: { 'User-Agent': 'PropIQ-PropertyValuation/2.1' } }
        );
        if (!response.ok) return null;
        const data = await response.json();
        const addr = data.address;
        const road = addr.road || addr.street || '';
        const houseNumber = addr.house_number || '';
        const city = addr.city || addr.town || addr.village || addr.suburb || '';
        const state = addr.state || '';
        const country = addr.country || '';

        let formatted = '';
        if (road) formatted = houseNumber ? `${road} ${houseNumber}` : road;
        if (city) formatted += formatted ? `, ${city}` : city;
        if (state && state !== city) formatted += formatted ? `, ${state}` : state;
        if (country) formatted += formatted ? `, ${country}` : country;
        return formatted || data.display_name;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
};

const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<Omit<Property, 'lat' | 'lng'>>({
        address: '', listingType: 'sale', propertyType: ['departamento'],
        coveredArea: 100, semiCoveredArea: 20, uncoveredArea: 30,
        age: 15, conservation: 'good', bedrooms: 3, bathrooms: 2,
        toilets: 1, garages: 1, hasServiceQuarters: false,
        amenities: ['Pileta'], floor: '5', layout: 'front', orientation: 'north',
        additionalNotes: '', expenses: 50000, brightness: 'bright',
        heatingType: 'radiators', hotWaterSystem: 'water_heater',
        buildingFloors: 10, apartmentsPerFloor: 4, elevators: 2,
        isProfessionalUseAllowed: false,
    });
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
        }
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAge = parseInt(e.target.value, 10);
        setFormData(prev => {
            const updated = { ...prev, age: newAge };
            if (newAge === 0) updated.conservation = 'new';
            return updated;
        });
    };

    const handleAmenityChange = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handlePropertyTypeChange = (type: 'departamento' | 'casa' | 'ph') => {
        setFormData(prev => {
            const newTypes = prev.propertyType.includes(type)
                ? prev.propertyType.filter(t => t !== type)
                : [...prev.propertyType, type];
            return newTypes.length === 0 ? prev : { ...prev, propertyType: newTypes };
        });
    };

    const getLocation = async () => {
        setIsGettingLocation(true);
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                setLocation(coords);
                const address = await reverseGeocode(coords.lat, coords.lng);
                if (address) setFormData(prev => ({ ...prev, address }));
                setIsGettingLocation(false);
            },
            (error) => {
                const messages: Record<number, string> = {
                    1: 'Permiso denegado. Ingresa la dirección manualmente.',
                    2: 'Ubicación no disponible. Ingresa la dirección manualmente.',
                    3: 'Tiempo agotado. Ingresa la dirección manualmente.',
                };
                setLocationError(`Error al obtener la ubicación. ${messages[error.code] || 'Ingresa la dirección manualmente.'}`);
                setIsGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    useEffect(() => { getLocation(); }, []);

    const handleSurfaceEstimated = (m2: number, _label: string) => {
        // Add estimated m² to coveredArea (most common use case)
        setFormData(prev => ({ ...prev, coveredArea: parseFloat(m2.toFixed(1)) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!location && !formData.address) {
            setLocationError("Por favor, proporciona una dirección o permite el acceso a la ubicación.");
            return;
        }
        onSubmit({ ...formData, ...(location && { lat: location.lat, lng: location.lng }) });
    };

    const isApartment = formData.propertyType.includes('departamento');

    return (
        <div className="bg-white/5 backdrop-blur-2xl p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 flex items-center tracking-tight">
                <HomeIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-emerald-400" />
                Configuración de Activo
            </h2>
            <p className="text-slate-400 mb-6 sm:mb-8 font-light italic text-sm sm:text-base">Define los parámetros técnicos para el análisis algorítmico.</p>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <LocationInput
                    address={formData.address}
                    location={location}
                    locationError={locationError}
                    isGettingLocation={isGettingLocation}
                    onAddressChange={handleInputChange}
                    onGetLocation={getLocation}
                />

                <PropertyConfig
                    formData={formData}
                    onListingTypeChange={(type) => setFormData(prev => ({ ...prev, listingType: type }))}
                    onPropertyTypeChange={handlePropertyTypeChange}
                    onInputChange={handleInputChange}
                    onAgeChange={handleAgeChange}
                    onSurfaceEstimated={handleSurfaceEstimated}
                />

                <DetailInputs
                    formData={formData}
                    isApartment={isApartment}
                    onInputChange={handleInputChange}
                />

                <AmenitiesAndNotes
                    formData={formData}
                    isGettingLocation={isGettingLocation}
                    hasLocation={!!location}
                    onAmenityChange={handleAmenityChange}
                    onInputChange={handleInputChange}
                />
            </form>
        </div>
    );
};

export default PropertyForm;