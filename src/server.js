const WebSocket = require('ws');

const PORT = process.env.PORT || 6969; // Set port number

const wss = new WebSocket.Server({ port: PORT });

let players = []; // Array to store connected players

// Function to broadcast a message to all connected clients
function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Handle new WebSocket connections
wss.on('connection', ws => {
    console.log('New client connected');

    // Add the new player to the list of players
    players.push(ws);

    // Send a welcome message to the new player
    ws.send('Welcome to the game server! FREEK IS THE ENEMEY!!!');

    // Handle messages from the client
    ws.on('message', message => {
        
        if (message.toString() === 'ping') {
            // Respond to ping requests
            ws.send('pong');
        }

        console.log('Received message:', message);

        // Broadcast the received message to all clients
        broadcast(message);
    });

    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');

        // Remove the disconnected player from the list of players
        players = players.filter(player => player !== ws);
    });
});



console.log(`Server is running on port ${PORT}`);