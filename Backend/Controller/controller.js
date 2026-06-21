const {sendSuccess,sendError} = require("../Utilities/utils");
const service = require("../Service/service")

// get github profile from github.
module.exports.fetchGitHubProfile= async (req, res, next) => {
  try {
    const username = req.params.username;
    const result = await service.fetchGitHubProfile(username);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('fetchGitHubProfile error:', error.message);
    next(error);
  }
};

// fetch all profiles from db
module.exports.fetchAllGitProfiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await service.fetchAllGitProfiles(page, pageSize);

    if (result?.status === 200 || result?.status === 201) {
      sendSuccess(res, result?.data, result.message, result.status);
    } else {
      sendError(res, result?.message, result?.status, result?.error);
    }
  } catch (error) {
    console.error("fetchAllGitProfiles error:", error.message);
    next(error);
  }
};


// fetch a particular profile from db
module.exports.getGitHubProfile= async (req, res, next) => {
  try {
    const username = req.params.username;
    const result = await service.getGitHubProfile(username);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('getGitHubProfile error:', error.message);
    next(error);
  }
};
module.exports.deleteGitHubProfile= async (req, res, next) => {
  try {
    const username = req.params.username;
    const result = await service.deleteGitHubProfile(username);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('deleteGitHubProfile error:', error.message);
    next(error);
  }
};