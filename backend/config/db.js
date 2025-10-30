const mongoose = require("mongoose");

let isConnect = false;

async function configDB() {
  if (isConnect) {
    console.log("Using existing mongodb connection");
    return;
  }

  try {
    const uri = process.env.MONGODBURI;
    if (!uri) {
      console.log("Add connection string of your database");
      return;
    }
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 450000,
      family: 4,
    });
    isConnect = mongoose.connection.readyState === 1;
    console.log("Create Database connection successfully ");
  } catch (error) {
    console.error("Mongodb connection error", error);
  }
}

module.exports = { configDB };
