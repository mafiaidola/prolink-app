import { MongoClient, Db, ObjectId } from 'mongodb';
import 'server-only';

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please add MONGODB_URI to your environment variables');
}

// MongoDB connection options
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection across hot-reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, create a new connection
    client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect();
}

// Export a function to get the database
export async function getDatabase(): Promise<Db> {
    const client = await clientPromise;
    return client.db('prolink');
}

// Export the client promise for use in other modules
export { clientPromise, ObjectId };
