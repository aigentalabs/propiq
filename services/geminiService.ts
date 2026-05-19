import { Property, ValuationResult, ImageFile } from '../types';

// Secure API: All Gemini processing happens server-side
export const getValuation = async (property: Property, images: ImageFile[]): Promise<ValuationResult> => {
    try {
        // Map images to a format the server expects
        const imagePayload = images.map(img => ({
            mimeType: img.file.type,
            base64: img.base64
        }));

        const response = await fetch('/api/valuation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                property,
                images: imagePayload
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || 'Error en el servidor de tasación');
        }

        const result: ValuationResult = await response.json();
        return result;

    } catch (error: any) {
        console.error("Error fetching valuation from API:", error);
        throw new Error(error.message || 'Error al conectar con el servicio de tasación');
    }
};