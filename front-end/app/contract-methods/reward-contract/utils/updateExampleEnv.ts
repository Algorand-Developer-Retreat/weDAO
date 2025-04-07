// scripts/updateExampleEnv.ts
import fs from "fs";
import path from "path";

export const updateExampleEnv = (key: string, value: string) => {
  const envPath = path.resolve(process.cwd(), "example.env");

  let content = "";
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf-8");
  }

  const lines = content.split("\n").filter(Boolean);
  const index = lines.findIndex((line) => line.startsWith(`${key}=`));

  if (index >= 0) {
    lines[index] = `${key}=${value}`;
  } else {
    lines.push(`${key}=${value}`);
  }

  fs.writeFileSync(envPath, lines.join("\n") + "\n");
  console.log(`✅ example.env updated: ${key}=${value}`);
};
