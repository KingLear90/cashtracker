import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

// Las peticiones se enviarán a api/auth/create-account
router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account', 
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6})
        .withMessage('Invalid token'),
    handleInputErrors,
    AuthController.confirmAccount
)

export default router;