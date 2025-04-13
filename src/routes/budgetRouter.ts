import { Router } from 'express';
import { BudgetController } from '../controllers/BudgetControllers';
import { handleInputErrors } from '../middleware/validation';
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from '../middleware/budget';
import { ExpenseController } from '../controllers/ExpenseController';
import { validateExpenseId, validateExpenseInput } from '../middleware/expense';

const router = Router();

// La siguiente línea: cada vez que se llame a un endpoint con un id, se va a ejecutar la función validateBudgetId 
// antes de llegar al controlador. Es decir, se valida el id antes de llegar al controlador.
router.param('budgetId', validateBudgetId); 
router.param('budgetId', validateBudgetExists); // Same: verifica si el presupuesto existe antes de llegar al controlador.

router.param('expenseId', validateExpenseId)

router.get('/', BudgetController.getAllBudgets);

router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.createBudget
);

router.get('/:budgetId', BudgetController.getBudgetById);
    
router.put('/:budgetId', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateBudget
);

router.delete('/:budgetId', BudgetController.deleteBudget);


// Expense Routes

router.post('/:budgetId/expenses', validateExpenseInput, handleInputErrors, ExpenseController.createExpense);
router.get('/:budgetId/expenses/:expenseId', ExpenseController.getExpenseById);
router.put('/:budgetId/expenses/:expenseId', ExpenseController.updateExpense);
router.delete('/:budgetId/expenses/:expenseId', ExpenseController.deleteExpense);

export default router;