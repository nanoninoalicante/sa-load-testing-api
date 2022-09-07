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
    await axios("https://webhook.site/5f4f4345-74b6-4b90-9f74-28694c0bacec?request=" + requestId);
    console.log('request start: ', requestId);
    console.time(requestId);
    await sleep(amount);
    await axios("https://webhook.site/5f4f4345-74b6-4b90-9f74-28694c0bacec?request=" + requestId);

    console.log('request end: ', requestId);
    console.timeEnd(requestId)
    return res.send({ hello: "worlds", amount });

});



app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));