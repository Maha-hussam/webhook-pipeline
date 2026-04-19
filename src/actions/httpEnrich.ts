export const httpEnrichAction = async (payload: any, config: any) => {
    try {
        const url = new URL(config.url);

        if (config.queryParam && payload[config.queryParam]) {
            url.searchParams.append(config.queryParam, payload[config.queryParam]);
        }

        const response = await fetch(url.toString(), {
            method: config.method || 'GET',
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error('HTTP request failed');
        }

        const data = await response.json();

        return {
            ...payload,
            enriched: data,
        };
    } catch (error) {
        console.error('HTTP Enrich failed:', error);
        throw error;
    }
};