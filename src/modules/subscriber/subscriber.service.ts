import prisma from '../../plugins/prisma';

export const getSubscribersByPipeline = async (pipelineId: string) => {
    return prisma.subscriber.findMany({
        where: { pipelineId },
    });
};

export const createSubscriber = async (pipelineId: string, url: string) => {
    return prisma.subscriber.create({
        data: { pipelineId, url },
    });
};