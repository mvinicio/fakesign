import { PDFDocument, PDFName, PDFDict, PDFArray, PDFStream } from 'pdf-lib';

export interface SignatureInfo {
  found: boolean;
  type: 'digital'| 'visual' | 'none';
  details?: {
    name?: string;
    date?: string;
    reason?: string;
    location?: string;
    isCryptographic?: boolean;
  };
}

export async function analyzePdfSignatures(pdfBuffer: Buffer): Promise<SignatureInfo[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    const signatures: SignatureInfo[] = [];

    // 1. Check for AcroForm Signature Fields
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    for (const field of fields) {
      const type = field.constructor.name;
      if (type === 'PDFSignature') {
        // Found a signature field
        const dict = field.acroField.dict;
        const v = dict.get(PDFName.of('V')); // The value of the field (the signature dictionary)
        
        if (v instanceof PDFDict) {
          signatures.push({
            found: true,
            type: 'digital',
            details: {
              name: dict.get(PDFName.of('T'))?.toString() || 'Unknown Signature Field',
              isCryptographic: true,
            }
          });
        } else {
            // It's a signature field but has no value (not signed yet or just a placeholder)
            signatures.push({
                found: true,
                type: 'visual',
                details: {
                    name: field.getName(),
                    isCryptographic: false,
                }
            });
        }
      }
    }

    // 2. Deep structural scan for /Sig objects (in case they aren't in the form fields)
    const context = pdfDoc.context;
    const indirectObjects = context.enumerateIndirectObjects();
    
    for (const [ref, obj] of indirectObjects) {
        if (obj instanceof PDFDict) {
            const type = obj.get(PDFName.of('Type'));
            if (type === PDFName.of('Sig')) {
                // Check if we already found this signature
                const isAlreadyFound = signatures.some(s => s.type === 'digital');
                if (!isAlreadyFound) {
                    signatures.push({
                        found: true,
                        type: 'digital',
                        details: {
                            isCryptographic: true,
                            name: obj.get(PDFName.of('Name'))?.toString() || 'Embedded Digital Signature',
                        }
                    });
                }
            }
        }
    }

    if (signatures.length === 0) {
      return [{ found: false, type: 'none' }];
    }

    return signatures;
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    throw new Error('Could not analyze PDF file');
  }
}
