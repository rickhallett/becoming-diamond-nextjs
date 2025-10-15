const { spawn } = require("child_process");
const readline = require("readline");

let devServer;

function startServer() {
  console.log("Starting Next.js dev server with Bun...");
  devServer = spawn("bun", ["run", "dev"], {
    stdio: "inherit",
  });

  devServer.on("close", (code) => {
    console.log(`Dev server exited with code ${code}`);
  });
}

function restartServer() {
  if (devServer) {
    console.log("Restarting server...");
    devServer.kill();
  }
  setTimeout(startServer, 1000);
}

// Set up readline interface for keypress detection
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Press "r" + Enter to restart the server, or "q" + Enter to quit');

rl.on("line", (input) => {
  const command = input.trim().toLowerCase();

  if (command === "r") {
    restartServer();
  } else if (command === "q") {
    console.log("Shutting down...");
    if (devServer) {
      devServer.kill();
    }
    process.exit(0);
  }
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\nShutting down...");
  if (devServer) {
    devServer.kill();
  }
  process.exit(0);
});

// Start the server initially
startServer();
