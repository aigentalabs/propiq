import { GoogleGenAI } from "@google/genai";

interface AreaEstimationRequest {
    image: {
        base64: string;
        mimeType: string;
    };
    roomLabel?: string; // e.g. "living", "dormitorio principal"
}

interface AreaEstimationResult {
    estimatedWidth: number;   // metros
    estimatedLength: number;  // metros
    estimatedM2: number;
    confidence: 'alta' | 'media' | 'baja';
    references: string[];     // visual references used: "puerta estándar", "baldosa 60x60", etc.
    notes: string;
    disclaimer: string;
}

const AREA_PROMPT = `Eres un arquitecto experto en medición de espacios. 
Analiza la imagen de este ambiente y estima sus dimensiones usando referencias visuales presentes en la foto.

MÉTODO DE ESTIMACIÓN:
1. Identificá los objetos de referencia con medidas estándar conocidas:
   - Puertas interiores: ancho ~0.80m, altura ~2.00m-2.10m
   - Puertas balcón/ventana grande: ancho ~1.20m-1.80m
   - Baldosas/porcelanato: formatos comunes 60x60, 45x45, 30x30, 80x80 cm
   - Cerámicos: formatos comunes 20x20, 25x38 cm
   - Cama matrimonial: ~1.40m x ~1.90m
   - Cama individual: ~0.90m x ~1.90m
   - Heladera: ~0.60m x ~0.60m
   - Puerta de placard: ~0.45m-0.60m por hoja
   - Ventanas: ~1.00m-1.50m de ancho típico
   - Mesa de comedor: ~0.80m x ~1.60m (4 personas)
   - Inodoro: ~0.35m de ancho
   - Mesada de cocina: ~0.60m de profundidad
2. Contá cuántas veces caben esos objetos a lo largo y ancho visible del ambiente
3. Si el ambiente no es visible completo, estimá la proporción y extrapolá

IMPORTANTE:
- Estimá el ancho y el largo del ambiente principal visible
- Si es un ambiente irregular, estimá el rectángulo principal
- Expresá la confianza: 'alta' si hay 3+ referencias claras, 'media' si hay 1-2, 'baja' si no hay referencias claras
- El campo 'references' debe listar exactamente qué objetos usaste como referencia (ej: ["2 baldosas 60x60 contadas en el ancho", "puerta de 80cm como referencia de altura"])
- El campo 'notes' debe explicar brevemente el razonamiento
- El campo 'disclaimer' debe ser SIEMPRE: "Esta estimación es referencial. Para valores exactos se recomienda medición profesional con distanciómetro láser."

Devolvé ÚNICAMENTE un JSON válido con esta estructura:
{
  "estimatedWidth": <número en metros, ej: 3.5>,
  "estimatedLength": <número en metros, ej: 4.2>,
  "estimatedM2": <ancho × largo, ej: 14.7>,
  "confidence": "alta" | "media" | "baja",
  "references": ["referencia 1", "referencia 2"],
  "notes": "explicación del razonamiento",
  "disclaimer": "Esta estimación es referencial..."
}`;

export async function estimateAreaFromImage(
    apiKey: string,
    request: AreaEstimationRequest
): Promise<AreaEstimationResult> {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
            role: 'user',
            parts: [
                { text: request.roomLabel ? `Ambiente: ${request.roomLabel}\n\n${AREA_PROMPT}` : AREA_PROMPT },
                { inlineData: { mimeType: request.image.mimeType, data: request.image.base64 } }
            ]
        }],
        config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 512,
        }
    });

    const text = response.text?.trim() || '{}';
    const json = text.startsWith('{') ? text : text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const result: AreaEstimationResult = JSON.parse(json);

    // Recalculate m² in case AI made arithmetic error
    result.estimatedM2 = parseFloat((result.estimatedWidth * result.estimatedLength).toFixed(2));

    return result;
}
