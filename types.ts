export interface Property {
  address: string;
  listingType: 'sale' | 'rent';
  lat?: number;
  lng?: number;
  propertyType: ('departamento' | 'casa' | 'ph')[];
  coveredArea: number;
  semiCoveredArea: number;
  uncoveredArea: number;
  age: number;
  conservation: 'new' | 'excellent' | 'good' | 'needs_renovation';
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  garages: number;
  hasServiceQuarters: boolean;
  amenities: string[];
  floor?: string;
  layout?: 'front' | 'back' | 'internal';
  orientation?: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  additionalNotes?: string;
  expenses?: number;
  brightness?: 'very_bright' | 'bright' | 'dim';
  heatingType?: 'central_heating' | 'radiators' | 'heaters' | 'ac_split' | 'none';
  hotWaterSystem?: 'central' | 'water_heater' | 'tankless_heater';
  buildingFloors?: number;
  apartmentsPerFloor?: number;
  elevators?: number;
  isProfessionalUseAllowed?: boolean;
}

export interface Comparable {
  id: string;
  address: string;
  priceUSD: number;
  weightedM2: number;
  pricePerM2: number;
  daysOnMarket: number;
  status: 'For Sale' | 'Sold' | 'Reserved';
  zone: 'primary' | 'secondary';
  sourcePortal: 'Zonaprop' | 'Mercado Libre' | 'Argenprop' | 'Mudafy';
  url: string;
  isSubject?: boolean;
  imageUrl: string;
  comparisonReason: string;
  visualComparisonResult: 'Superior' | 'Inferior' | 'Igual';
  lat?: number;
  lng?: number;
}

export interface RecentSale {
  address: string;
  saleDate: string;
  priceUSD: number;
  pricePerM2: number;
}

export interface MarketInsights {
  demandIndex: {
    title: string;
    description: string;
  };
  recentSales: RecentSale[];
}

export interface DeedAnalysis {
  summary: string;
  disclaimer: string;
  sourceUrl: string;
  localDeeds: RecentSale[];
}

export interface NearbyPlace {
  name: string;
  distance: string;
  type?: string;
}

export interface NearbySchools {
  primary: NearbyPlace[];
  secondary: NearbyPlace[];
}

export interface NearbyPlaces {
  parks: NearbyPlace[];
  schools: NearbySchools;
  hospitals: NearbyPlace[];
  supermarkets: NearbyPlace[];
  shopping: NearbyPlace[];
}

export interface ValuationResult {
  executiveSummary: string;
  valuation: {
    pricingScenarios: {
      quickSalePrice: number;
      marketPrice: number;
    };
    avgPricePerM2: number;
  };
  valuationFactors: string[];
  saleExpectancy: string;
  influenceZones: {
    primary: string;
    secondary: string;
  };
  comparables: Comparable[];
  strengths: string[];
  weaknesses: string[];
  marketInsights: MarketInsights;
  deedAnalysis: DeedAnalysis;
  nearbyPlaces: NearbyPlaces;
  futurePotentialAnalysis: string;
}

export interface ValuationError {
  message: string;
  details: string;
}

export interface ImageFile {
  file: File;
  base64: string;
}