// ws-cart.ts
import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { WebSocketServer, WebSocket } from 'ws';

type UserSocket = WebSocket;
const userSockets = new Map<string, Set<UserSocket>>();

export async function publishCartUpdate(app: FastifyInstance, userId: string, payload: unknown) {
  const set = userSockets.get(userId);
  if (!set || set.size === 0) return;

  const message = JSON.stringify({ type: 'cart:update', data: payload });
  for (const s of set) {
    try {
      if (s.readyState === WebSocket.OPEN) s.send(message);
    } catch (e) {
      app.log.warn(e);
    }
  }
}

export default fp(async (app) => {
  // One WSS for the process; we’ll attach it to the Node server via the upgrade event.
  const wss = new WebSocketServer({ noServer: true });

  // Handle HTTP -> WS upgrade only for /ws/cart
  app.server.on('upgrade', (req, socket, head) => {
    try {
      const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
      if (url.pathname !== '/ws/cart') {
        socket.destroy(); // not our endpoint
        return;
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } catch {
      socket.destroy();
    }
  });

  // Optional: simple heartbeat to clean up dead connections
  const heartbeat = (ws: WebSocket & { isAlive?: boolean }) => {
    ws.isAlive = true;
  };
  wss.on('connection', async (ws: WebSocket & { isAlive?: boolean }, req) => {
    try {
      const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

      // Accept token via query (?token=) or Sec-WebSocket-Protocol (first value)
      const fromHeader = (req.headers['sec-websocket-protocol'] as string | undefined)
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean)[0];

      const token = url.searchParams.get('token') || fromHeader;
      if (!token) {
        ws.close();
        return;
      }

      // Uses fastify-jwt you've already registered (app.jwt.verify)
      const decoded = await (app as any).jwt.verify(token);
      const userId: string | undefined = decoded?.sub || decoded?.userId;
      if (!userId) {
        ws.close();
        return;
      }

      // Track sockets per user
      let set = userSockets.get(userId);
      if (!set) {
        set = new Set();
        userSockets.set(userId, set);
      }
      set.add(ws);

      ws.isAlive = true;
      ws.on('pong', () => heartbeat(ws));
      ws.on('close', () => {
        set?.delete(ws);
        if (set && set.size === 0) userSockets.delete(userId);
      });
      ws.on('error', (err) => app.log.warn({ err }, 'ws error'));

      // Acknowledge
      ws.send(JSON.stringify({ type: 'connected', userId }));
    } catch (e) {
      app.log.warn(e);
      try {
        ws.close();
      } catch {}
    }
  });

  // Periodic ping to drop half-open connections (optional)
  const interval = setInterval(() => {
    for (const ws of wss.clients) {
      const sock = ws as WebSocket & { isAlive?: boolean };
      if (sock.isAlive === false) {
        try {
          sock.terminate();
        } catch {}
        continue;
      }
      sock.isAlive = false;
      try {
        sock.ping();
      } catch {}
    }
  }, 30_000);

  // Expose your publisher and close hooks
  app.decorate('publishCartUpdate', async (userId: string, payload: unknown) =>
    publishCartUpdate(app, userId, payload),
  );

  app.addHook('onClose', (instance, done) => {
    clearInterval(interval);
    for (const ws of wss.clients) {
      try {
        ws.close();
      } catch {}
    }
    // Ensure ws server finishes closing before we signal Fastify we're done
    wss.close(() => done());
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    publishCartUpdate(userId: string, payload: unknown): Promise<void>;
  }
}
