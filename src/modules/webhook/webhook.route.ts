import { FastifyInstance } from 'fastify';
import { handleWebhook } from './webhook.controller';

export async function webhookRoutes(app: FastifyInstance) {
    app.post('/webhook/:pipelineId', handleWebhook);
}