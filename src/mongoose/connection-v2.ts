import mongoose from 'mongoose';
import { config as dotenvConfig } from "dotenv"
import { usersSchema } from '../models/users';
dotenvConfig();
const config: any = {
    default: 'main',
    main: process.env.MONGODB_HOST,
    content: process.env.MONGODB_HOST,
    customer: process.env.MONGODB_HOST,
    inventory: process.env.MONGODB_HOST,
    publication: process.env.MONGODB_HOST
};

mongoose.Promise = global.Promise;

let mainConnect = '';
let contentConnect = '';
let customerConnect = '';
let inventoryConnect = '';
let publicationConnect = '';

export let connectNames:any = { main: 'mainConnect', content: 'contentConnect', customer: 'customerConnect', inventory: 'inventoryConnect', publication: 'publicationConnect' };
export let User: any = null;

async function createConnection(name: string) {

    connectNames[name] = mongoose.createConnection(config[name], {});
    await connectNames[name].asPromise();
    connectNames[name].on('connected', () => {
        console.log("Mongoose default connection is open to ", name);
    });

    connectNames[name].on('error', (err: any) => {
        console.log("Mongoose default connection has occured "+err+" error");
    });

    connectNames[name].on('disconnected', () => {
        console.log("Mongoose default connection is disconnected");
    });

    process.on('SIGINT', () => {
        connectNames[name].close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0);
        });
    });

    User = connectNames["main"].model('User', usersSchema);

    return connectNames[name];
}

export {
    createConnection
 }