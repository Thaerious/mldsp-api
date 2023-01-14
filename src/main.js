import Server from "./Server.js";
import ParseArgs from "@thaerious/parseargs";
import Settings from "./settings.js";

(async () => {
    const args = new ParseArgs().run();
    const port = args.flags["port"];
    const data = args.flags["data"];
    Settings.instance(data);
    const server = new Server();
    await server.init();
    server.start(port);
})()
