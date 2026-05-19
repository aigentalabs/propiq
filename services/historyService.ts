import { ValuationResult, Property } from '../types';

const STORAGE_KEY = 'propiq_history';
const MAX_RECORDS = 20;

export interface HistoryRecord {
    id: string;
    createdAt: string; // ISO string
    property: Property;
    result: ValuationResult;
    uploadedImages: string[]; // base64, first image only for thumbnail
}

export function saveValuation(
    property: Property,
    result: ValuationResult,
    uploadedImages: string[]
): HistoryRecord {
    const record: HistoryRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
        property,
        result,
        // Only save first image as thumbnail to avoid localStorage bloat
        uploadedImages: uploadedImages.slice(0, 1),
    };

    const existing = loadHistory();
    const updated = [record, ...existing].slice(0, MAX_RECORDS);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // localStorage full — trim and retry
        const trimmed = [record, ...existing].slice(0, Math.floor(MAX_RECORDS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
    return record;
}

export function loadHistory(): HistoryRecord[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as HistoryRecord[];
    } catch {
        return [];
    }
}

export function deleteHistoryRecord(id: string): void {
    const existing = loadHistory().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export function formatHistoryDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}
