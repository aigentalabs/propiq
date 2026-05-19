import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Increase payload size limits for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Load environment variables from .env.local if running locally and variables are not already set
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const k = key.trim();
            if (!process.env[k]) {
                process.env[k] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            }
        }
    });
}

// Helpers
const getAgeText = (age) => {
    if (age === 0) return 'A estrenar';
    if (age <= 10) return 'Hasta 10 años';
    if (age <= 20) return '10 a 20 años';
    if (age <= 30) return '20 a 30 años';
    if (age <= 40) return '30 a 40 años';
    if (age <= 50) return '40 a 50 años';
    if (age <= 80) return '50 a 80 años';
    return '80 años o más';
};

const getAgeSearchInstructions = (age, conservation) => {
    if (conservation === 'new' || age === 0) {
        return "Para los comparables, busca propiedades de hasta 5 años de antigüedad. Presta especial atención a diferenciar las propiedades 'a estrenar' de las que tienen pocos años de uso. Si es posible, identifica y separa propiedades en construcción, indicando su etapa si la información está disponible. Analiza el diferencial de precio entre estas sub-categorías.";
    }
    if (age >= 50) return "Para los comparables, busca propiedades con una antigüedad de 50 a 80 años o más.";
    if (age >= 40) return "Para los comparables, busca propiedades con una antigüedad de 30 a 60 años.";
    if (age >= 30) return "Para los comparables, busca propiedades con una antigüedad de 20 a 50 años.";
    if (age >= 20) return "Para los comparables, busca propiedades con una antigüedad de 10 a 40 años.";
    if (age >= 10) return "Para los comparables, busca propiedades con una antigüedad de 5 a 25 años.";
    return "Para los comparables, busca propiedades de menos de 10 años. Es importante que separes las propiedades 'a estrenar' (sin uso) de las que tienen pocos años de uso para analizar el diferencial de precio.";
};

const translations = {
    conservation: { new: 'Nuevo / Reciclado', excellent: 'Excelente', good: 'Bueno', needs_renovation: 'A refaccionar' },
    layout: { front: 'Frente', back: 'Contrafrente', internal: 'Interno' },
    orientation: { north: 'Norte', south: 'Sur', east: 'Este', west: 'Oeste', northeast: 'Noreste', northwest: 'Noroeste', southeast: 'Sudeste', southwest: 'Sudoeste' },
    brightness: { very_bright: 'Muy luminoso', bright: 'Luminoso', dim: 'Poco luminoso' },
    heatingType: { central_heating: 'Losa Radiante / Central', radiators: 'Radiadores', heaters: 'Estufas', ac_split: 'Aire Acond. F/C', none: 'No tiene' },
    hotWaterSystem: { central: 'Central', water_heater: 'Termotanque', tankless_heater: 'Calefón' }
};

// API: Estimate Area from Image
app.post('/api/estimateArea', async (req, res) => {
    try {
        const { image, roomLabel } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY no configurado' });
        }

        const AREA_PROMPT = `Eres un arquitecto experto en medición de espacios.
Analiza la imagen de este ambiente y estimá sus dimensiones usando referencias visuales presentes en la foto.

MÉTODO: Identificá objetos de referencia con medidas estándar (puertas ~0.80m, baldosas 60x60/45x45/30x30, cama matrimonial 1.40x1.90m, heladera 0.60x0.60m, inodoro 0.35m de ancho, mesada cocina 0.60m de profundidad, ventanas 1.00-1.50m). Contá cuántas veces caben en el ancho y largo del ambiente.

Confianza: 'alta' si hay 3+ referencias claras, 'media' si hay 1-2, 'baja' si no hay referencias claras.
Disclaimer fijo: "Esta estimación es referencial. Para valores exactos se recomienda medición profesional con distanciómetro láser."

Devolvé ÚNICAMENTE un JSON válido:
{"estimatedWidth": <metros>, "estimatedLength": <metros>, "estimatedM2": <ancho×largo>, "confidence": "alta"|"media"|"baja", "references": ["ref1", "ref2"], "notes": "explicación del razonamiento", "disclaimer": "Esta estimación es referencial..."}`;

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                role: 'user',
                parts: [
                    { text: roomLabel ? `Ambiente: ${roomLabel}\n\n${AREA_PROMPT}` : AREA_PROMPT },
                    { inlineData: { mimeType: image.mimeType, data: image.base64 } }
                ]
            }],
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1,
                maxOutputTokens: 512
            }
        });

        let text = response.text?.trim() || '{}';
        const start = text.indexOf('{'), end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }

        const result = JSON.parse(text);
        result.estimatedM2 = parseFloat((result.estimatedWidth * result.estimatedLength).toFixed(2));

        res.json(result);
    } catch (err) {
        console.error('Area estimation error:', err);
        res.status(500).json({ error: err.message });
    }
});

// API: Valuation Engine
app.post('/api/valuation', async (req, res) => {
    try {
        const { property, images } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY no configurado' });
        }

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                executiveSummary: { type: Type.STRING },
                valuation: {
                    type: Type.OBJECT,
                    properties: {
                        pricingScenarios: {
                            type: Type.OBJECT,
                            properties: {
                                quickSalePrice: { type: Type.NUMBER },
                                marketPrice: { type: Type.NUMBER },
                            },
                            required: ["quickSalePrice", "marketPrice"],
                        },
                        avgPricePerM2: { type: Type.NUMBER },
                    },
                    required: ["pricingScenarios", "avgPricePerM2"],
                },
                valuationFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                saleExpectancy: { type: Type.STRING },
                influenceZones: {
                    type: Type.OBJECT,
                    properties: {
                        primary: { type: Type.STRING },
                        secondary: { type: Type.STRING },
                    },
                    required: ["primary", "secondary"],
                },
                comparables: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            address: { type: Type.STRING },
                            priceUSD: { type: Type.NUMBER },
                            weightedM2: { type: Type.NUMBER },
                            pricePerM2: { type: Type.NUMBER },
                            daysOnMarket: { type: Type.NUMBER },
                            status: { type: Type.STRING },
                            zone: { type: Type.STRING },
                            sourcePortal: { type: Type.STRING },
                            url: { type: Type.STRING },
                            imageUrl: { type: Type.STRING },
                            comparisonReason: { type: Type.STRING },
                            visualComparisonResult: { type: Type.STRING },
                            lat: { type: Type.NUMBER },
                            lng: { type: Type.NUMBER },
                        },
                        required: ["id", "address", "priceUSD", "weightedM2", "pricePerM2", "daysOnMarket", "status", "zone", "sourcePortal", "url", "imageUrl", "comparisonReason", "visualComparisonResult", "lat", "lng"],
                    },
                },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                marketInsights: {
                    type: Type.OBJECT,
                    properties: {
                        demandIndex: {
                            type: Type.OBJECT,
                            properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
                            required: ["title", "description"]
                        },
                        recentSales: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { address: { type: Type.STRING }, saleDate: { type: Type.STRING }, priceUSD: { type: Type.NUMBER }, pricePerM2: { type: Type.NUMBER } },
                                required: ["address", "saleDate", "priceUSD", "pricePerM2"]
                            }
                        }
                    },
                    required: ["demandIndex", "recentSales"]
                },
                deedAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        disclaimer: { type: Type.STRING },
                        sourceUrl: { type: Type.STRING },
                        localDeeds: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { address: { type: Type.STRING }, saleDate: { type: Type.STRING }, priceUSD: { type: Type.NUMBER }, pricePerM2: { type: Type.NUMBER } },
                                required: ["address", "saleDate", "priceUSD", "pricePerM2"]
                            }
                        }
                    },
                    required: ["summary", "disclaimer", "sourceUrl", "localDeeds"]
                },
                nearbyPlaces: {
                    type: Type.OBJECT,
                    properties: {
                        parks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, distance: { type: Type.STRING } } } },
                        schools: { type: Type.OBJECT, properties: { primary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, distance: { type: Type.STRING } } } }, secondary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, distance: { type: Type.STRING } } } } } },
                        hospitals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, distance: { type: Type.STRING } } } },
                        supermarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, distance: { type: Type.STRING } } } },
                        shopping: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, distance: { type: Type.STRING } } } }
                    },
                    required: ["parks", "schools", "hospitals", "supermarkets", "shopping"]
                },
                futurePotentialAnalysis: { type: Type.STRING },
            },
            required: ["executiveSummary", "valuation", "valuationFactors", "saleExpectancy", "influenceZones", "comparables", "strengths", "weaknesses", "marketInsights", "deedAnalysis", "nearbyPlaces", "futurePotentialAnalysis"],
        };

        const weightedM2 = property.coveredArea + (property.semiCoveredArea * 0.5) + (property.uncoveredArea * 0.3);
        const imageParts = (images || []).map(image => ({
            inlineData: { mimeType: image.mimeType, data: image.base64 },
        }));

        const isApartment = property.propertyType.includes('departamento');
        const ageInstructions = getAgeSearchInstructions(property.age, property.conservation);
        const locationInfo = property.lat && property.lng
            ? `- **COORDENADAS GPS EXACTAS: ${property.lat}, ${property.lng}**`
            : `- Ubicación: El análisis debe basarse en la dirección proporcionada ya que no se concedió acceso a la geolocalización.`;

        const textPrompt = `
      Eres un economista y experto tasador de propiedades en Argentina, con profundo conocimiento del mercado de Buenos Aires. Tu análisis es preciso, basado en datos, y considera el contexto micro y macroeconómico.
      
      Propiedad a tasar:
      ${locationInfo}
      - Dirección: ${property.address || 'No especificada'}
      - Tipo de Operación: ${property.listingType === 'sale' ? 'VENTA' : 'ALQUILER'}
      - Tipo de Propiedad: ${property.propertyType.join(', ')}
      - Superficie cubierta: ${property.coveredArea} m²
      - Superficie semicubierta: ${property.semiCoveredArea} m²
      - Superficie descubierta: ${property.uncoveredArea} m²
      - Superficie ponderada total: ${weightedM2.toFixed(2)} m²
      - Antigüedad: ${getAgeText(property.age)}
      - Estado de conservación: ${translations.conservation[property.conservation]}
      ${property.floor ? `- Piso: ${property.floor}` : ''}
      ${property.layout ? `- Disposición: ${translations.layout[property.layout]}` : ''}
      ${property.orientation ? `- Orientación: ${translations.orientation[property.orientation]}` : ''}
      - Dormitorios: ${property.bedrooms}
      - Baños: ${property.bathrooms}
      - Toilettes: ${property.toilets}
      - Cocheras: ${property.garages}
      - Dependencia de servicio: ${property.hasServiceQuarters ? 'Sí' : 'No'}
      - Amenities: ${property.amenities.join(', ')}
      ${property.expenses ? `- Expensas mensuales: ARS ${property.expenses.toLocaleString('es-AR')}` : ''}
      ${property.brightness ? `- Luminosidad: ${translations.brightness[property.brightness]}` : ''}
      ${property.heatingType ? `- Calefacción: ${translations.heatingType[property.heatingType]}` : ''}
      ${property.hotWaterSystem ? `- Agua Caliente: ${translations.hotWaterSystem[property.hotWaterSystem]}` : ''}
      ${isApartment && property.buildingFloors ? `- Pisos en el edificio: ${property.buildingFloors}` : ''}
      ${isApartment && property.apartmentsPerFloor ? `- Departamentos por piso: ${property.apartmentsPerFloor}` : ''}
      ${isApartment && property.elevators ? `- Cantidad de ascensores: ${property.elevators}` : ''}
      - Apto profesional: ${property.isProfessionalUseAllowed ? 'Sí' : 'No'}
      ${property.additionalNotes ? `- Notas Adicionales: ${property.additionalNotes}` : ''}

      Tu tarea es realizar una tasación estratégica completa. Sigue estos pasos y aplica las siguientes reglas de ponderación:

      **Reglas de Ponderación y Normalización Detalladas:**
      1.  **Disposición:** Pondera positivamente una disposición 'Frente' sobre 'Contrafrente'. Refleja esta diferencia en el valor final y en el análisis de fortalezas/debilidades.
      2.  **Orientación:** Pondera positivamente las orientaciones Norte, Noroeste y Oeste. Pondera negativamente la orientación Sur. Considera la orientación Este como neutra.
      3.  **Baños:** Para propiedades con más de 2 dormitorios, una configuración con más de 1 baño completo es superior a '1 baño + 1 toilette', que a su vez es superior a '1 solo baño'. Esto debe influir en la tasación.
      4.  **Manejo de Cocheras (MUY IMPORTANTE):**
          *   **Si la propiedad a tasar NO tiene cochera:** Al encontrar un comparable que SÍ la tiene, debes estimar el valor de una cochera en la zona y RESTARLO del precio del comparable antes de calcular el precio por m². Si la propiedad tiene >3 dormitorios en una zona premium y no tiene cochera, márcalo como una debilidad significativa.
          *   **Si la propiedad a tasar SÍ tiene cochera:** Prioriza buscar comparables que también la tengan. Si la muestra es muy pequeña (ej. un monoambiente con cochera), incluye propiedades sin cochera, pero NORMALIZA su valor AÑADIENDO el precio estimado de una cochera antes de comparar.
      5.  **Filtro por Superficie Descubierta:** Si la propiedad a tasar (especialmente departamentos) no tiene una terraza o patio grande, EXCLUYE de los comparables a propiedades que sí los tengan para evitar distorsiones. Si la propiedad a tasar SÍ tiene terraza/patio, busca comparables que también los tengan.

      **Proceso de Análisis por Pasos:**
      1.  **Análisis de Potencial Futuro:** Investiga la zona sobre cambios en el código de planeamiento urbano, desarrollos inmobiliarios y proyectos de infraestructura. Usa las 'Notas Adicionales' si se proporcionaron. Redacta un párrafo para 'futurePotentialAnalysis'.
      2.  **Define Zonas de Influencia:** Describe una 'Zona de Influencia Primaria' y una 'Secundaria'.
      3.  **Genera Comparables:** Crea una lista de entre 8 y 10 propiedades comparables realistas (mínimo estricto de 8, máximo estricto de 10). Para cada una, genera todos los campos requeridos, incluyendo 'lat', 'lng', y una **URL de imagen real y funcional en el campo 'imageUrl' si el portal inmobiliario lo permite**. **CRÍTICO: Los comparables DEBEN ser del mismo tipo de operación (${property.listingType === 'sale' ? 'propiedades EN VENTA' : 'propiedades EN ALQUILER'}) que la propiedad a tasar.** La búsqueda debe priorizar el mismo tipo de propiedad. **Aplica los siguientes filtros de búsqueda:** +/- 20% superficie cubierta. ${ageInstructions}. Si usas un tipo alternativo, justifícalo.
      4.  **Análisis Multimodal y Comparación Visual:** Analiza las imágenes proporcionadas de la propiedad del usuario (estado, calidad, luz, etc.). Para cada comparable que generes, **es mandatorio que compares visualmente sus fotos con las del inmueble del usuario.** Debes completar el campo 'visualComparisonResult' para indicar si el comparable es 'Superior', 'Inferior', o 'Igual' al inmueble del usuario. Para 'comparisonReason', justifica esta calificación con detalles específicos (ej: 'Este comparable es superior por su cocina renovada y balcón más grande visible en las fotos').
      5.  **Calcula Intervalos de Confianza:** En lugar de un rango simple, calcula dos escenarios de precio para 'pricingScenarios': 'quickSalePrice' (agresivo) y 'marketPrice' (óptimo). Calcula 'avgPricePerM2' basado en el 'marketPrice'.
      6.  **Factores Clave, FODA, Estadísticas de Mercado:** Completa todas estas secciones como un experto, siendo específico y basándote en datos.

      **Contexto Geográfico**: Debes investigar y reportar servicios y lugares importantes en un radio de 1-2 km alrededor de la propiedad en "${property.address}":
      - **Plazas y Espacios Verdes**: Identifica plazas, parques públicos, y áreas recreativas cercanas.
      - **Escuelas**: Busca escuelas primarias y secundarias en la zona. Incluye tanto escuelas públicas como privadas reconocidas.
      - **Hospitales**: Encuentra hospitales, clínicas y centros de salud cercanos.
      - **Supermercados de Barrio**: Identifica supermercados de barrio, autoservicios, y comercios de proximidad. Reporta estos en la categoría 'supermarkets'.
      - **Shopping y Centros Comerciales**: Identifica shoppings, hipermercados grandes, y centros comerciales formales. Reporta estos en la categoría 'shopping'.
      Para cada lugar, incluye el nombre específico y la distancia aproximada (ej: "500m", "1.2km").

      **Análisis de Escrituras del Colegio de Escribanos**: Para las escrituras, visita 'https://www.colegio-escribanos.org.ar/category/estadisticas-de-escrituras/', analiza el último informe, genera el resumen, encuentra escrituras cercanas, y **usa este 'disclaimer' exacto**: "Los valores de escrituración a menudo se registran a un porcentaje del valor real de mercado (aproximadamente el 70%) y no reflejan detalles específicos como el estado de conservación o la antigüedad exacta del inmueble. Por lo tanto, estos datos deben interpretarse como un indicador de la actividad y la temperatura general del mercado, no como valores de transacción directos para propiedades específicas."
      7.  **Resumen Ejecutivo:** Finalmente, redacta un párrafo conciso para 'executiveSummary' que resuma los hallazgos más importantes.

      Devuelve tu análisis completo en un único objeto JSON válido que se ajuste al esquema proporcionado. No incluyas texto fuera del objeto JSON.
    `;

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                role: 'user',
                parts: [
                    { text: textPrompt },
                    ...imageParts
                ]
            }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.1,
                maxOutputTokens: 8192,
            }
        });

        const responseText = response.text;

        // More robust JSON extraction
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) jsonText = jsonText.substring(7);
        else if (jsonText.startsWith('```')) jsonText = jsonText.substring(3);
        if (jsonText.endsWith('```')) jsonText = jsonText.substring(0, jsonText.length - 3);
        jsonText = jsonText.trim();

        const start = jsonText.indexOf('{');
        const end = jsonText.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            jsonText = jsonText.substring(start, end + 1);
        }

        const result = JSON.parse(jsonText);
        res.json(result);
    } catch (err) {
        console.error('Valuation error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend built assets
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    // If not built yet, warn and serve message
    app.get('*', (req, res) => {
        res.send('Frontend static files not found. Please build the frontend first via "npm run build".');
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
