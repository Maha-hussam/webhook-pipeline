import Fastify from 'fastify';
import { logger } from './config/logger';
import { healthRoutes } from './modules/health/health.route';
import { pipelineRoutes } from './modules/pipeline/pipeline.route';
import { webhookRoutes } from './modules/webhook/webhook.route';
import subscriberRoutes from './modules/subscriber/subscriber.routes';
import { jobRoutes } from './modules/job/job.route';

export const buildApp = () => {
    const app = Fastify({ logger: true });

    app.register(healthRoutes);
    app.register(pipelineRoutes);
    app.register(webhookRoutes);
    app.register(subscriberRoutes);
    app.register(jobRoutes);

    return app;
};