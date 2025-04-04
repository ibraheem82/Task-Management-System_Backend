
export const bufferToBase64 = (buffer) => {
    const mimeType = detectMimeType(buffer);
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  };
  
 
  const detectMimeType = (buffer) => {
    const signatures = {
      "image/png": [0x89, 0x50, 0x4e, 0x47],
      "image/jpeg": [0xff, 0xd8, 0xff],
      "image/gif": [0x47, 0x49, 0x46],
      "image/webp": [0x52, 0x49, 0x46, 0x46],
    };
  
    for (const [mime, signature] of Object.entries(signatures)) {
      if (signature.every((byte, index) => buffer[index] === byte)) {
        return mime;
      }
    }
  
    throw new Error("Unsupported file type");
  };