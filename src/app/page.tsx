'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileWarning, CheckCircle2, XCircle, Info, RefreshCcw } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import { VerificationResult } from '@/actions/verify-pdf';

export default function Home() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setResult(null);
  };

  const isDigital = result?.signatures.some(s => s.type === 'digital');
  const isVisual = result?.signatures.some(s => s.type === 'visual');

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="max-w-4xl w-full text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6 shadow-sm ring-1 ring-indigo-200"
        >
          <Shield className="w-4 h-4" />
          Anny Fake Sign
        </motion.div>
        <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900">
          ¿Es una firma real?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Nuestra tecnología analiza la estructura interna del PDF para detectar si una firma es digital criptográfica o simplemente una imagen superpuesta.
        </p>
      </div>

      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {!result ? (
            <FileUploader onResult={setResult} loading={loading} setLoading={setLoading} />
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
            >
              {/* Result Header */}
              <div className={`p-8 flex items-center justify-between ${isDigital ? 'bg-green-50' : isVisual ? 'bg-amber-50' : 'bg-red-50'
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDigital ? 'bg-green-100 text-green-600' : isVisual ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {isDigital ? <CheckCircle2 /> : isVisual ? <FileWarning /> : <XCircle />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {isDigital ? 'Firma Digital Detectada' : isVisual ? 'Posible Firma Montada' : 'No se detectaron firmas'}
                    </h2>
                    <p className="text-gray-500 font-mono text-sm truncate max-w-[300px]">
                      {result.filename}
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Analizar otro
                </button>
              </div>

              {/* Details Body */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Resultado del Análisis</h3>
                      <div className={`p-4 rounded-xl border ${isDigital ? 'border-green-100 bg-green-50/50' : 'border-amber-100 bg-amber-50/50'
                        }`}>
                        <p className="text-gray-700 leading-relaxed">
                          {isDigital
                            ? 'Este documento contiene objetos de firma (Sig) correspondientes a una firma electrónica válida. La integridad del documento está respaldada por una autoridad de certificación.'
                            : isVisual
                              ? 'Se detectaron campos de firma visuales pero sin datos criptográficos asociados. Esto sugiere que la firma es una imagen pegada o fue escaneada.'
                              : 'No se encontraron objetos de firma digital ni campos visuales de firma en este PDF.'
                          }
                        </p>
                      </div>
                    </div>

                    {result.signatures.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Firmas Encontradas</h3>
                        <div className="space-y-3">
                          {result.signatures.map((sig, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-gray-700">{sig.details?.name || 'Firma #' + (i + 1)}</span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${sig.type === 'digital' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {sig.type === 'digital' ? 'Digital' : 'Visual/Capa'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      ¿Por qué es importante?
                    </h3>
                    <ul className="space-y-4 text-sm text-gray-600">
                      <li className="flex gap-3">
                        <span className="text-blue-500 font-bold">•</span>
                        <div>
                          <strong>Validez Legal:</strong> Solo las firmas digitales criptográficas tienen la misma validez que una firma manuscrita bajo leyes de comercio electrónico.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-500 font-bold">•</span>
                        <div>
                          <strong>Integridad:</strong> Una firma digital asegura que el PDF no ha sido modificado después de ser firmado.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-500 font-bold">•</span>
                        <div>
                          <strong>Riesgo de Fraude:</strong> Las firmas "montadas" (capturas de pantalla) son fáciles de falsificar y no ofrecen ninguna garantía de que el emisor realmente firmó el documento.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto py-8 text-gray-400 text-sm">
        Desarrollado con precisión para detección de fraudes documentales.
      </footer>
    </main>
  );
}
