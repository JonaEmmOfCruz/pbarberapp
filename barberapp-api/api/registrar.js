import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

let cachedClient = null;
let cachedDb = null;

const uri = process.env.MONGO_URI; 
const dbName = "BarberApp";

export default async function handler(req, res) {
  // --- CONFIGURACIÓN DE CORS OBLIGATORIA ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  // ¡Esta línea nueva es clave para que no te dé error de CORS en localhost!
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Responder rápido al preflight del navegador
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- LÓGICA DE TU API ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  try {
    const { nombre, email, telefono, ciudad, experiencia, especialidad, usuario, password, terminos } = req.body;

    if (!usuario || !password || !email) {
      return res.status(400).json({ error: "Usuario, Email y Contraseña son obligatorios" });
    }

    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
      cachedDb = cachedClient.db(dbName);
    }
    
    const collection = cachedDb.collection("barberos");

    const existe = await collection.findOne({ $or: [{ email }, { usuario }] });
    if (existe) {
      return res.status(400).json({ error: "El email o nombre de usuario ya están en uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await collection.insertOne({
      nombre,
      email,
      telefono,
      ciudad,
      experiencia: Number(experiencia),
      especialidad,
      usuario,
      password: hashedPassword,
      terminos: terminos === 'on' || terminos === 'aceptado',
      estado: "pendiente",
      fechaRegistro: new Date()
    });

    return res.status(200).json({ success: true, id: result.insertedId });

  } catch (error) {
    console.error("Error en BD:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}