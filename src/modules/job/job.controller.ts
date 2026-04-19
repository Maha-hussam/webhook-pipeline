import * as jobService from './job.service';

export const getJobHandler = async (req: any, reply: any) => {
    const { id } = req.params;

    const job = await jobService.getJobByIdWithAttempts(id);

    return reply.send(job);
};

export const getJobsHandler = async (req: any, reply: any) => {
    const { pipeline_id } = req.query;

    if (!pipeline_id) {
        return reply.status(400).send({
            error: 'pipeline_id query param is required',
        });
    }

    const jobs = await jobService.getJobsByPipeline(pipeline_id);

    return reply.send(jobs);
};