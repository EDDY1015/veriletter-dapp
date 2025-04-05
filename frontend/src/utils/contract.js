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

/**
 * Write-enabled contract using MetaMask (signer)
 */
export async function getVerifierWithSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask.");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, VeriLetterABI, signer);
}
export const CONTRACT_ADDRESS = contractAddress;
export const RPC_URL = rpcURL;
