const { default: axios } = require("axios");
const { db } = require("../Database/dbConnection");
const { sendError } = require("../Utilities/utils");
const queries = require("../Database/QueryCollection.json")


module.exports.fetchGitHubProfile = async (username) => {
    try {
        if (!username || username.trim().length === 0) {
            return {
                status: 400,
                message: "Invalid username",
            }
        }

        const isExist = await db.query(queries.fetchAUser,[username])
        if(isExist[0]?.length!==0){
            return{
                status:200,
                message:"Profile fetched successfully.",
                data:isExist[0]
            }
        }
        
        
        
        const userProfile = await axios.get(`https://api.github.com/users/${username}`,{
            headers:{
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                "User-Agent": "github-profile-analyzer"
            }
        });
        if (!userProfile || Object.keys(userProfile?.data).length === 0) return {
            status: 404,
            message: "GitHub Profile Not Found."
        }

    
        
        const requiredDataFields = ["login", "avatar_url", "url", "html_url","followers_url", "following_url", "gists_url", "starred_url", "subscriptions_url", "organizations_url", "repos_url", "events_url", "received_events_url", "type", "user_view_type", "name", "company", "blog", "location", "email", "hireable", "bio", "twitter_username", "public_repos", "public_gists", "followers", "following", "created_at"];

        const values = requiredDataFields.map(field => {
            if (field === "created_at") {
                return new Date(userProfile.data.created_at);
            }
            return userProfile?.data[field];
        });

        const savedProfile = await db.query(queries.saveProfile, [values]);

        if (!savedProfile[0]?.insertId) {
            return {
                status: 400,
                message: "failed to save github profile"
            }
        }

        let displayDataObj = {};

        for (const [key, val] of Object.entries(userProfile?.data)) {
            if (requiredDataFields.includes(key)) {
                displayDataObj[key] = val;
            }
        }

        return {
            status: 201,
            message: "github profile is fetched and saved successfully.",
            data: displayDataObj
        }


    } catch (error) {

        return {
            status: error.status || 500,
            message: "Something went wrong",
            error: error.status ===404 ? "No Data Found.": error.message
        }
        

    }
}

module.exports.fetchAllGitProfiles = async (page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;

    const profiles = await db.query(
      `${queries.fetchAllUsers} LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    if (!profiles || profiles[0].length === 0) {
      return {
        status: 404,
        message: "No profiles found."
      };
    }

    // Optional: get total count for pagination metadata
    const countResult = await db.query(queries.fetchTotalUsers);
    if(!countResult || countResult[0].length ===0){
      return {
        status: 404,
        message: "Failed to fetch count."
      };
    }
    const total = countResult[0][0].total;

    return {
      status: 200,
      message: "Data found successfully.",
      data: {
        profiles: profiles[0],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
      error: error
    };
  }
};


module.exports.getGitHubProfile = async(username)=>{
    try {
        if(!username || username.trim().length===0){
            return{
                status:400,
                message:"Invalid username"
            }
        }
        const profile = await db.query(queries.fetchAUser,[username]);
        if(!profile || profile[0].length === 0){
            return{
                status:404,
                message:"No profile found."
            }
        }
        return{
            status:200,
            message:"Data found successfully.",
            data:profile[0]
        }
    } catch (error) {
        return{
            status:500,
            message:"Something went wrong",
            error:error
        }
    }
}

module.exports.deleteGitHubProfile = async(username)=>{
    try {
        if(!username || username.trim().length===0){
            return{
                status:400,
                message:"Invalid username"
            }
        }
        
        const profile = await db.query(queries.fetchAUser,[username]);
        if(!profile || profile[0].length === 0){
            return{
                status:404,
                message:"No profile found."
            }
        }

        const updatedStatus = await db.query(queries.deleteUser,[username]);

        if(updatedStatus?.affectedRows === 0 ){
            return{
                status:400,
                message:"failed to delete data"
            }
        }

        return{
            status:200,
            message:"data deleted successfully."
        }

    } catch (error) {
        return{
            status:500,
            message:"Something went wrong",
            error:error
        }
    }
}