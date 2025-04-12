import { Request, Response } from 'express'
import Expense from '../models/Expense';


export class ExpenseController {

    static async createExpense(req: Request, res: Response) {
        try {
            const expense = new Expense(req.body);
            expense.budgetId = req.budget.id; // Se asigna el id del presupuesto al gasto.
            await expense.save();
            res.status(201).json({message: 'Expense successfully created', expense});
        } catch (error) {
            res.status(500).json({ error: 'Error when trying to create the expense' });
            
        }
    }

    static async getExpenseById(req: Request, res: Response) {
        res.json(req.params.expense)
    }

    static async updateExpense(req: Request, res: Response) {
        
    }

    static async deleteExpense(req: Request, res: Response) {
        
    }
}