const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const { url, dbName, collection } = require("./config");

const app = express();
app.use(express.static(__dirname));

app.get("/data.json", async (req, res) => {
  try {
    client = await MongoClient.connect(url + "/" + dbName);
    assert.notEqual(client, null);
    let db = await client.db(dbName);
    assert.notEqual(db, null);
    records = await db.collection(collection).find().toArray();
    res.send(JSON.stringify(records));
  } catch (err) {
    console.log(err);
  }
});

app.get("*", (req, res) => {
  return res.sendFile(req.path);
});

app.listen(8080, () => {
  console.log("Listening on 8080");
});
