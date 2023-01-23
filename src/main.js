import Server from "./Server.js";
import ParseArgs from "@thaerious/parseargs";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    const server = new Server();
    await server.init();
    server.start(process.env.PORT);
})()
