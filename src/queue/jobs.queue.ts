import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const jobsQueue = new Queue('jobsQueue', {
    connection: redisConnection,
});