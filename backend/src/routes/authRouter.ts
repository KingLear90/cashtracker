import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { limiter } from '../config/limiter';

const router = Router();

router.use(limiter); // Limitar las peticiones (en este caso, 4 por minuto por IP)

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

router.post('/login',
    body('email')
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleInputErrors,
    AuthController.login
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6})
        .withMessage('Invalid token'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token')
        .notEmpty()
        .isLength({ min: 6, max: 6})
        .withMessage('Invalid token'),
    body('password')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user', 
    AuthController.user
)

export default router;