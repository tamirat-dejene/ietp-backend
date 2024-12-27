import { WebSocketServer } from "ws";
let connectedClients = [];
export const initializeWebSocketServer = (server) => {
    const io = new WebSocketServer({ server });
    io.on("connection", (socket) => {
        console.log("New WebSocket connection established");
        connectedClients.push(socket);
        socket.on("close", () => {
            connectedClients = connectedClients.filter((client) => client !== socket);
            console.log("---------WebSocket connection closed");
        });
    });
    return io;
};
export const broadcast = (data) => {
    connectedClients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};
