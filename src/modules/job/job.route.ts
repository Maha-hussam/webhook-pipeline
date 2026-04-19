import { FastifyInstance } from 'fastify';
import * as jobService from './job.service';
export async function jobRoutes(app: FastifyInstance) {
    app.get('/api/jobs/:id', async (request: any, reply: any) => {
        try {
            const { id } = request.params;
            const job = await jobService.getJobByIdWithAttempts(id);
            return reply.send(job);
        } catch (error: any) {
            return reply.status(error.statusCode || 500).send({
                error: error.message
            });
        }
    });

    app.get('/api/jobs', async (request: any, reply: any) => {
        try {
            const { pipeline_id } = request.query;

            if (!pipeline_id) {
                return reply.status(400).send({
                    error: 'pipeline_id query param is required',
                });
            }
            const jobs = await jobService.getJobsByPipeline(pipeline_id);
            return reply.send(jobs);
        } catch (error: any) {
            return reply.status(error.statusCode || 500).send({
                error: error.message
            });
        }
    });
}