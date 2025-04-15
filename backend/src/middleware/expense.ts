import { Request, Response, NextFunction } from "express";
import { param, validationResult, body } from "express-validator";
import Expense from "../models/Expense";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense;
        }
    }
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    const expenseId = await Expense.findByPk(req.params.expenseId);
    await param('expenseId')
            .isInt({ min: 1 }).withMessage('Invalid request. ID must be a positive integer.')
            .run(req);

    req.expense = expenseId;
    
    let errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
    next()
};

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId);
        if (!expense) {
            res.status(404).json({ error: 'Expense not found' });
            return;
        }
        req.expense = expense;
        next()
    } catch (error) {
        res.status(500).json({ error: 'Error when trying to get the expense' });
    } 
};

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
            .notEmpty()
            .withMessage('The expense name is required').run(req);
    await body('amount')
            .notEmpty()
            .withMessage('The amount is required')
            .isNumeric().withMessage('The amount must be a number')
            .custom(value => value > 0).withMessage('The amount must be greater than 0').run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next()
}