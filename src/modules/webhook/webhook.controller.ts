import prisma from '../../plugins/prisma';
import { AppError } from '../../utils/error';
import { createJob } from '../job/job.service';

export const handleWebhook = async (req: any, reply: any) => {
    const { pipelineId } = req.params;

    const pipeline = await prisma.pipeline.findUnique({
        where: { id: pipelineId },
    });

    if (!pipeline) {
        throw new AppError('Pipeline not found', 404);
    }

    const payload = req.body;

    const job = await createJob(pipelineId, payload);

    req.log.info({
        message: 'Job queued',
        jobId: job.id,
    });

    return reply.code(202).send({
        message: 'Webhook accepted',
        jobId: job.id,
    });
}