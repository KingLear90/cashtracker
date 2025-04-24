import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

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
    console.log(req.body.token)
  }

  
}
