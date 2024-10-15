import passport from 'passport';

const verifyCallback =
  (req: any, resolve: any, reject: any, requiredRights: any[]) => async (err: any, user: any, info: any) => {
    if (err || info || !user) {
      return reject(new Error('Please authenticate'));
    }
    req.userId = user.userId;

    resolve();
  };

export const auth =
  (...requiredRights: any) =>
  async (req: any, res: any, next: any) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', {session: false}, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch(err => next(err));
  };
