const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const app = express();

app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const PORT = 3000;

let pcSocket = null;

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  pcSocket = ws;

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    pcSocket = null;
  });
});

app.get('/send', async (req, res) => {
  try {
    let message = req.body.message;
    
    if (pcSocket && pcSocket.readyState === WebSocket.OPEN) {
      pcSocket.send(message);
      res.send('Message sent to PC!');
    } else {
      res.status(500).send('PC is not connected.');
    }
  } catch(err) {
    console.log(`Error: ${err}`);
  }

  res.send('Message Received!');
});

app.get('/', (req, res) => {
  res.send('Web server running.');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
