//import {env} from "./config"
import { wrapResponse } from '@mani-r16-devkit/core';
import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(wrapResponse);

  // health-check (no DB needed)
  app.get('/health', () => ({ uptime: process.uptime() }));
  return app;
}
