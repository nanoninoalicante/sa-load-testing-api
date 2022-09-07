const express = require("express");
const cors = require("cors");
const randomWords = require('random-words');
const sleep = require("sleep-promise");
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
    console.log('request start: ', requestId);
    console.time("start");
    await sleep(amount);
        
    console.log('request end: ', requestId);
    console.timeEnd("start")
    return res.send({ hello: "worlds", amount });

});



app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));