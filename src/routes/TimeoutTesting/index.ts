import { Router } from "express";
import randomWords from "random-words";
import sleep from "sleep-promise";
const routes = Router();

routes.all("/:amount?", async (req, res, next) => {
    const requestId = randomWords({ exactly: 2, join: '-' })
    const amount: number = req.params?.amount ? Number(req.params.amount) : 1000;
    console.log('request start: ', requestId);
    console.time(requestId);
    await sleep(amount);
    console.log('request end: ', requestId);
    console.timeEnd(requestId)
    res.locals.response = { hello: "worlds", amount, requestId };
    next();

});

export default routes;

