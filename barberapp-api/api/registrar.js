import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

let cachedClient = null;
let cachedDb = null;

const uri = process.env.MONGO_URI; 
const dbName = "BarberApp";

export default async function handler(req, res) {
  // --- CONFIGURACIÓN DE CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  try {
    // 1. AGREGAMOS LOS NUEVOS CAMPOS AQUÍ: servicios, dias, hora_apertura, hora_cierre
    const { 
      nombre, email, telefono, ciudad, 
      usuario, password, terminos,
      servicios
    } = req.body;

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

    // 2. GUARDAR EL OBJETO COMPLETO EN MONGODB
    const result = await collection.insertOne({
      nombre,
      email,
      telefono,
      ciudad,
      usuario,
      password: hashedPassword,
      // Guardamos los nuevos datos
      servicios: servicios || [], // Será un array de strings
      // Verificación de términos mejorada
      terminos: terminos === 'on' || terminos === true || terminos === 'true',
      fechaRegistro: new Date()
    });

    return res.status(200).json({ success: true, id: result.insertedId });

  } catch (error) {
    console.error("Error en BD:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}