import * as ScreenOrientation from "expo-screen-orientation";

export async function lockLandscape(): Promise<void> {
  try {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  } catch {}
}
