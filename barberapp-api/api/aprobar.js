import { MongoClient } from "mongodb";

let cachedClient = null; // Reutiliza la conexión
let cachedDb = null;

const uri = process.env.MONGO_URI;
const dbName = "BarberApp";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { nombre, email, password, barberId } = req.body;

    // Validar datos
    if (!nombre || !email || !password || !barberId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Conectar a MongoDB si no está conectado
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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

    res.status(200).json({
      success: true,
      id: result.insertedId
    });

  } catch (error) {
    console.error("Error en API:", error); // Para ver en logs de Vercel
    res.status(500).json({
      error: "Error al guardar en la base de datos: " + error.message
    });
  }
}