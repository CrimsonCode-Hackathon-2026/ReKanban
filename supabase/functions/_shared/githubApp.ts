import { createAppAuth } from "npm:@octokit/auth-app";
import { Octokit } from "npm:octokit";

export function getOctokitForInstallation(installationId: number): Octokit {
  if (!Number.isInteger(installationId) || installationId <= 0) {
    throw new Error(
      `Invalid installationId: expected a positive integer, received ${installationId}.`,
    );
  }

  const appIdRaw = Deno.env.get("GH_APP_ID");
  const privateKeyRaw = Deno.env.get("GH_PRIVATE_KEY");

  if (!appIdRaw) {
    throw new Error("Missing required environment variable: GH_APP_ID.");
  }

  if (!privateKeyRaw) {
    throw new Error("Missing required environment variable: GH_PRIVATE_KEY.");
  }

  const appId = Number(appIdRaw);
  if (!Number.isInteger(appId) || appId <= 0) {
    throw new Error(
      `Invalid GH_APP_ID: expected a positive integer, received "${appIdRaw}".`,
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });
}
