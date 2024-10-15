import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {appConfigs} from './config';
var jwt = require('jsonwebtoken');

const jwtOptions = {
  secretOrKey: appConfigs.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: any, done: any) => {
  try {
    done(null, payload);
  } catch (error: any) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export const getNewToken = (payload: any) => {  
  return jwt.sign(payload, appConfigs.jwt.secret, {expiresIn: 60});
};

export const getNewRefreshToken = (payload: any) => {
  return jwt.sign(payload, appConfigs.jwt.secretRefresh, {expiresIn: 3600});
};