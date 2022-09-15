const mongoose = require('mongoose');

const config: any = {
    default: 'main',
    main: process.env.NN_DB_AUTH,
    content: process.env.NN_DB_CONTENT,
    customer: process.env.NN_DB_CUSTOMER,
    inventory: process.env.NN_DB_INVENTORY,
    publication: process.env.NN_DB_PUBLICATION
};

mongoose.Promise = global.Promise;

let mainConnect = '';
let contentConnect = '';
let customerConnect = '';
let inventoryConnect = '';
let publicationConnect = '';

function createConnection(name: string) {
    let  connectNames:any = { main: 'mainConnect', content: 'contentConnect', customer: 'customerConnect', inventory: 'inventoryConnect', publication: 'publicationConnect' };

    connectNames[name] = mongoose.createConnection(config[name], { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
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

module.exports = {
    mainConnection,
    contentConnection,
    customerConnection,
    inventoryConnection,
    publicationConnection
};