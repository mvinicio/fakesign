'use server';

import { analyzePdfSignatures, SignatureInfo } from '@/lib/pdf-analyzer';

export interface VerificationResult {
    success: boolean;
    signatures: SignatureInfo[];
    error?: string;
    filename: string;
}

export async function verifyPdfAction(formData: FormData): Promise<VerificationResult> {
    const file = formData.get('pdf') as File;

    if (!file) {
        return { success: false, signatures: [], error: 'No se subió ningún archivo', filename: '' };
    }

    if (file.type !== 'application/pdf') {
        return { success: false, signatures: [], error: 'El archivo debe ser un PDF', filename: file.name };
    }

    try {
        console.log(`Processing PDF: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const signatures = await analyzePdfSignatures(buffer);

        return {
            success: true,
            signatures,
            filename: file.name
        };
    } catch (error) {
        console.error('Error in verifyPdfAction:', error);
        return {
            success: false,
            signatures: [],
            error: error instanceof Error ? error.message : 'Error al procesar el PDF estructuralmente. Es posible que el archivo esté corrupto o protegido.',
            filename: file.name
        };
    }
}
