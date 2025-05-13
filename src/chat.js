const Hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const readline = require("readline");
const { keyPair } = require("hypercore-crypto");

async function main() {
  // Persistent keypair
  const myKeys = keyPair();
  const myId = myKeys.publicKey.toString("hex").slice(0, 8);
  console.log("🔑 My ID:", myId);

  // Unique topic (shared room name --> hash)
  const topic = crypto.createHash("sha256").update("andyrum-chat").digest();

  const swarm = new Hyperswarm({
    keyPair: myKeys,
  });

  // Keep track of sockets
  const sockets = new Set();

  // Stdin for typing messages
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
    terminal: true,
  });

  rl.pause();
  rl.on("SIGINT", () => {
    console.log("\n🔴 Exiting...");
    process.exit(0);
  });

  // Join the topic
  await swarm
    .join(topic, {
      lookup: true,
      announce: true,
    })
    .flushed();

  console.log("🔗 Joined topic:", topic.toString("hex").slice(0, 8));

  swarm.on("listening", () => {
    console.log("👂 Swarm is listening for connections...");
  });

  swarm.on("connection", (socket, info) => {
    const peerId = info.publicKey.toString("hex").slice(0, 8);
    console.log(`🟢 Connected to peer ${peerId}`);

    if (rl.paused) {
      rl.resume();
      rl.prompt();
      console.log("💬 Type your message:");
    }

    // Add peer to the set of sockets
    sockets.add(socket);

    // Handle socket close
    socket.on("close", () => {
      sockets.delete(socket);
      console.log(`🔴 Disconnected from peer ${peerId}`);

      if (sockets.size === 0) {
        rl.pause();
        console.log("💬 No peers connected. Waiting for connections...");
      }
    });

    // Data from peer
    socket.on("data", (data) => {
      console.log(`🔷 [${peerId}]: ${data.toString().trim()}`);
    });
  });

  // Read input and send it to the peers
  rl.on("line", (line) => {
    for (const socket of sockets) {
      socket.write(line);
    }
    rl.prompt();
  });
}

main();
