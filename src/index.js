import Server from "./Server.js";
const server = new Server();
await server.init();
server.start();