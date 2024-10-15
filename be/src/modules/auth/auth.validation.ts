import Joi from 'joi';

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    code: Joi.string().required(),
  })
}

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  })
}

const sendMail = {
  query: Joi.object().keys({
    email: Joi.string().email().required(),
  })
}

export const authValidation = {
  register,
  login,
  refreshToken,
  sendMail
};
