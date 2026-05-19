import * as genai from "@google/genai";
const { GoogleGenAI, Type } = genai;
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: {
            type: Type.STRING,
            description: "A concise executive summary paragraph in Spanish.",
        },
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
        valuationFactors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        saleExpectancy: {
            type: Type.STRING,
        },
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
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        marketInsights: {
            type: Type.OBJECT,
            properties: {
                demandIndex: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                },
                recentSales: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            address: { type: Type.STRING },
                            saleDate: { type: Type.STRING },
                            priceUSD: { type: Type.NUMBER },
                            pricePerM2: { type: Type.NUMBER }
                        },
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
                        properties: {
                            address: { type: Type.STRING },
                            saleDate: { type: Type.STRING },
                            priceUSD: { type: Type.NUMBER },
                            pricePerM2: { type: Type.NUMBER }
                        },
                        required: ["address", "saleDate", "priceUSD", "pricePerM2"]
                    }
                }
            },
            required: ["summary", "disclaimer", "sourceUrl", "localDeeds"]
        },
        futurePotentialAnalysis: {
            type: Type.STRING,
        },
    },
    required: ["executiveSummary", "valuation", "valuationFactors", "saleExpectancy", "influenceZones", "comparables", "strengths", "weaknesses", "marketInsights", "deedAnalysis", "futurePotentialAnalysis"],
};

async function test() {
    try {
        console.log("Calling gemini-2.0-flash with schema...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: 'Tasa un departamento de 2 ambientes en Palermo, 50m2.' }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });
        console.log("Response text length:", response.text.length);
        console.log("Response preview:", response.text.substring(0, 200));
    } catch (error) {
        console.error("Error calling model:", error);
    }
}

test();
