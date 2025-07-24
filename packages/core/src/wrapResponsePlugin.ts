// packages/core/src/wrapResponse.ts  (or envelope.ts – any name is fine)
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// 1️⃣ async implementation
const wrapResponseAsync: FastifyPluginAsync = async (app) => {
  app.addHook('onSend', async (req, _reply, payload: any) => {
    if (payload?.status === 'ok' || payload?.status === 'error') return payload;
    const meta = { trace_id: req.headers['traceparent'] ?? undefined };
    return { status: 'ok', data: payload ?? null, meta };
  });
};

// 2️⃣ export the *wrapped* plugin
export const wrapResponse = fp(wrapResponseAsync, { name: 'wrapResponse' });
