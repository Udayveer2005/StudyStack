const dns = require('dns');
const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Missing MONGO_URI in environment variables');
  }

  const servers = dns.getServers();
  if (servers.length === 1 && servers[0] === '127.0.0.1') {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
    console.log('Node DNS servers overridden to public resolvers for MongoDB SRV lookup');
  }

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 5000)
    });
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    err.message = `MongoDB connection failed: ${err.message}`;
    throw err;
  }
}

module.exports = { connectDb };

