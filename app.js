const express = require("express");
const cors = require("cors");
const randomWords = require('random-words');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());


app.get("/", (req, res) => {
    return res.send({ hello: "worlds" });
});

app.all("/timeout/:amount?", (req, res) => {
    const { amount = 1000 } = req.params;
    console.time();
    console.log("start")
    setTimeout(() => {
        console.timeEnd()
        console.log("end")
        return res.send({ hello: "worlds", amount });
    }, amount)

});



app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));