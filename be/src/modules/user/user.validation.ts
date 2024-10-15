import Joi from 'joi';

const customObjectId = (value: any, helpers: any) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const getOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customObjectId).required(),
  }),
};

export const userValidation = {
  getOne,
};
