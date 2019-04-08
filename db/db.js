const {uri, dbName} = require('./config');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');


exports.checkConnection = async () => {
    const connection = await MongoClient.connect(uri, {useNewUrlParser: true});
    console.log('connected');
    connection.close()
};
exports.getCollection = async (col) => {
    const connection = await MongoClient.connect(uri, {useNewUrlParser: true});
    const currentDb = connection.db(dbName);
    const source = currentDb.collection(col);
    const data = await source.find({}).toArray();
    connection.close();
    return data;

};
exports.sendData = async (data, collectionName) => {
    let connection = null;
    try {
        let checkField = data.videoId;
        connection = await MongoClient.connect(uri, {useNewUrlParser: true});
        const currentDb = connection.db(dbName);
        const currentCollection = currentDb.collection(collectionName);
        currentCollection.insertOne(data);
        console.log('push is successful');
    } catch (e) {
        console.log(e);
    }
    connection.close()
};

exports.deleteData = async (id, collectionName) => {
    let connection = null;
    try {
        connection = await MongoClient.connect(uri, {useNewUrlParser: true});
        console.log('ready for deletion');
        console.log(id);
        const currentDb = connection.db(dbName);
        const currentCollection = currentDb.collection(collectionName);
        await currentCollection.deleteOne({_id: new mongodb.ObjectID(id)}, (err, result) => {
            if (err) {
                console.log('error on deletion!');
                throw err;
            }
            if (result) {
                console.log('deleted successfully');
            }
            connection.close();
        });

    } catch (e) {
        console.log(e);
    }
};