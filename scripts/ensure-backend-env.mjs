import { access, copyFile } from "node:fs/promises";
import path from "node:path";

const backendDir = path.resolve("backend");
const envFile = path.join(backendDir, ".env");
const exampleFile = path.join(backendDir, ".env.example");

try {
  await access(envFile);
} catch {
  await copyFile(exampleFile, envFile);
  console.log("Created backend/.env from backend/.env.example");
}

