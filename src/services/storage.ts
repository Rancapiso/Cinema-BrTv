import * as SecureStore from "expo-secure-store";
import { XtreamCreds } from "../types";

const KEY = "xtream_creds_v1";

export async function saveCreds(creds: XtreamCreds): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(creds));
}

export async function loadCreds(): Promise<XtreamCreds | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as XtreamCreds; } catch { return null; }
}

export async function clearCreds(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
