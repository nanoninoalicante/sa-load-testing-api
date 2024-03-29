import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv";
import { usersSchema } from "../models/users";
dotenvConfig();
const config: any = {
      default: "main",
      main: process.env.MONGODB_HOST,
      content: process.env.MONGODB_HOST,
      customer: process.env.MONGODB_HOST,
      inventory: process.env.MONGODB_HOST,
      publication: process.env.MONGODB_HOST,
};

mongoose.Promise = global.Promise;

const mainConnect = "";
const contentConnect = "";
const customerConnect = "";
const inventoryConnect = "";
const publicationConnect = "";

export let connectNames: any = {
      main: "mainConnect",
      content: "contentConnect",
      customer: "customerConnect",
      inventory: "inventoryConnect",
      publication: "publicationConnect",
};
export let User: any = null;

async function createConnection(name: string) {
      try {
            connectNames[name] = mongoose.createConnection(config[name], {
                  maxPoolSize: 30,
                  maxIdleTimeMS: 10,
                  socketTimeoutMS: 2000,
                  waitQueueTimeoutMS: 5000,
                  connectTimeoutMS: 2000,
            });
            connectNames[name].on("connected", () => {
                  console.log("Mongoose default connection is open to ", name);
            });

            connectNames[name].on("error", (err: any) => {
                  console.log(
                        "Mongoose default connection has occured " +
                              err +
                              " error"
                  );
                  throw new Error("Mongoose connection error");
            });

            connectNames[name].on("disconnected", async () => {
                  console.log("Mongoose default connection is disconnected");
                  await connectNames[name].connect();
            });

            // process.on('SIGINT', () => {
            //     connectNames[name].close(function () {
            //         console.log("Mongoose default connection is disconnected due to application termination");
            //         process.exit(0);
            //     });
            // });

            await connectNames[name].asPromise();
            User = connectNames.main.model("User", usersSchema);

            return connectNames[name];
      } catch (error) {
            console.log("Error creating connection: ", error);
            return null;
      }
}

export { createConnection };
