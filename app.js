const express = require("express");
const cors = require("cors");
const randomWords = require('random-words');
const sleep = require("sleep-promise");
// import * as Sentry from "@sentry/node" - for TS 
const Sentry = require("@sentry/node");
const { config } = require("dotenv");
config();
const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,
    environment: "dev",
    tracesSampleRate: 1.0,
});
const app = express();
const PORT = process.env.PORT || 8080;

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(cors());
app.use(express.static("public"));
app.use(express.json());


// Request middleware - Set User/Request Context to Sentry

app.use((req, res, next) => {
    const email = "cjameshill@gmail.com";
    Sentry.setUser({ email });
    next();

})

app.get("/", (req, res) => {
    return res.send({ hello: "world" });
});

app.all("/error", (req, res) => {
    try {
        foo();

    } catch (e) {
        Sentry.captureException(e);
        return res.status(400).send({ error: e.message });

    }
});

app.all("/error-without-capture", (req, res, next) => {
    try {

        bar();

    } catch (e) {
        throw e;

    }
});

// TIMEOUT TESTING

app.all("/timeout/:amount?", async (req, res) => {
    const requestId = randomWords({ exactly: 2, join: '-' })
    const { amount = 1000 } = req.params;
    console.log('request start: ', requestId);
    console.time(requestId);
    await sleep(amount);
    console.log('request end: ', requestId);
    console.timeEnd(requestId)
    return res.send({ hello: "worlds", amount, requestId });

});

app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use((err, req, res, next) => {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));