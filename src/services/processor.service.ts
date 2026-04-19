import { transformAction } from '../actions/transform';
import { delayAction } from '../actions/delay';
import { httpEnrichAction } from '../actions/httpEnrich';

export const processPipeline = async (pipeline: any, payload: any) => {
    let currentPayload = payload;

    const actions = pipeline.actions || [];

    console.log('actions count:', actions.length);
    console.log('actions:', JSON.stringify(actions));


    for (const action of actions) {
        switch (action.type) {
            case 'transform':
                currentPayload = await transformAction(currentPayload, action.config);
                break;

            case 'delay':
                currentPayload = await delayAction(currentPayload, action.config);
                break;

            case 'http_enrich':
                currentPayload = await httpEnrichAction(currentPayload, action.config);
                break;

            default:
                console.warn('Unknown action:', action.type);
        }
    }

    return currentPayload;
};