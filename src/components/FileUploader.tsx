'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VerificationResult } from '@/actions/verify-pdf';

interface FileUploaderProps {
    onResult: (result: VerificationResult) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export default function FileUploader({ onResult, loading, setLoading }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Por favor, sube un archivo PDF');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const { verifyPdfAction } = await import('@/actions/verify-pdf');
            const result = await verifyPdfAction(formData);
            onResult(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleChange}
            />

            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {loading ? (
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Upload className="w-8 h-8 text-blue-600" />
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        {loading ? 'Analizando documento...' : 'Subir archivo PDF'}
                    </h3>
                    <p className="text-gray-500 mt-2">
                        Arrastra tu archivo aquí o haz clic para seleccionarlo
                    </p>
                </div>

                <div className="flex gap-4 mt-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        Detección Criptográfica
                    </div>
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        Seguro y Privado
                    </div>
                </div>
            </div>

            {dragActive && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl pointer-events-none" />
            )}
        </motion.div>
    );
}
