import express from 'express';
import { validate } from '../../middlewares/validate';
import {authController} from './auth.controller';
import {authValidation} from './auth.validation';

const router = express.Router()

router.route('/register').post(validate(authValidation.register), authController.register);
router.route('/login').post(validate(authValidation.login), authController.login);
router.route('/token').post(validate(authValidation.refreshToken), authController.refreshToken);
router.route('/get-code-mail').get(validate(authValidation.sendMail), authController.sendMail);

export const authRoute = router;
