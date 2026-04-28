const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const URL = 'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=RP';
let db;

MongoClient.connect(URL).then(client => {
  db = client.db('prueba');
  console.log('Conectado a MongoDB Replica Set');
});

app.get('/usuarios', async (req, res) => {
  const datos = await db.collection('usuarios').find().toArray();
  res.json(datos);
});

app.post('/usuarios', async (req, res) => {
  const result = await db.collection('usuarios').insertOne(req.body);
  res.json(result);
});

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.collection('usuarios').updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );
  res.json(result);
});

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.collection('usuarios').deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
