import * as service from './pipeline.service';

export const createPipelineHandler = async (req: any, reply: any) => {
    const pipeline = await service.createPipeline(req.body);
    return reply.code(201).send(pipeline);
};

export const getPipelinesHandler = async () => {
    return service.getPipelines();
};

export const getPipelineHandler = async (req: any) => {
    return service.getPipelineById(req.params.id);
};

export const updatePipelineHandler = async (req: any) => {
    return service.updatePipeline(req.params.id, req.body);
};

export const deletePipelineHandler = async (req: any) => {
    return service.deletePipeline(req.params.id);
};