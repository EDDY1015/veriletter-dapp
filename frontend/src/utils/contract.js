import { ethers } from "ethers";
import VeriLetterABI from "./VeriLetterABI.json";

// Load values from .env
const contractAddress = process.env.REACT_APP_PROXY_ADDRESS;
const rpcURL = process.env.REACT_APP_RPC_URL;

/**
 * Read-only contract instance using public RPC
 */
export function getVerifierContract() {
  if (!contractAddress || !rpcURL) {
    throw new Error("Missing REACT_APP_PROXY_ADDRESS or REACT_APP_RPC_URL in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcURL);
  return new ethers.Contract(contractAddress, VeriLetterABI, provider);
}

// 👇 REMOVE MetaMask version entirely
// No getVerifierWithSigner function anymore

export const CONTRACT_ADDRESS = contractAddress;
export const RPC_URL = rpcURL;
