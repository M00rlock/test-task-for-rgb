import { execFileSync } from "node:child_process";

function commandExists(command) {
  try {
    execFileSync("bash", ["-lc", `command -v ${command}`], {
      stdio: "ignore"
    });
    return true;
  } catch {
    return false;
  }
}

function run(command, args) {
  execFileSync(command, args, {
    stdio: "inherit"
  });
}

function stopPort(port) {
  try {
    const pids = execFileSync("bash", ["-lc", `lsof -tiTCP:${port} -sTCP:LISTEN`], {
      encoding: "utf8"
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    for (const pid of pids) {
      run("kill", [pid]);
    }
  } catch {
    // Nothing is listening on this port.
  }
}

stopPort(3000);
stopPort(3001);
run("node", ["scripts/stop-postgres.mjs"]);
