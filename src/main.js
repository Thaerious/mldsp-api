import Server from "./Server.js";

(async () => {
    const server = new Server();
    await server.init();
    server.start(process.env.PORT);
})()
