const router = require("express").Router();
const validateGithubUsername = require("../Middleware/validateUsername");
const controller = require("../Controller/controller")



router.post("/fetch-git-profile/:username",validateGithubUsername,controller.fetchGitHubProfile);
router.get("/fetch-profiles",controller.fetchAllGitProfiles);
router.get("/fetch-profile/:username",validateGithubUsername,controller.getGitHubProfile);
router.delete("/delete-git-profile/:username",validateGithubUsername,controller.deleteGitHubProfile);

module.exports.router = router;