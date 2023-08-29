import { Router } from "express";
import TimeoutTestingRoutes from "./TimeoutTesting";
import UsersRoutes from "./Users";

const routes = Router();
routes.get("/debug-sentry", (req, res, next) => {
      const test: any = null;
      test.helloWorld();
      res.send(test);
});
routes.get("/error", (req, res, next) => {
      process.exit(1);
      res.send("hello");
});

routes.get("/", (req, res, next) => {
      // render the index template

      res.locals.response = {
            hello: "worlds",
      };
      next();
});

routes.use("/timeout", TimeoutTestingRoutes);
routes.use("/users", UsersRoutes);

export default routes;
