import net from "node:net";

const [host, portInput, timeoutInput] = process.argv.slice(2);

if (!host || !portInput) {
  console.error("Usage: node scripts/wait-for-port.mjs <host> <port> [timeoutMs]");
  process.exit(1);
}

const port = Number(portInput);
const timeoutMs = Number(timeoutInput ?? 60000);
const deadline = Date.now() + timeoutMs;

function tryConnect() {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });

    socket.once("connect", () => {
      socket.end();
      resolve();
    });

    socket.once("error", (error) => {
      socket.destroy();
      reject(error);
    });
  });
}

while (Date.now() < deadline) {
  try {
    await tryConnect();
    process.exit(0);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

console.error(`Timed out waiting for ${host}:${port}`);
process.exit(1);

