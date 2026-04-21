import { execFileSync } from "node:child_process";
import { access } from "node:fs/promises";
import net from "node:net";
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

function run(command, args, options = {}) {
  execFileSync(command, args, {
    stdio: "inherit",
    ...options
  });
}

function runPsql(psql, sql, options = {}) {
  execFileSync(psql, ["-h", "127.0.0.1", "-d", "postgres", "-v", "ON_ERROR_STOP=1"], {
    stdio: ["pipe", "inherit", "inherit"],
    input: `${sql.trim()}\n`,
    ...options
  });
}

function waitForPort(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const attempt = () => {
      const socket = net.createConnection({ host, port }, () => {
        socket.end();
        resolve();
      });

      socket.on("error", () => {
        socket.destroy();

        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${port}`));
          return;
        }

        setTimeout(attempt, 1000);
      });
    };

    attempt();
  });
}

async function ensureDockerPostgres() {
  run("docker", ["compose", "up", "-d", "postgres"]);
}

async function ensureBrewPostgres() {
  if (!commandExists("brew")) {
    throw new Error("Homebrew is required when Docker is unavailable.");
  }

  try {
    execFileSync("brew", ["list", "postgresql@16"], {
      stdio: "ignore"
    });
  } catch {
    run("brew", ["install", "postgresql@16"]);
  }

  run("brew", ["services", "start", "postgresql@16"]);

  await waitForPort("127.0.0.1", 5432, 60000);

  const brewPrefix = execFileSync("brew", ["--prefix", "postgresql@16"], {
    encoding: "utf8"
  }).trim();
  const binDir = path.join(brewPrefix, "bin");
  const psql = path.join(binDir, "psql");

  await access(psql);

  const env = {
    ...process.env,
    PGHOST: "127.0.0.1",
    PGPORT: "5432"
  };

  runPsql(
    psql,
    `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres LOGIN SUPERUSER PASSWORD 'postgres';
  ELSE
    ALTER ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';
  END IF;
END
$$;
`,
    { env }
  );

  const databaseExists = execFileSync(
    psql,
    [
      "-h",
      "127.0.0.1",
      "-d",
      "postgres",
      "-tAc",
      "SELECT 1 FROM pg_database WHERE datname = 'rgb_test_project';"
    ],
    {
      encoding: "utf8",
      env
    }
  ).trim();

  if (!databaseExists) {
    runPsql(
      psql,
      `
CREATE DATABASE rgb_test_project OWNER postgres;
`,
      { env }
    );
  }
}

if (process.platform === "darwin") {
  await ensureBrewPostgres();
} else if (hasRealDocker()) {
  await ensureDockerPostgres();
} else {
  await ensureBrewPostgres();
}
