import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => { 
    try {
      const { email, password } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        res.status(409).json({ error: "Email is already in use" });
      }
      
      const user = new User(req.body);
      user.password = await hashPassword(password); // Hash the password before saving
      user.token = generateToken();
      await user.save()

      await AuthEmail.sendConfirmationEmail({   // Await porque AuthEmail.sendConfirmationEmail es una función asíncrona.
        name: user.name,
        email: user.email,
        token: user.token
      });

      res.status(201).json({ message: "Account created successfully", user });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the account" });
    }
  }

  static confirmAccount = async (req: Request, res: Response) => { 
    const { token } = req.body;
    const user = await User.findOne({ where: { token } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.confirmed = true;
    user.token = null; // Setea el token a null para indicar que el usuario ha confirmado su cuenta y no se vuelva a usar. 
    await user.save();

    res.status(200).json({ message: "Account confirmed successfully" });
  }

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Revisar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if(!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Revisar si la cuenta está confirmada
    if(!user.confirmed) {
      res.status(403).json({ error: "Account not confirmed" });
      return; 
    }

    // Revisar el password
    const isPasswordOk = await checkPassword(password, user.password)

    if(!isPasswordOk) {
      res.status(401).json({ error: "Invalid credentials" });
      return; 
    }

    // Generar el JWT
    const token = generateJWT(user.id)

    res.json(token)
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if(!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Le generamos un nuevo token
    user.token = generateToken(); 
    // El token no está almacenado en la base de datos, hay que guardarlo.  
    await user.save();  

    await AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token
    });

    res.json('Revisa tu correo para reestablecer tu contraseña')
  }

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    const tokenExists = await User.findOne({ where: { token } });
    if(!tokenExists) {
      const error = new Error("Invalid token");
      res.status(404).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: "Token is valid" });
  }

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { token } });
    if(!user) {
      const error = new Error("Invalid token");
      res.status(404).json({ error: error.message });
      return;
    }

    // Hashear el nuevo password
    user.password = await hashPassword(password); 
    // Guardamos el nuevo password y el token a null para indicar 
    // que el usuario ha reestablecido su contraseña y no se vuelva a usar.
    user.token = null;
    await user.save();

    res.status(200).json('Your password has been reset successfully');
  }

  // Con la password reseteada, obtenemos un nuevo token JWT. Ahora es necesario identificar qué usuario es.

  static user = async (req: Request, res: Response) => {
    const bearer = req.headers.authorization;

    if(!bearer) {
      const error = new Error("Unauthorized");
      res.status(401).json({ error: error.message });
      return;
    }

    const token = bearer.split(' ')[1];

    if(!token) {
      const error = new Error("Token not found");
      res.status(401).json({ error: error.message });
      return;
    } 

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      res.json(decoded);

      
    } catch (error) {
      res.status(500).json({ error: "Invalid token" });
      return;
      
    }

    res.json({token});
  }
}
