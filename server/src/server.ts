import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './config/database.js';
import userRoutes from './routes/ProtectedRoutes.js';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const clientPath = path.join(__dirname, "../../client/dist");

app.use(cors())

app.use(express.json());

app.use("/api", userRoutes) // Ini buat ngambil API dari USERS

app.use(express.static(clientPath)) // https://hansyulian.space/api/books

app.get(/.*/, (req, res) => { // Ini buat ngambil build dari client
  res.sendFile(path.join(clientPath, "index.html"));
});

sequelize.authenticate()
  .then(() => console.log("DB Successfully Connected"))
  .catch(err => console.error("DB Error: ", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is Running")
});