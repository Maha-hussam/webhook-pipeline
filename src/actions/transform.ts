export const transformAction = async (payload: any, config: any) => {
    let result = { ...payload };

    if (config.remove) {
        for (const field of config.remove) {
            delete result[field];
        }
    }

    if (config.map) {
        for (const key in config.map) {
            result[config.map[key]] = result[key];
            delete result[key];
        }
    }

    return result;
};