const { request, response } = require("express");
const Datastore = require("nedb");
const express = require("express");
const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "5mb" }));

const database = new Datastore("database.db");
database.loadDatabase();
database.insert({ name: "Alokin1112", project: "GBS-Drawing" });
app.post("/api", (request, response) => {
  const data = request.body;
  database.insert(data);
});
