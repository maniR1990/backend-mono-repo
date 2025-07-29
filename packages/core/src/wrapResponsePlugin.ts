import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const wrapResponseAsync: FastifyPluginAsync = async (app) => {
  app.addHook('onSend', async (req, _reply, payload) => {
    if (typeof payload === 'object' && payload !== null && 'status' in payload) {
      return payload;
    }

    const meta = {
      trace_id: req.headers['traceparent'] ?? undefined,
    };

    return {
      status: 'ok',
      data: payload ?? null,
      meta,
    };
  });
};

// ✅ ✅ Fix: provide full generic type explicitly
export const wrapResponse = fp<FastifyPluginAsync>(wrapResponseAsync, {
  name: 'wrapResponse',
});
