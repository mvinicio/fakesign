'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileWarning, CheckCircle2, XCircle, Info, RefreshCcw } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import VisitCounter from '@/components/VisitCounter';
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
        <h1 className="text-5xl font-black text-gray-500 tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900">
          ¿Es una firma real?

        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Verifique la autenticidad de una firma digital de forma segura y automatizada.
          Identifique firmas fraudulentas en PDF sin comprometer la privacidad de sus documentos

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
                      {isDigital ? 'Firma Digital Detectada' : isVisual ? 'Posible Firma Montada' : 'El documento NO contiene firma digital'}
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
                              ? 'Se detectó únicamente una representación visual que simula una firma, sin respaldo criptográfico.'
                              : 'se detectó únicamente una representación visual que simula una firma, sin respaldo criptográfico.'
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
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      Análisis Técnico
                    </h3>
                    <div className="space-y-4">
                      {/* Signature Dictionary */}
                      <div className="flex gap-3">
                        {isDigital ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                        <div className="text-sm">
                          <p className={`font-semibold ${isDigital ? 'text-green-800' : 'text-red-800'}`}>
                            {isDigital ? 'Objeto de firma detectado' : 'Sin objetos de firma digital'}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {isDigital
                              ? 'Se encontró un Signature Dictionary válido en la estructura del PDF.'
                              : 'No se encontraron objetos de firma digital (Signature Dictionary) en la estructura interna del PDF.'}
                          </p>
                        </div>
                      </div>

                      {/* Certificates */}
                      <div className="flex gap-3">
                        {isDigital ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                        <div className="text-sm">
                          <p className={`font-semibold ${isDigital ? 'text-green-800' : 'text-red-800'}`}>
                            {isDigital ? 'Certificado X.509 verificado' : 'Sin certificados digitales'}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {isDigital
                              ? 'El documento contiene certificados digitales válidos asociados.'
                              : 'No se detectaron certificados digitales (X.509) asociados al documento.'}
                          </p>
                        </div>
                      </div>

                      {/* Integrity Seal */}
                      <div className="flex gap-3">
                        {isDigital ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                        <div className="text-sm">
                          <p className={`font-semibold ${isDigital ? 'text-green-800' : 'text-red-800'}`}>
                            {isDigital ? 'Sello de integridad activo' : 'Sin sello de integridad'}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {isDigital
                              ? 'La integridad criptográfica garantiza que el archivo no fue modificado.'
                              : 'No existe sello de integridad criptográfica que garantice que el archivo no fue modificado.'}
                          </p>
                        </div>
                      </div>

                      {/* Visual Layer - Only if applicable or as warning in failure */}
                      {(isVisual || !isDigital) && (
                        <div className="flex gap-3 pt-2 border-t border-gray-200 mt-4">
                          <FileWarning className="w-5 h-5 text-amber-500 shrink-0" />
                          <div className="text-sm">
                            <p className="font-semibold text-amber-800">
                              Representación Visual
                            </p>
                            <p className="text-gray-600 text-xs mt-0.5">
                              Se identificó un elemento gráfico superpuesto, correspondiente a una imagen o capa visual.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto py-8 flex flex-col items-center gap-4">
        <VisitCounter />
        <p className="text-gray-400 text-sm">
          Desarrollado por Marco Sotomayor para detección de fraudes documentales.
        </p>
      </footer>
    </main>
  );
}
