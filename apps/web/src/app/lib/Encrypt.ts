import CryptoJS from "crypto-js";

const passphrase = process.env.NEXT_PUBLIC_SECRET || "secretphase";

export function decryptMessage(encryptedMessage: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}
export function encrypt(msg: string) {
  return CryptoJS.AES.encrypt(msg, passphrase).toString();
}
