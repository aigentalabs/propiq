// Shared utility functions for PropIQ

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const calculateWeightedM2 = (covered: number, semiCovered: number, uncovered: number): number => {
    return covered + (semiCovered * 0.5) + (uncovered * 0.3);
};
