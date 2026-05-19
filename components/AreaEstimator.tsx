import React, { useState, useRef, useCallback } from 'react';

interface AreaEstimatorProps {
    onResult: (result: {
        estimatedWidth: number;
        estimatedLength: number;
        estimatedM2: number;
        confidence: 'alta' | 'media' | 'baja';
        references: string[];
        notes: string;
        disclaimer: string;
    }, imagePreview: string) => void;
    onClose: () => void;
}

const ROOM_LABELS = [
    'Living / Estar',
    'Comedor',
    'Dormitorio Principal',
    'Dormitorio 2',
    'Dormitorio 3',
    'Cocina',
    'Baño',
    'Balcón / Terraza',
    'Patio',
    'Garaje',
    'Otro ambiente',
];

const AreaEstimator: React.FC<AreaEstimatorProps> = ({ onResult, onClose }) => {
    const [roomLabel, setRoomLabel] = useState('Living / Estar');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    }, []);

    const startCamera = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsCameraActive(true);
        } catch {
            setError('No se pudo acceder a la cámara. Usá el botón "Subir foto" en su lugar.');
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];

        setImagePreview(dataUrl);
        setImageData({ base64, mimeType: 'image/jpeg' });
        stopCamera();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            const base64 = dataUrl.split(',')[1];
            setImagePreview(dataUrl);
            setImageData({ base64, mimeType: file.type || 'image/jpeg' });
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!imageData) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const res = await fetch('/api/estimateArea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData, roomLabel }),
            });

            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            onResult(data, imagePreview!);
        } catch (err: any) {
            setError(`No se pudo analizar la imagen: ${err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        stopCamera();
        setImagePreview(null);
        setImageData(null);
        setError(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
            <div className="bg-[#0f172a] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div>
                        <h2 className="text-base font-black text-white uppercase tracking-tight">
                            📐 Estimador de Superficie
                        </h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">Sacá una foto del ambiente y la IA estima los m²</p>
                    </div>
                    <button onClick={() => { stopCamera(); onClose(); }} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Room selector */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tipo de ambiente</label>
                        <select
                            value={roomLabel}
                            onChange={e => setRoomLabel(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 appearance-none"
                        >
                            {ROOM_LABELS.map(l => <option key={l} value={l} className="bg-[#0f172a]">{l}</option>)}
                        </select>
                    </div>

                    {/* Camera / Preview Area */}
                    <div className="relative bg-black rounded-2xl overflow-hidden" style={{ minHeight: '200px' }}>
                        {isCameraActive && (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ maxHeight: '280px' }}
                            />
                        )}
                        {imagePreview && !isCameraActive && (
                            <img src={imagePreview} alt="Preview" className="w-full object-contain" style={{ maxHeight: '280px' }} />
                        )}
                        {!isCameraActive && !imagePreview && (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                                <svg className="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-xs">Sin imagen</p>
                            </div>
                        )}

                        {/* Camera capture button overlay */}
                        {isCameraActive && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                <button
                                    onClick={capturePhoto}
                                    className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-transform"
                                />
                            </div>
                        )}
                    </div>

                    <canvas ref={canvasRef} className="hidden" />

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{error}</div>
                    )}

                    {/* Action buttons */}
                    {!imagePreview && !isCameraActive && (
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={startCamera} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 active:scale-[0.98] transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Cámara
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Subir foto
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </div>
                    )}

                    {imagePreview && !isAnalyzing && (
                        <div className="flex gap-3">
                            <button onClick={handleReset} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition-all">
                                Nueva foto
                            </button>
                            <button onClick={handleAnalyze} className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                                </svg>
                                Estimar m²
                            </button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="flex flex-col items-center py-4 gap-3">
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 animate-pulse">Analizando el ambiente con IA...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AreaEstimator;
