
import React, { useState, useCallback } from 'react';
import { ImageFile } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageUploaderProps {
  onSubmit: (images: ImageFile[]) => void;
  onBack: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onSubmit, onBack }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (err) => reject(err);
    });

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (!files) return;

    if (images.length + files.length > 10) {
      setError("Puedes subir un máximo de 10 imágenes.");
      return;
    }

    const newImages: ImageFile[] = [];
    for (const file of files) {
      // Enhanced validation: Accept all image formats, block PDFs and malicious files
      if (!file.type.startsWith('image/')) {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          setError(`No se permiten archivos PDF. Por favor, sube solo imágenes.`);
        } else {
          setError(`El archivo ${file.name} no es un tipo de imagen válido.`);
        }
        continue;
      }
      const base64 = await toBase64(file);
      newImages.push({ file, base64 });
    }
    setImages(prev => [...prev, ...newImages]);
  }, [images]);

  const handleCameraCapture = useCallback(async () => {
    if (images.length >= 10) {
      setError("Has alcanzado el máximo de 10 imágenes.");
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      stream.getTracks().forEach(track => track.stop());

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const base64 = await toBase64(file);
          setImages(prev => [...prev, { file, base64 }]);
        }
        setIsCapturing(false);
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsCapturing(false);
    }
  }, [images, toBase64]);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Por favor, sube al menos una imagen.");
      return;
    }
    onSubmit(images);
  };

  return (
    <div className="bg-white/5 backdrop-blur-3xl p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/10 animate-fade-in">
      <h2 className="text-3xl font-black text-white mb-2 flex items-center tracking-tight">
        <CameraIcon className="w-8 h-8 mr-3 text-emerald-400" />
        Suministro de Evidencia
      </h2>
      <p className="text-slate-400 mb-8 font-light italic">Carga registros visuales para la calibración del análisis multimodal (Máx. 10).</p>

      <div className="mt-1 flex flex-col gap-6">
        <div className="flex justify-center px-6 pt-10 pb-12 border-2 border-white/5 border-dashed rounded-3xl bg-black/20 hover:bg-black/30 hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden">
          <div className="space-y-4 text-center relative z-10">
            <div className="mx-auto h-16 w-16 text-emerald-500/30 group-hover:text-emerald-400/50 transition-colors duration-500">
              <svg className="w-full h-full" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col text-sm text-slate-400">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-black text-emerald-400 hover:text-emerald-300 focus-within:outline-none transition-colors">
                <span className="text-lg uppercase tracking-tighter">Inyectar Archivos</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*" />
              </label>
              <p className="mt-1 font-light italic">Arrastra y suelta registros aquí</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <button
            type="button"
            onClick={handleCameraCapture}
            disabled={isCapturing || images.length >= 10}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-white/10 rounded-2xl shadow-xl text-sm font-black uppercase tracking-widest text-emerald-400 bg-white/5 hover:bg-white/10 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <CameraIcon className="h-6 w-6" />
            {isCapturing ? 'Sincronizando Óptica...' : 'Captura en Tiempo Real'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="mt-10 border-t border-white/5 pt-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Muestra Procesada</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {images.map((image, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-square">
                <img src={URL.createObjectURL(image.file)} alt={`preview ${index}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button onClick={() => removeImage(index)} className="p-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/40 transition-all">
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-10 mt-10 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center border-t border-white/5 gap-6">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-all duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Re-Parametrizar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={images.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-4 py-5 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <span>Ejecutar PropIQ Analysis</span>
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
