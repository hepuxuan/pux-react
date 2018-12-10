/**
 * Module dependencies.
 */

import Debug = require("debug");
import app from "./app";
import cluster = require("cluster");
import http = require("http");

/**
 * Get port from environment and store in Express.
 */
const debug = Debug("react-express:server");
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */

function start() {
  /**
   * Event listener for HTTP server "listening" event.
   */
  const server = http.createServer(app);
  function onListening() {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  }

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
}

function startCluster() {
  if (cluster.isMaster) {
    const cpuCount = require("os").cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }
  } else {
    console.log("starting a new process");
    start();
  }

  cluster.on("exit", function(worker) {
    // Replace the dead worker,
    // we're not sentimental
    console.log("Worker %d died :(", worker.id);
    cluster.fork();
  });
}

if (process.env.NODE_ENV === "production") {
  startCluster();
} else {
  start();
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
