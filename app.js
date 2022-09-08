const express = require("express");
const cors = require("cors");
const randomWords = require('random-words');
const sleep = require("sleep-promise");
const Sentry = require("@sentry/node");


Sentry.init({
  dsn: "https://c84f014ad4fb411da4866f950a6a6f19@o1400548.ingest.sentry.io/6730158",

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
    Sentry.setUser({email});
    next();
    
})

app.get("/", (req, res) => {
    return res.send({ hello: "world" });
});

app.all("/error", (req, res) => {
    try {
        foo();
        
    } catch(e) {
        Sentry.captureException(e);
        return res.status(400).send({ error: e.message });
        
    }
});

app.all("/error-without-capture", (req, res, next) => {
    try {
    
        bar();
        
    } catch(e) {
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
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));