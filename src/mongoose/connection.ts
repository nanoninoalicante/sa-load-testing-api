import mongoose from 'mongoose';
import { config as dotenvConfig } from "dotenv"
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

function createConnection(name: string) {
    let  connectNames:any = { main: 'mainConnect', content: 'contentConnect', customer: 'customerConnect', inventory: 'inventoryConnect', publication: 'publicationConnect' };

    connectNames[name] = mongoose.createConnection(config[name], {});
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

    return connectNames[name];
}

const mainConnection = createConnection('main');
const contentConnection = createConnection('content');
const customerConnection = createConnection('customer');
const inventoryConnection = createConnection('inventory');
const publicationConnection = createConnection('publication');
export {
    mainConnection,
    contentConnection,
    customerConnection,
    inventoryConnection,
    publicationConnection
 }