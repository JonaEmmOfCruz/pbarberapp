import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { nombre, email, password, barberId } = req.body;

    if (!nombre || !email || !password || !barberId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const client = await clientPromise;
    const db = client.db("BarberApp");

    const collection = db.collection("barberos");

    const result = await collection.insertOne({
      nombre,
      email,
      password,
      barberId,
      estado: "activo",
      aprobado: true,
      creado: new Date()
    });

    res.status(200).json({
      success: true,
      id: result.insertedId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error en el servidor"
    });
  }
}