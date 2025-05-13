const Hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const readline = require("readline");

// Unique topic (shared room name --> hash)
const topic = crypto.createHash("sha256").update("my-chat-room").digest();

const swarm = new Hyperswarm();

// Stdin for typing messages
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
  terminal: true,
});

// Join the topic
swarm.join(topic, {
  lookup: true,
  announce: true,
});

swarm.on("connection", (socket, info) => {
  console.log("🟢 New peer connected:", info);

  // Data from peer
  socket.on("data", (data) => {
    console.log("🔷 Peer:", data.toString());
  });

  // Read input and send it to the peer
  rl.on("line", (line) => {
    socket.write(line);
  });
});
