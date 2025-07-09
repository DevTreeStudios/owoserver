const WebSocket = require('ws');
const express = require('express');
const axios = require('axios');
const app = express();

const wss = new WebSocket.Server({ port: 8080 });

const PORT = process.env.PORT || 3000;

let pcSocket = null;

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  pcSocket = ws;

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    pcSocket = null;
  });
});

app.get('/', async (req, res) => {
  let message = req.body.message;
  
  if (pcSocket && pcSocket.readyState === WebSocket.OPEN) {
    pcSocket.send(message);
    res.send('Message sent to PC!');
  } else {
    res.status(500).send('PC is not connected.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
