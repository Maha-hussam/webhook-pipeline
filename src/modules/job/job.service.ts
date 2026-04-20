import prisma from '../../plugins/prisma';
import { jobsQueue } from '../../queue/jobs.queue';
import { AppError } from '../../utils/error';

export const createJob = async (pipelineId: string, payload: any) => {
    const job = await prisma.job.create({
        data: {
            pipelineId,
            payload,
        },
    });

    await jobsQueue.add('process-job', {
        jobId: job.id,
    });

    return job;
};

export const getPendingJobs = async () => {
    return prisma.job.findMany({
        where: { status: 'PENDING' },
        take: 10,
        orderBy: { createdAt: 'asc' },
    });
};

export const updateJobStatus = async (id: string, status: any) => {
    return prisma.job.update({
        where: { id },
        data: { status },
    });
};

export const getJobByIdWithAttempts = async (id: string) => {
    const job = await prisma.job.findUnique({
        where: { id },
        include: {
            deliveryAttempts: {
                orderBy: { createdAt: 'asc' },
                include: {
                    subscriber: {
                        select: { id: true, url: true },
                    },
                },
            },
        },
    });

    if (!job) {
        throw new AppError('Job not found', 404);
    }

    return {
        id: job.id,
        status: job.status,
        payload: job.payload,
        result: job.result,
        delivery_attempts_count: job.deliveryAttempts.length,
        deliveryAttempts: job.deliveryAttempts.map((a) => ({
            id: a.id,
            attemptNumber: a.attemptNumber,
            status: a.status,
            responseStatus: a.responseStatus,
            responseBody: a.responseBody,
            errorMessage: a.errorMessage,
            subscriberUrl: a.subscriber.url,
            createdAt: a.createdAt,
        })),
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
    };
};

export const getJobsByPipeline = async (pipelineId: string) => {
    const jobs = await prisma.job.findMany({
        where: { pipelineId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { deliveryAttempts: true },
            },
        },
    });

    return jobs.map((job) => ({
        id: job.id,
        status: job.status,
        payload: job.payload,
        result: job.result,
        delivery_attempts_count: job._count.deliveryAttempts,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
    }));
};