
import React, { useState, useCallback, useEffect } from 'react';
import { Property, ValuationResult, ValuationError } from './types';
import PropertyForm from './components/PropertyForm';
import ImageUploader from './components/ImageUploader';
import { getValuation } from './services/geminiService';
import Loader from './components/Loader';
import ValuationReport from './components/ValuationReport';
import HistoryPanel from './components/HistoryPanel';
import { LogoIcon } from './components/icons/LogoIcon';
import { AigentaLogo } from './components/icons/AigentaLogo';
import { saveValuation, loadHistory, HistoryRecord } from './services/historyService';

type AppStep = 'form' | 'images' | 'loading' | 'report' | 'error';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('form');
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState<ValuationError | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);

  const refreshHistory = useCallback(() => {
    setHistoryRecords(loadHistory());
  }, []);

  useEffect(() => { refreshHistory(); }, [refreshHistory]);

  const handleFormSubmit = (data: Property) => {
    setPropertyData(data);
    setStep('images');
  };

  const handleImagesSubmit = async (uploadedImages: { file: File; base64: string }[]) => {
    if (!propertyData) return;
    const base64s = uploadedImages.map(img => img.base64);
    setImages(base64s);
    setStep('loading');
    setError(null);

    try {
      const result = await getValuation(propertyData, uploadedImages);
      setValuationResult(result);
      setStep('report');
      // Auto-save to history
      saveValuation(propertyData, result, base64s);
      refreshHistory();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError({ message: err.message, details: 'Ocurrió un error inesperado al comunicarse con la IA. Por favor, inténtalo de nuevo.' });
      } else {
        setError({ message: 'Error Desconocido', details: 'Ocurrió un error desconocido.' });
      }
      setStep('error');
    }
  };

  const handleReset = () => {
    setPropertyData(null);
    setImages([]);
    setValuationResult(null);
    setError(null);
    setStep('form');
  };

  const handleLoadFromHistory = (record: HistoryRecord) => {
    setPropertyData(record.property);
    setImages(record.uploadedImages);
    setValuationResult(record.result);
    setStep('report');
  };

  const renderStep = () => {
    switch (step) {
      case 'form':
        return <PropertyForm onSubmit={handleFormSubmit} />;
      case 'images':
        return <ImageUploader onSubmit={handleImagesSubmit} onBack={() => setStep('form')} />;
      case 'loading':
        return <Loader />;
      case 'report':
        return valuationResult && <ValuationReport result={valuationResult} property={propertyData!} onReset={handleReset} uploadedImages={images} />;
      case 'error':
        return (
          <div className="w-full max-w-2xl mx-auto text-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Falló la Tasación</h2>
            <p className="text-slate-400 mb-2 font-bold">{error?.message}</p>
            <p className="text-slate-500 mb-8 text-sm">{error?.details}</p>
            <button
              onClick={handleReset}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Empezar de Nuevo
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col items-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full animate-blob animation-delay-4000"></div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel
          records={historyRecords}
          onLoad={handleLoadFromHistory}
          onClose={() => setShowHistory(false)}
          onRefresh={refreshHistory}
        />
      )}

      <div className="w-full max-w-6xl z-10">
        <header className="w-full max-w-4xl mx-auto text-center mb-12 pt-8">
          <div className="mb-8 animate-fade-in">
            {/* Logo + History button row */}
            <div className="flex items-center justify-center relative mb-4">
              <div className="p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <LogoIcon className="h-16 w-16 text-emerald-400" />
              </div>
              {/* History button — top right */}
              <button
                onClick={() => { refreshHistory(); setShowHistory(true); }}
                className="absolute right-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest group"
              >
                <svg className="w-4 h-4 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Historial</span>
                {historyRecords.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black flex items-center justify-center">
                    {historyRecords.length}
                  </span>
                )}
              </button>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter">
              Prop<span className="text-emerald-400">IQ</span>
            </h1>
            <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mb-4"></div>
            <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide max-w-2xl mx-auto">
              Inteligencia Artificial aplicada a la <span className="text-white font-medium">precisión inmobiliaria</span>
            </p>
          </div>

          {/* Value Props */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base text-slate-400">
              <span className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-default">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Análisis de ADN
              </span>
              <span className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-default">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Mercado Real
              </span>
              <span className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-default">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Detección Temprana
              </span>
            </div>
          </div>

          {/* Stepper */}
          {step !== 'report' && step !== 'loading' && step !== 'error' && (
            <div className="flex justify-center items-center gap-4 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500 mt-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${step === 'form' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white/5 border-white/10 text-emerald-400'}`}>
                <span>01</span>
                <span className="hidden sm:inline">Propiedad</span>
              </div>
              <div className={`w-12 h-[2px] transition-all duration-300 ${step === 'images' ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${step === 'images' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                <span>02</span>
                <span className="hidden sm:inline">Evidencia</span>
              </div>
              <div className="w-12 h-[2px] bg-white/10"></div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <span>03</span>
                <span className="hidden sm:inline">Reporte</span>
              </div>
            </div>
          )}
        </header>

        <main className="w-full max-w-4xl mx-auto mb-20">
          {renderStep()}
        </main>

        <footer className="w-full max-w-4xl mx-auto pb-12">
          <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <AigentaLogo className="h-8" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-400 text-sm tracking-wide">
                © 2026 <span className="text-white font-semibold">PropIQ</span> by <span className="text-emerald-400 font-bold uppercase tracking-tighter">Aigenta</span>. Todos los derechos reservados.
              </p>
              <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                <span className="hover:text-slate-400 transition-colors cursor-pointer">Términos de Uso</span>
                <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacidad</span>
                <span className="hover:text-slate-400 transition-colors cursor-pointer">Soporte Técnico</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;