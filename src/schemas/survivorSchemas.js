const Joi = require('joi');

const postSurvivor = Joi.object({
  name: Joi.string().min(3).max(20)
    .required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  lastLocation: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
  resources: Joi.array().min(1),

});

const editSurvivorLocation = Joi.object({
  lastLocation: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
});

module.exports = {
  postSurvivor,
  editSurvivorLocation,
};
