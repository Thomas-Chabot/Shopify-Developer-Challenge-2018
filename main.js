const modules = "./modules";
const Database = require (modules + "/Database/Database.js").Database;
const Init     = require (modules + "/Database/Init.js").Init;
const API      = require (modules + "/api/main.js").api;
const Promises = require (modules + "/Promises.js").Promises;

const DB_URL = "./database/db.sql";

function startup () {
  var db = new Database();
  var api = new API(db);

  Promises.chain ({
    connect: ()=>db.connect(DB_URL),
    startup: ()=>db.initialize(),
//    initialization: ()=>Init(db),
    api: ()=>api.start()
  }).then ((data) => {
    console.log ("API is ready. Listening at port ", data.api.port);
  }).catch (([name, err]) => {
    console.log (`Error during process ${name}`);
    console.error (err);
  });
}

startup();
