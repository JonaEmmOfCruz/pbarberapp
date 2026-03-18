import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

const uri = process.env.MONGO_URI;
const dbName = "BarberApp";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {

    const { nombre, email, password, barberId } = req.body;

    if (!nombre || !email || !password || !barberId) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
      cachedDb = cachedClient.db(dbName);
    }

    const collection = cachedDb.collection("barberos");

    const result = await collection.insertOne({
      nombre,
      email,
      password,
      barberId,
      estado: "activo",
      creado: new Date()
    });

    return res.status(200).json({
      success: true,
      id: result.insertedId
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}