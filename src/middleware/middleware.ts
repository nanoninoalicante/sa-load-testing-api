import ksuid from "ksuid";
import * as Sentry from "@sentry/node";
import { connectNames, createConnection } from '../mongoose/connection-v2';
import { config } from "dotenv";
config();
const ENVIRONMENT = process.env.ENVIRONMENT || "dev";
const COMMIT_ID = process.env.COMMIT_ID || "commit";
const VERSION = process.env.VERSION || "ver";
const REGION = process.env.REGION || "region";
const BRANCH_NAME = process.env.BRANCH_NAME || "branch";
const API_KEY = process.env.API_KEY || null;

export const authMiddleware = (req: any, res: any, next: () => void) => {
      const key = req.query?.api_key || req.headers.authorization;
      if (!key) {
            return res
                  .status(403)
                  .json({ error: "Unauthorized - missing api key" });
      }
      if (key !== API_KEY) {
            return res.status(403).json({ error: "Unauthorized" });
      }
      next();
};

export const requestMiddleware = async (
      req: any,
      res: {
            locals: { requestId: string; requestTs: string };
            setHeader: (arg0: string, arg1: string) => void;
      },
      next: any
) => {
      console.log("before middleware");
      console.log(connectNames.main._readyState);
      if (connectNames.main._readyState !== 1) {
            console.log('need to reconnect')
            await createConnection("main");
      }
      res.locals.requestId = ksuid.randomSync().string;
      res.locals.requestTs = new Date().toISOString();
      // res.setHeader("X-API-REQUEST-ID", res.locals.requestId);
      // res.setHeader("X-API-REQUEST-TS", res.locals.requestTs);
      // res.setHeader("X-API-ENV", ENVIRONMENT);
      // res.setHeader("X-API-VERSION", VERSION);
      // res.setHeader("X-API-COMMIT-ID", COMMIT_ID);
      // res.setHeader("X-API-BRANCH-NAME", BRANCH_NAME);
      // res.setHeader("X-API-REGION", REGION);
      next();
};

export const responseMiddleware = (req: any, res: any) => {
      return res.status(200).json({
            data: res.locals?.response,
            ts: res.locals?.requestTs,
            requestId: res.locals?.requestId,
            environment: ENVIRONMENT,
            version: VERSION,
            region: REGION,
            commitId: COMMIT_ID,
            host: req.hostname,
            reqPath: req.path,
            method: req.method,
      });
};

export const errorMiddleware = (err: any, req: any, res: any, next: any) => {
      console.log("error middleware: ", err);
      Sentry.captureException(err);
      res.status(400).json({
            error: err.message || err,
            ts: res.locals?.requestTs,
            requestId: res.locals?.requestId,
            environment: ENVIRONMENT,
            version: VERSION,
            region: REGION,
            host: req.hostname,
            method: req.method,
      });
};
