import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({path: path.join(__dirname, '../../.env')});

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3000),

    REDIS_HOST: Joi.string().default('127.0.0.1'),
    REDIS_PORT: Joi.string().default(6379),
    REDIS_PASSWORD: Joi.string().allow('', null),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    TABLE_PREFIX: Joi.string().required(),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    EMAIL: Joi.string().email().required(),
    PASS: Joi.string().required(),
  })
  .unknown();

const {value: envVars, error} = envVarsSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const appConfigs = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  redis: `redis://:${!!envVars.REDIS_PASSWORD ? envVars.REDIS_PASSWORD + '@' : ''}@${envVars.REDIS_HOST}:${
    envVars.REDIS_PORT
  }`,
  redisHost: envVars.REDIS_HOST,
  redisPort: envVars.REDIS_PORT,
  redisPassword: envVars.REDIS_PASSWORD,
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  database: {
    tablePrefix: envVars.TABLE_PREFIX,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    secretRefresh: envVars.JWT_SECRET_REFRESH,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    accessExpirationSeconds: envVars.JWT_ACCESS_EXPIRATION_MINUTES * 60,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  google: {
    email: envVars.EMAIL,
    pass: envVars.PASS,
  },
};