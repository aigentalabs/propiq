
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analizando características de la propiedad...",
  "Buscando propiedades comparables en el mercado...",
  "Evaluando zona de influencia y características del barrio...",
  "Realizando análisis multimodal de las imágenes...",
  "Calculando superficie ponderada y ajustes de valor...",
  "Consultando datos de escrituras del Colegio de Escribanos...",
  "Comparando con el mercado inmobiliario actual...",
  "Generando escenarios de precio optimizados...",
  "Compilando el informe de análisis integral...",
];

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-3xl p-10 sm:p-16 rounded-[40px] shadow-2xl border border-white/10 text-center min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
      
      <div className="relative mb-12">
        {/* Orbital Animation */}
        <div className="w-32 h-32 border-[1px] border-emerald-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-emerald-400 rounded-full animate-spin"></div>
        <div className="absolute top-4 left-4 w-24 h-24 border-b-2 border-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-ping"></div>
        </div>
      </div>

      <h2 className="text-3xl font-black text-white mb-3 tracking-tighter animate-pulse">
        Sincronizando <span className="text-emerald-400">PropIQ</span>
      </h2>
      
      <div className="h-8 mb-8">
        <p className="text-emerald-400/80 text-sm font-bold uppercase tracking-[0.2em] animate-fade-in">
          {loadingMessages[messageIndex]}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="w-full bg-white/5 rounded-full h-[6px] overflow-hidden border border-white/5">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full animate-[progress_10s_ease-in-out_infinite]"></div>
        </div>
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>Nucleando Datos</span>
          <span>Analizando</span>
          <span>Finalizando</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
