const WebSocket = require('ws');

const PORT = 10000; // Or any other port you choose
const wss = new WebSocket.Server({ port: PORT });

let players = []; // Array to store connected players

wss.on('connection', ws => {
    console.log('Client connected');

    // Generate a unique ID for the new player
    const playerId = generateUniqueId();

    // Add the new player to the list of players
    players.push({
        id: playerId,
        socket: ws,
        x: 0, // Initial X coordinate
        y: 0, // Initial Y coordinate
        gameId: null // Initially not joined to any game
    });

    // Send the player ID to the client
    ws.send(JSON.stringify({ type: 'playerId', playerId }));

    // Listen for messages from the client
    ws.on('message', message => {
        console.log('Message from client:', message.toString());

        // Parse the received JSON message
        const data = JSON.parse(message);
        console.log(data);
        ws.send(JSON.stringify(data));

        // Handle different message types
        switch (data.type) {
            case 'joinGame':
                // Update the player's game ID
                const gameId = data.gameId;
                const player = players.find(p => p.id === playerId);
                if (player) {
                    player.gameId = gameId;
                    console.log(`Player ${playerId} joined game ${gameId}`);
                }
                break;
            case 'updateLocation':
                // Update the player's location
                const { x, y } = data.location;
                const playerToUpdate = players.find(p => p.id === playerId);
                if (playerToUpdate) {
                    playerToUpdate.x = x;
                    playerToUpdate.y = y;
                    console.log(`Player ${playerId} updated location to (${x}, ${y})`);
                }
                break;
            case 'ping':
                ws.send('PONG!!!!! MUAHAHAHHAHAHA: ', data.message)
            default:
                console.log('Unknown message type:', data.type);
        }
    });

    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');

        // Remove the disconnected player from the list of players
        players = players.filter(player => player.id !== playerId);
    });
});

// Function to generate a unique player ID
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

console.log(`Server running on port ${PORT}`);
