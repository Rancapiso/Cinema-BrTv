import { LiveCategory, LiveStream, XtreamCreds, XtreamHandshake } from "../types";

function normalizeHost(host: string): string {
  let h = host.trim();
  if (!/^https?:\/\//i.test(h)) h = "http://" + h;
  // remove trailing slash
  h = h.replace(/\/+$/g, "");
  return h;
}

export function buildCreds(host: string, username: string, password: string, output: "m3u8"|"ts"): XtreamCreds {
  return { host: normalizeHost(host), username: username.trim(), password: password.trim(), output };
}

function apiUrl(creds: XtreamCreds, extra: string = ""): string {
  const { host, username, password } = creds;
  const base = `${host}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  return extra ? `${base}&${extra}` : base;
}

export async function testLogin(creds: XtreamCreds): Promise<XtreamHandshake> {
  const res = await fetch(apiUrl(creds));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as XtreamHandshake;
  if (!json?.user_info || !json?.server_info) throw new Error("Resposta inválida");
  // alguns servidores retornam auth=0
  if (json.user_info?.auth === 0) throw new Error("Credenciais inválidas");
  return json;
}

export async function getLiveCategories(creds: XtreamCreds): Promise<LiveCategory[]> {
  const res = await fetch(apiUrl(creds, "action=get_live_categories"));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as LiveCategory[];
}

export async function getLiveStreams(creds: XtreamCreds): Promise<LiveStream[]> {
  const res = await fetch(apiUrl(creds, "action=get_live_streams"));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as LiveStream[];
}

export function buildLivePlaybackUrl(creds: XtreamCreds, streamId: number): string {
  const { host, username, password, output } = creds;
  const ext = output === "m3u8" ? "m3u8" : "ts";
  return `${host}/live/${encodeURIComponent(username)}/${encodeURIComponent(password)}/${streamId}.${ext}`;
}
