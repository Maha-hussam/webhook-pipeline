import prisma from '../plugins/prisma';

const RETRY_DELAYS = [0, 1000, 5000, 30000];

export const deliverToSubscriber = async (
    subscriber: any,
    payload: any,
    jobId: string
) => {
    for (let i = 0; i < RETRY_DELAYS.length; i++) {
        const attemptNumber = i + 1;
        const delay = RETRY_DELAYS[i];

        if (delay > 0) {
            await new Promise((res) => setTimeout(res, delay));
        }

        try {
            const response = await fetch(subscriber.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(5000),
            });

            const responseBody = await response.text();

            if (response.status >= 400 && response.status < 500) {
                await prisma.deliveryAttempt.create({
                    data: {
                        jobId,
                        subscriberId: subscriber.id,
                        attemptNumber,
                        status: 'FAILED',
                        responseStatus: response.status,
                        responseBody,
                        errorMessage: `Client Error: ${response.status} - No retry`,
                    },
                });
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${responseBody}`);
            }

            await prisma.deliveryAttempt.create({
                data: {
                    jobId,
                    subscriberId: subscriber.id,
                    attemptNumber,
                    status: 'SUCCESS',
                    responseStatus: response.status,
                    responseBody,
                },
            });
            return;

        } catch (error: any) {
            await prisma.deliveryAttempt.create({
                data: {
                    jobId,
                    subscriberId: subscriber.id,
                    attemptNumber,
                    status: 'FAILED',
                    errorMessage: error.message,
                    responseStatus: error.message.includes('HTTP') ? parseInt(error.message.split(' ')[1]) : null,
                },
            });

            console.error(`Attempt ${attemptNumber} failed: ${error.message}`);

            if (attemptNumber === RETRY_DELAYS.length) {
                console.error('All retries exhausted.');
            }
        }
    }
};