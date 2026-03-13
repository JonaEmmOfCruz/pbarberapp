const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://jcruzofcc_db_user:JD081004@cluster0.cw7bxyz.mongodb.net/BarberApp?retryWrites=true&w=majority";

let client;

module.exports = async function (req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {

    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }

    const db = client.db("BarberApp");
    const barberos = db.collection("barberos");

    const { nombre, email } = req.body;

    await barberos.insertOne({
      nombre,
      email,
      aprobado: true,
      fecha: new Date()
    });

    res.status(200).json({
      success: true,
      mensaje: "Barbero aprobado"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};