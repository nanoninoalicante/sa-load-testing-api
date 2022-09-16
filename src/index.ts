import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import routes from "./routes/routes";
import helmet from "helmet";
import sleep from "sleep-promise";
import {
    authMiddleware,
    errorMiddleware,
    requestMiddleware,
    responseMiddleware,
} from "./middleware/middleware";
import { main, disconnect } from "./mongoose/connect";
dotenv.config();
const app = express();
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT || "dev",
    release: process.env.COMMIT_ID || "commitid",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({
            // to trace all requests to the default router
            app,
            // alternatively, you can specify the routes you want to trace:
            router: routes,
        }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});
const PORT = process.env.PORT || 8888;
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.use(authMiddleware);
app.use(requestMiddleware);

app.use(routes);

app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

app.use(responseMiddleware);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
// (async () => {
//     try {
//         await main();
//         app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
//     } catch (error) {
//         // throw fatal error
//         app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
//     }
// })();

// start the express server
