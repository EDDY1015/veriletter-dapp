import { keccak256, toUtf8Bytes } from "ethers";

/**
 * Hash only the passport number (normalized)
 */
export function hashStudentInfo(passport) {
  return keccak256(toUtf8Bytes(passport.trim().toUpperCase()));
}

/**
 * Hash file contents using keccak256
 */
export async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  return keccak256(new Uint8Array(buffer));
}
