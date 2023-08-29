import { Router } from "express";
import randomWords from "random-words";
import { createUser, saveUser, updateUser } from "../../models/users"

const routes = Router();

routes.all("/create/:name", async (req, res, next) => {
    const name = req.params.name;
    const response = await createUser({ name })
    console.log('res: ', response);
    res.locals.response = response;
    next();
});

routes.all("/:id/update", async (req, res, next) => {
    const id = req.params.id;
    const user = { _id: id, updatedAt: new Date().toISOString() }
    const response = await updateUser(user)
    console.log('res: ', response);
    res.locals.response = user;
    next();
});

routes.all("/:id/save", async (req, res, next) => {
    const id = req.params.id;
    const user = { _id: id, updatedAt: new Date().toISOString() }
    const response = await saveUser(user)
    console.log('res: ', response);
    res.locals.response = user;
    next();
});

export default routes;

