import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
  // En Sequelize, se debe indicar la carpeta donde se encuentran los modelos
  models: [__dirname + "/../models/**/*"],

  dialectOptions: {
    ssl: {
      require: false,
    },
  },
});
