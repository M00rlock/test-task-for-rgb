import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

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

function hasRealDocker() {
  try {
    const output = execFileSync("docker", ["--version"], {
      encoding: "utf8"
    }).trim();
    return output.includes("Docker version");
  } catch {
    return false;
  }
}

function run(command, args) {
  execFileSync(command, args, {
    stdio: "inherit"
  });
}

function isLaunchAgentLoaded(label) {
  try {
    execFileSync("launchctl", ["print", `gui/${process.getuid()}/${label}`], {
      stdio: "ignore"
    });
    return true;
  } catch {
    return false;
  }
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
    // No process is listening on this port.
  }
}

if (process.platform === "darwin") {
  const label = "homebrew.mxcl.postgresql@16";
  const plist = path.join(homedir(), "Library/LaunchAgents/homebrew.mxcl.postgresql@16.plist");

  if (existsSync(plist)) {
    try {
      if (isLaunchAgentLoaded(label)) {
        run("launchctl", ["bootout", `gui/${process.getuid()}`, plist]);
      }
    } catch {
      // Ignore launchctl errors and fall back to killing the listener below.
    }
  }
} else if (hasRealDocker()) {
  run("docker", ["compose", "down"]);
} else if (commandExists("brew")) {
  run("brew", ["services", "stop", "postgresql@16"]);
} else {
  console.log("No supported PostgreSQL runtime found to stop.");
}

stopPort(5432);
