import { keccak256, toUtf8Bytes } from "ethers";

/**
 * Hash name + passport together as one student identity hash.
 * Inputs are normalized (lowercase, trimmed).
 */
export function hashStudentInfo(firstName, lastName, passport) {
  const cleanInput = `${firstName.trim().toLowerCase()}${lastName.trim().toLowerCase()}${passport.trim()}`;
  return keccak256(toUtf8Bytes(cleanInput));
}

/**
 * Hash file contents using keccak256
 */
export async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  return keccak256(new Uint8Array(buffer));
}
