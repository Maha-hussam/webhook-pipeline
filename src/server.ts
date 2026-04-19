import { buildApp } from './app';
import { env } from './config/env';

const start = async () => {
    const app = buildApp();
    try {
        await app.ready();
        console.log(app.printRoutes());

        await app.listen({
            port: Number(env.PORT),
            host: '0.0.0.0'
        });

        console.log(`Server running on port ${env.PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();