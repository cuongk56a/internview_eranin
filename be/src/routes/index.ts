import express from 'express';
import { authRoute } from '../modules/auth/auth.route';
import { userRoute } from '../modules/user/user.route';
const router = express.Router();

const defaultRoutes: any[] = [
    {
      path: '/auth',
      route: authRoute
    },
    {
      path: '/user',
      route: userRoute
    },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;