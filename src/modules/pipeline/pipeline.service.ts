import prisma from '../../plugins/prisma';
import { AppError } from '../../utils/error';

export const createPipeline = async (data: any) => {
    return prisma.pipeline.create({ data });
};

export const getPipelines = async () => {
    return prisma.pipeline.findMany();
};

export const getPipelineById = async (id: string) => {
    const pipeline = await prisma.pipeline.findUnique({ where: { id } });

    if (!pipeline) throw new AppError('Pipeline not found', 404);

    return pipeline;
};

export const updatePipeline = async (id: string, data: any) => {
    await getPipelineById(id);

    return prisma.pipeline.update({
        where: { id },
        data,
    });
};

export const deletePipeline = async (id: string) => {
    await getPipelineById(id);

    return prisma.pipeline.delete({ where: { id } });
};