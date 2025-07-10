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
  console.log('✅ WebSocket client connected');
  pcSocket = ws;

  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('close', () => {
    console.log('❌ WebSocket client disconnected');
    pcSocket = null;
    clearInterval(ws.keepAliveInterval);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  ws.keepAliveInterval = setInterval(() => {
    if (!ws.isAlive) {
      console.log('❌ No pong received, terminating socket');
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  }, 10000);
});

app.post('/send', async (req, res) => {
  try {
    let message = req.body.message;
    
    if (pcSocket && pcSocket.readyState === WebSocket.OPEN) {
      console.log('Sending Message to PC...');
      pcSocket.send(message);
      res.send('Message sent to PC!');
    } else {
      console.log('PC not connected.');
      res.status(500).send('PC is not connected.');
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    res.send(`Error: ${err}`);
  }
});

app.get('/', (req, res) => {
  res.send('Web server running.');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
