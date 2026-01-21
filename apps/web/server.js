// Simple token server for LiveKit development
// Run with: node server.js
import http from 'http';
import { AccessToken } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret12345678901234567890123456';
const PORT = 3001;

async function createToken(identity, roomName) {
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity,
        ttl: '10h',
    });

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
    });

    return await at.toJwt();
}

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === '/token') {
        const identity = url.searchParams.get('identity') || `user-${Date.now()}`;
        const room = url.searchParams.get('room') || 'default-room';

        try {
            const token = await createToken(identity, room);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token, identity, room }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    } else if (url.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`✓ Token server running at http://localhost:${PORT}`);
    console.log(`  GET /token?identity=NAME&room=ROOM`);
    console.log(`  LiveKit URL: ws://localhost:7880`);
});
