import { execFileSync } from "node:child_process";
import { existsSync, rmSync, cpSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const repoRoot = process.cwd();
const distDir = join(repoRoot, "dist-web");
const worktreeDir = join(tmpdir(), "chelly-gh-pages");

if (!existsSync(distDir)) {
  throw new Error("dist-web does not exist. Run pnpm build:web:pages first.");
}

rmSync(worktreeDir, { recursive: true, force: true });
execFileSync("git", [
  "-c", "core.longpaths=true",
  "clone", "--depth", "1", "--branch", "gh-pages",
  "https://github.com/RYOITABASHI/Chelly.git", worktreeDir,
], {
  stdio: "inherit",
});

for (const entry of readdirSync(worktreeDir)) {
  if (entry === ".git") continue;
  rmSync(join(worktreeDir, entry), { recursive: true, force: true });
}

cpSync(distDir, worktreeDir, { recursive: true });
writeFileSync(join(worktreeDir, ".nojekyll"), "");

execFileSync("git", ["add", "."], { cwd: worktreeDir, stdio: "inherit" });

try {
  execFileSync("git", ["diff", "--cached", "--quiet"], { cwd: worktreeDir });
  console.log("No GitHub Pages changes to deploy.");
  process.exit(0);
} catch {}

execFileSync("git", ["config", "user.email", "codex@openai.local"], { cwd: worktreeDir });
execFileSync("git", ["config", "user.name", "Codex"], { cwd: worktreeDir });
execFileSync("git", ["commit", "-m", "Deploy Chelly Expo web preview"], { cwd: worktreeDir, stdio: "inherit" });
execFileSync("git", ["push", "origin", "gh-pages"], { cwd: worktreeDir, stdio: "inherit" });

console.log("Deployed to https://ryoitabashi.github.io/Chelly/");
