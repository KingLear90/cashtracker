import { Request, Response } from 'express'
import Budget from '../models/Budget';
import Expense from '../models/Expense';

// Usualmente un controlador va a ser una clase, pero también puede ser una función.
// En este caso, se utiliza una clase porque se va a utilizar un método estático y permite exportar solo una vez y no muchas funciones.

export class BudgetController {
    // La diferencia entre un método estático y uno normal es que el primero no necesita ser instanciado para ser utilizado.
    static async getAllBudgets(req: Request, res: Response) { 
        try {
            const budget = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC'],
                ]
            });
            res.status(200).json(budget);
        } catch (error) {
            res.status(500).json({ error: 'Error when trying to get the budgets' });
        }
    }

    static async createBudget(req: Request, res: Response) {
        try {
            const budget = new Budget(req.body);
            await budget.save();
            res.status(201).json({message: 'Budget successfully created', budget});
        } catch (error) {
            res.status(500).json({ error: 'Error when trying to create the budget' });
            
        }
    }

    static async getBudgetById(req: Request, res: Response) {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        })
        res.json(budget)
    }

    static async updateBudget(req: Request, res: Response) {
        await req.budget.update(req.body);
        res.status(200).json({message: 'Budget updated successfully', budget: req.budget});
    }

    static async deleteBudget(req: Request, res: Response) {
        await req.budget.destroy();
        res.status(200).json({message: 'Budget deleted successfully'});
    }
}