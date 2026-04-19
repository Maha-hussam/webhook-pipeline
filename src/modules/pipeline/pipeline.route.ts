import { FastifyInstance } from 'fastify';
import * as controller from './pipeline.controller';
import {
    createPipelineSchema,
    updatePipelineSchema,
} from './pipeline.schema';

export async function pipelineRoutes(app: FastifyInstance) {
    app.post('/pipelines', { schema: createPipelineSchema }, controller.createPipelineHandler);

    app.get('/pipelines', controller.getPipelinesHandler);

    app.get('/pipelines/:id', controller.getPipelineHandler);

    app.put('/pipelines/:id', { schema: updatePipelineSchema }, controller.updatePipelineHandler);

    app.delete('/pipelines/:id', controller.deletePipelineHandler);
}