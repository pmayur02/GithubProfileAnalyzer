const { githubUsernameSchema } = require("../Utilities/validations"); // import your Joi schema

// Middleware for validating GitHub username param
const validateGithubUsername = (req, res, next) => {
  const { error } = githubUsernameSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
    });
  }

  next();
};

module.exports = validateGithubUsername;
