const { MongoClient } = require('mongodb');

const connectionString = process.env.MONGO_URI;
if (!connectionString) {
  throw new Error('MONGO_URI not defined in .env file');
}

const client = new MongoClient(connectionString);

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect()
      .then(db => {
        dbConnection = db.db("natpac");
        console.log("Successfully connected to MongoDB.");
        return callback();
      })
      .catch(err => {
        return callback(err);
      });
  },

  getDb: function () {
    return dbConnection;
  },
};
