import crypto from "crypto";

const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.AES_SECRET_KEY || "default_secret")
  .digest();

const IV_LENGTH = 12; // GCM standard

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", SECRET_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decrypt(
  encryptedData: string,
  iv: string,
  authTag: string
) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    SECRET_KEY,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}