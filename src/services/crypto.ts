/**
 * Simple encryption utility using Web Crypto API
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

async function getEncryptionKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return crypto.subtle.importKey('raw', hash, ALGORITHM, false, ['encrypt', 'decrypt']);
}

export async function encryptData(text: string, password: string = 'default-key'): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
  const key = await getEncryptionKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );
  
  return { encrypted, iv };
}

export async function decryptData(encrypted: ArrayBuffer, iv: Uint8Array, password: string = 'default-key'): Promise<string> {
  const key = await getEncryptionKey(password);
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
