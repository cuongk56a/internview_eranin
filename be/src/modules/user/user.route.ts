import express from 'express';
import { auth } from '../../middlewares/auth';
import {validate} from '../../middlewares/validate';
import { userController } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getOne), userController.getOne);

export const userRoute = router;
