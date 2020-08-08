const mongoose = require("mongoose");
let prodDatabaseUrl = `mongodb+srv://Amit:pp123@cluster0.jiy0y.mongodb.net/taskapi?retryWrites=true&w=majority`;
let prodDatabaseUrl2 = `mongodb://Amit:pp123@cluster0-shard-00-00.jiy0y.mongodb.net:27017,cluster0-shard-00-01.jiy0y.mongodb.net:27017,cluster0-shard-00-02.jiy0y.mongodb.net:27017/taskapi?ssl=true&replicaSet=atlas-hpzsy8-shard-0&authSource=admin&retryWrites=true&w=majority`;
let devDatabaseUrl = `mongodb://localhost:27017/task-app-api`;

mongoose.connect(devDatabaseUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});