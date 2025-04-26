import express from "express";
import morgan from "morgan";
import { db } from "./config/db";
import budgetRouter from "./routes/budgetRouter";
import authRouter from "./routes/authRouter";

async function connectionDB() {
  try {
    await db.authenticate();
    db.sync(); // .sync() es para sincronizar la base de datos con los modelos, es decir, crear las tablas si no existen.
    console.log("Database connected");
  } catch (error) {
    //console.error(error);
    console.log("Falló la conexión a la base de datos");
  }
}
connectionDB();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/budgets", budgetRouter);

app.use("/api/auth", authRouter )

export default app;
