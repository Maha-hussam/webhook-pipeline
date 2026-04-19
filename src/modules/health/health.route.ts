import { FastifyInstance } from 'fastify';
import { healthCheck } from './health.controller';

export async function healthRoutes(app: FastifyInstance) {
    app.get('/health', async () => {
        return healthCheck();
    });
}