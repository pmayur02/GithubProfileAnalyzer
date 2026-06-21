const Joi = require("joi");

const githubUsernameSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^(?!-)(?!.*--)[a-zA-Z0-9-]+(?<!-)$/)
    .required()
    .messages({
      "string.base": "GitHub username must be a string.",
      "string.empty": "GitHub username cannot be empty.",
      "string.min": "GitHub username must have at least 3 character.",
      "string.max": "GitHub username cannot exceed 30 characters.",
      "string.pattern.base":
        "GitHub username may only contain alphanumeric characters or hyphens, cannot start/end with a hyphen, and cannot have consecutive hyphens.",
      "any.required": "GitHub username is required."
    })
});

module.exports = { githubUsernameSchema };
