const express = require("express");
const cors = require("cors");
const randomWords = require('random-words');
const sleep = require("sleep-promise");
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.static("public"));
app.use(express.json());


app.get("/", (req, res) => {
    return res.send({ hello: "worlds" });
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



app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));