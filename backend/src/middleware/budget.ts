import { Request, Response, NextFunction } from "express";
import { param, validationResult, body } from "express-validator";
import Budget from "../models/Budget";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

export const validateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Cuando se utiliza la validación de express-validator de forma separada, fuera del router, se debe utilizar
  // el método run() para ejecutar la validación.
  // Además, la función debe ser asíncrona y utilizar el await.
  await param("budgetId")
    .isInt({ min: 1 })
    .withMessage("Invalid request. ID must be a positive integer.")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateBudgetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }
    // Si el presupuesto existe, se agrega a la request para que esté disponible en el controlador.
    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error when trying to get the budget" });
  }
};

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("The budget name is required")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("The amount is required")
    .isNumeric()
    .withMessage("The amount must be a number")
    .custom((value) => value > 0)
    .withMessage("The amount must be greater than 0")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
