import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cachedClient = global.mongoClient;

if (!cachedClient) {
    cachedClient = global.mongoClient = { client: null, promise: null };
}

async function getClient() {
    if (cachedClient.client) return cachedClient.client;

    if (!cachedClient.promise) {
        cachedClient.promise = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).connect().then((client) => client);
    }

    cachedClient.client = await cachedClient.promise;
    return cachedClient.client;
}

const clientPromise = getClient();

export default clientPromise;
