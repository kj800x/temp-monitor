import fs from "fs";
import path from "path";

export function readAPIKey(): string {
  try {
    const envFilePath = path.join(__dirname, "..", "..", "..", ".env");
    const envFile = fs.readFileSync(envFilePath, "utf8");
    return envFile
      .split("\n")
      .find((line) => line.startsWith("API_KEY"))!
      .split("API_KEY=")[1]!
      .trim();
  } catch (error) {
    throw new Error(
      "Unable to read API_KEY from .env file. Have you created one?"
    );
  }
}
