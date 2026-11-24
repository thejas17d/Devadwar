/**
 * Build the static site and publish ./out to the `gh-pages` branch of `origin`.
 * Uses git plumbing with a temporary index, so your working tree and current
 * branch are never touched. Requires push access to origin.
 *
 *   npm run deploy:pages
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const sh = (cmd, env = {}) => execSync(cmd, { stdio: ["ignore", "pipe", "inherit"], env: { ...process.env, ...env } }).toString().trim();

if (!process.argv.includes("--skip-build")) execSync("node scripts/build-pages.mjs", { stdio: "inherit" });
if (!fs.existsSync("out/index.html")) throw new Error("out/index.html missing — build failed?");

const index = path.join(os.tmpdir(), `devadwar-pages-index-${Date.now()}`);
const env = { GIT_INDEX_FILE: index };
try {
  sh("git --work-tree=out add -A --force .", env);
  const tree = sh("git write-tree", env);
  const src = sh("git rev-parse --short HEAD");
  let parent = "";
  try {
    parent = sh("git rev-parse --verify --quiet refs/remotes/origin/gh-pages");
  } catch {}
  const commit = sh(`git commit-tree ${tree} ${parent ? `-p ${parent}` : ""} -m "Deploy static site from ${src}"`);
  console.log(`Publishing ${commit.slice(0, 7)} (built from ${src}) to origin/gh-pages …`);
  execSync(`git push origin ${commit}:refs/heads/gh-pages --force`, { stdio: "inherit" });
  execSync("git fetch -q origin gh-pages", { stdio: "inherit" });
} finally {
  fs.rmSync(index, { force: true });
}
console.log("Done. GitHub Pages will publish within a minute or two.");
