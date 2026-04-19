import { FastifyInstance } from 'fastify';
import { createSubscriber, getSubscribersByPipeline } from './subscriber.service';

export default async function subscriberRoutes(app: FastifyInstance) {
    app.get('/pipelines/:pipelineId/subscribers', async (request, reply) => {
        const { pipelineId } = request.params as { pipelineId: string };
        const subscribers = await getSubscribersByPipeline(pipelineId);
        return subscribers;
    });

    app.post('/pipelines/:pipelineId/subscribers', async (request, reply) => {
        const { pipelineId } = request.params as { pipelineId: string };
        const { url } = request.body as { url: string };
        const subscriber = await createSubscriber(pipelineId, url);
        return reply.code(201).send(subscriber);
    });
}