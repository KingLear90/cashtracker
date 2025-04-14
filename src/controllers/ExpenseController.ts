import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
  static createExpense = async (req: Request, res: Response) => {
    try {
      const expense = new Expense(req.body);
      expense.budgetId = req.budget.id; // Se asigna el id del presupuesto al gasto.
      await expense.save();
      res
        .status(201)
        .json({ message: "Expense successfully created", expense });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error when trying to create the expense" });
    }
  };

  static getExpenseById = async (req: Request, res: Response) => {
    const expense = await Expense.findByPk(req.params.expenseId);
    res.json(expense);
  };

  static updateExpense = async (req: Request, res: Response) => {
    await req.expense.update(req.body);
    res.status(200).json({ message: "Expense updated successfully", expense: req.expense });
  };

  static deleteExpense = async (req: Request, res: Response) => {
    await req.expense.destroy();
    res.status(200).json({ message: "Expense deleted successfully" });
  }
}
