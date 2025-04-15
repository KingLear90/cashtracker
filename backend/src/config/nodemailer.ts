import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const config = () => {
    return {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,  // con + al principio la variable toma el tipo number.
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      }
}

export const transport = nodemailer.createTransport(config()); // Esta función se va a mandar a llamar cada vez que se necesite enviar un correo