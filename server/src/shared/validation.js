import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().min(6).required(),
});

export const podcastSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(5000).optional(),
  category: Joi.string().max(100).optional(),
  isPublished: Joi.boolean().optional(),
});

export const episodeSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(5000).optional(),
  duration: Joi.number().integer().optional(),
});
