import { keccak256, toUtf8Bytes } from "ethers";

export function getIssuerIdFromEmail(email) {
  return keccak256(toUtf8Bytes(email.trim().toLowerCase()));
}

export function hashSubjectId(identifier) {
  return keccak256(toUtf8Bytes(identifier.trim()));
}

export async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  return "0x" + Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}