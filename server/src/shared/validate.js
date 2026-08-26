import {
  registerSchema,
  loginSchema,
  podcastSchema,
  episodeSchema,
} from "./validation.js";

export const validate = (schema) => (req, res, next) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((e) => e.message),
    });
  }
  next();
};

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validatePodcast = validate(podcastSchema);
export const validateEpisode = validate(episodeSchema);
