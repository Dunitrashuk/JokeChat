const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const axios = require("axios");

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({server});

wss.on("connection",(ws) => {
    ws.on("message", (data) => {
        wss.clients.forEach(client => {
            if(client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        })
    })
});
server.listen(port, () => {
    console.log("Server is listening on port 6969!");
})
