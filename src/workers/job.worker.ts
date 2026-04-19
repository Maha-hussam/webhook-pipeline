import { Worker } from 'bullmq';
import { redisConnection } from '../queue/redis';
import prisma from '../plugins/prisma';
import { processPipeline } from '../services/processor.service';
import { deliverToSubscriber } from '../services/delivery.service';

const worker = new Worker(
    'jobsQueue',
    async (job) => {
        const { jobId } = job.data;

        console.log('Processing job:', jobId);

        try {
            const dbJob = await prisma.job.findUnique({
                where: { id: jobId },
            });

            if (!dbJob) throw new Error('Job not found');

            await prisma.job.update({
                where: { id: jobId },
                data: { status: 'PROCESSING' },
            });

            const pipeline = await prisma.pipeline.findUnique({
                where: { id: dbJob.pipelineId },
                include: { subscribers: true },
            });

            if (!pipeline) {
                await prisma.job.update({
                    where: { id: jobId },
                    data: { status: 'FAILED' },
                });
                return;
            }

            const pipelineConfig = pipeline as any;

            const result = await processPipeline(pipelineConfig, dbJob.payload);

            await prisma.job.update({
                where: { id: jobId },
                data: {
                    status: 'COMPLETED',
                    result,
                },
            });

            const deliveryPayload = {
                jobId: dbJob.id,
                pipelineId: pipeline.id,
                result,
                timestamp: new Date().toISOString(),
            };

            console.log(`Starting delivery for ${pipeline.subscribers.length} subscribers...`);

            await Promise.all(
                pipeline.subscribers.map((sub) => {
                    return deliverToSubscriber(sub, deliveryPayload, dbJob.id);
                })
            );

        } catch (error: any) {
            console.error('Job failed:', error);

            await prisma.job.update({
                where: { id: jobId },
                data: { status: 'FAILED' },
            });
        }
    },
    {
        connection: redisConnection,
        lockDuration: 60000,
    }
);

worker.on('completed', (job) => {
    console.log(`Job ${job.id} fully completed and delivered.`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed in queue`, err);
});

export default worker;