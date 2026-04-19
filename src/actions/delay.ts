export const delayAction = async (payload: any, config: any) => {
    const seconds = config.delaySeconds || 1;

    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

    return payload;
};