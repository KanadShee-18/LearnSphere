import { google } from "googleapis";
import type { JWT } from "google-auth-library";
import { CONFIGS } from "./index.js";

let jwtClient: JWT | null = null;

export const connectDrive = async (): Promise<void> => {
  try {
    if (
      !CONFIGS.google_api_client_mail ||
      !CONFIGS.google_api_private_key ||
      !CONFIGS.google_api_scope
    ) {
      throw new Error("❌ Missing Google API environmental variables.");
    }

    jwtClient = new google.auth.JWT({
      email: CONFIGS.google_api_client_mail,
      key: CONFIGS.google_api_private_key.split(String.raw`\n`).join("\n"),
      scopes: [CONFIGS.google_api_scope],
    });

    await jwtClient.authorize();
    console.log("<<< [✅Drive API] => connected successfully ...>>>");
  } catch (error) {
    console.log("<<< ❌Error while connecting to Google Drive ...>>>", error);
  }
};

export const getAuthClient = (): JWT | null => {
  return jwtClient;
};
