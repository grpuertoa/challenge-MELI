//Import axios
const axios = require("axios");
//Import Access Token
const getToken = require("./getToken");
//Import insert Item in data base config
const insertFileItems = require("./config/insertItem");

//Retire request for the API request so it doesnt crashes
async function retireRequest(url, options, attempt = 1) {
  try {
    const respuesta = await axios.get(url, options);
    return respuesta.data;
  } catch (error) {
    // Verify if there is a limited request error (429) and the try number.
    if (error.response && error.response.status === 429 && attempt < 5) {
      // Exponential waiting time for the new request 2^n  s.
      const waitingTime = Math.pow(2, attempt) * 1000;
      // Wait before the next try
      await new Promise((resolve) => setTimeout(resolve, waitingTime));
      // Try again with a new count
      return retireRequest(url, options, attempt + 1);
    } else {
      // Other errors
      throw error;
    }
  }
}

//Get Items from API
async function getItems(original, joinedData, res) {
  try {
    //get access Token
    const { access_token } = await getToken();
    let newItems = [];

    //set Header
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    //Batch size to make each items API request
    const batchSize = 5;
    const batchedData = [];
    //Start the object response
    let categoryApiResponse = [];
    let currencyApiResponse = [];
    let sellerApiResponse = [];
    //Start the request for all data
    for (let i = 0; i < joinedData.length; i += batchSize) {
      batchedData.push(joinedData.slice(i, i + batchSize));
    }
    //On every object inside the batch start the API request
    for (let j = 0; j < batchedData.length; j++) {
      const itemsApiUrl = "https://api.mercadolibre.com/items";
      const categoriesApiUrl = "https://api.mercadolibre.com/categories";
      const currencyApiUrl = "https://api.mercadolibre.com/currencies";
      const sellerApiUrl = "https://api.mercadolibre.com/users";
      const ids = batchedData[j].join(",");
      //Time to start the request as a chekpoint for the API call
      //await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log("fetching data from API id: ", batchedData[j]);
      // retire function to the ITEMS API
      const itemsApiResponse = await retireRequest(
        `${itemsApiUrl}?ids=${ids}`,
        { headers }
      );
      //For each response , start the other API requests
      for (let i = 0; i < itemsApiResponse.length; i++) {
        if (itemsApiResponse[i].code === 200) {
          if (itemsApiResponse[i].body.category_id) {
            // retire function to the CATEGORIES API
            categoryApiResponse = await retireRequest(
              `${categoriesApiUrl}/${itemsApiResponse[i].body.category_id}`,
              { headers }
            );
          }

          if (itemsApiResponse[i].body.currency_id) {
            // API call from currency_id with headers to get description
            currencyApiResponse = await retireRequest(
              `${currencyApiUrl}/${itemsApiResponse[i].body.currency_id}`,
              { headers }
            );
          }

          if (itemsApiResponse[i].body.seller_id) {
            // API call from seller_id with headers to get nickname
            sellerApiResponse = await retireRequest(
              `${sellerApiUrl}/${itemsApiResponse[i].body.seller_id}`,
              { headers }
            );
          }

          //Build the full object to insert in the dataBase
          const newItem = {
            site: itemsApiResponse[i].body.site_id,
            id: itemsApiResponse[i].body.id.replace(/\D/g, ""),
            full_id: itemsApiResponse[i].body.id,
            price: itemsApiResponse[i].body.price
              ? itemsApiResponse[i].body.price
              : "price not found",
            start_time: itemsApiResponse[i].body.date_created,
            categoryName: categoryApiResponse.name
              ? categoryApiResponse.name
              : "category_id not found",
            currencyDescription: currencyApiResponse.description
              ? currencyApiResponse.description
              : "currency_id not found",
            sellerNickname: sellerApiResponse.nickname
              ? sellerApiResponse.nickname
              : "seller_id not found",
          };

          //Biuld the full object
          newItems.push(newItem);
        } else {
          //Build the full object to insert in the dataBase when the object is not found on the API request
          const newItem = {
            site: itemsApiResponse[i].body.id.replace(/\d/g, ""),
            id: itemsApiResponse[i].body.id.replace(/\D/g, ""),
            full_id: itemsApiResponse[i].body.id,
            price: "not found",
            start_time: "not found",
            categoryName: "not found",
            currencyDescription: "not found",
            sellerNickname: "not found",
          };

          //Biuld the full object
          newItems.push(newItem);

          //clean the data from api searches in case it doesnt found some data, it wont get the old data
          categoryApiResponse = [];
          currencyApiResponse = [];
          sellerApiResponse = [];
        }
      }
    }

    // Send the full object ready to insert in the DB
    await insertFileItems(newItems);

    return { apiResponse: newItems };
  } catch (error) {
    console.error("Error fetching data on apiHandler:", error);
    throw error;
  }
}

module.exports = { getItems };
