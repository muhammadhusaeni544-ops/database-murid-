import QRCode from 'qrcode';

export async function generateStudentQR(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 256,
      margin: 1,
      color: {
        dark: '#064e3b', // Deep emerald green
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}
