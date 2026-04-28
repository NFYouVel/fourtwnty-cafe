import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './config/database.js';
import GlobalApi from './routes/GlobalApi.js';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api", GlobalApi)

sequelize.authenticate()
  .then(() => console.log("DB Successfully Connected"))
  .catch(err => console.error("DB Error: ", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is Running on port", PORT);
});