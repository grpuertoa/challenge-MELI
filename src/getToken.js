//Import axios
const axios = require("axios");

//Get the access Token
function getAccessToken() {
  //Get promise for the successful token request
  return new Promise(async (resolve, reject) => {
    const options = {
      method: "POST",
      url: "https://api.mercadolibre.com/oauth/token",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      data: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: "1973050058809934",
        client_secret: "cyT7rog0N4dlRrotI6iBSEqvXwnp38Ei",
        refresh_token: "TG-65d5ef8cc9c1f20001a9d925-409847847",
      }),
    };

    try {
      //get access token
      const response = await axios(options);
      resolve(response.data);
      //catch error
    } catch (error) {
      reject(error);
    }
  });
}

//Export Access Token function
module.exports = getAccessToken;
