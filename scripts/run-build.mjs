import { spawnSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1";

const env = {
  ...process.env
};

if (!isVercel) {
  env.NEXT_DIST_DIR = ".next-build";
}

const result = spawnSync("next", ["build"], {
  env,
  stdio: "inherit",
  shell: true
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
