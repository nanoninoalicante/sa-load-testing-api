const express = require("express");
const cors = require("cors");
const randomWords = require('random-words');
const sleep = require("sleep-promise");
const axios = require('axios');
const Sentry = require("@sentry/node");


Sentry.init({
  dsn: "https://c84f014ad4fb411da4866f950a6a6f19@o1400548.ingest.sentry.io/6730158",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
const app = express();
const PORT = process.env.PORT || 8080;

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(cors());
app.use(express.static("public"));
app.use(express.json());


app.get("/", (req, res) => {
    return res.send({ hello: "worlds" });
});


app.all("/error", (req, res) => {
    try {
        foo();
        
    } catch(e) {
        Sentry.captureException(e);
        return res.status(400).send({ error: e.message });
        
    }
});

app.all("/error-without-capture", (req, res) => {
    try {
        bar();
        
    } catch(e) {
        return res.status(400).send({ error: e.message });
        
    }
});
app.all("/timeout/:amount?", async (req, res) => {
    const requestId = randomWords({ exactly: 2, join: '-' })
    const { amount = 1000 } = req.params;
    // await axios("https://webhook.site/40f69535-8154-417e-8c6c-b801c4d95b83?status=start&request=" + requestId);
    console.log('request start: ', requestId);
    console.time(requestId);
    await sleep(amount);
    // await axios("https://webhook.site/40f69535-8154-417e-8c6c-b801c4d95b83?status=end&request=" + requestId);

    console.log('request end: ', requestId);
    console.timeEnd(requestId)
    return res.send({ hello: "worlds", amount, requestId });

});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());



app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));