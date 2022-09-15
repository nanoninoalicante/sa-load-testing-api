import { Router } from "express";
import TimeoutTestingRoutes from "./TimeoutTesting";
import UsersRoutes from "./Users";

const routes = Router();
routes.get("/debug-sentry", (req, res, next) => {
      throw new Error("My first Sentry error!");
});

routes.get("/", (req, res, next) => {
      // render the index template
      res.locals.response = {
            hello: "worlds",
      };
      next();
});

routes.use("/timeout", TimeoutTestingRoutes)
routes.use("/users", UsersRoutes)

export default routes;
