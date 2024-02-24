//Import axios
const axios = require("axios");
//Import Access Token
const getToken = require("./getToken");
//Import insert Item in data base config
const insertFileItems = require("./config/insertItem");
//URLs
const itemsApiUrl = "https://api.mercadolibre.com/items";
const categoriesApiUrl = "https://api.mercadolibre.com/categories";
const currencyApiUrl = "https://api.mercadolibre.com/currencies";
const sellerApiUrl = "https://api.mercadolibre.com/users";
var headers;

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

async function createHeader() {
  try {
    //get access Token
    const { access_token } = await getToken();
    //set Header
    headers = {
      Authorization: `Bearer ${access_token}`,
    };
  } catch (error) {
    new Error("Could not get Access Token");
  }
}

async function getHeader() {
  return headers;
}

//Get Items from API
async function getItems(original, joinedData, res) {
  try {
    await createHeader();
    //Batch size to make each items API request
    const batchSize = 5;
    let currentBatch = 0;
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
      const ids = batchedData[j].join(",");
      let newItems = [];

      // retire function to the ITEMS API
      const itemsApiResponse = await retireRequest(
        `${itemsApiUrl}?ids=${ids}`,
        { headers }
      );

      //For each response , start the other API requests
      for (let i = 0; i < itemsApiResponse.length; i++) {
        if (itemsApiResponse[i].code === 200) {
          categoryApiResponse = await categoryAPI(
            itemsApiResponse[i].body.category_id,
            headers
          );

          currencyApiResponse = await currencyAPI(
            itemsApiResponse[i].body.currency_id,
            headers
          );

          sellerApiResponse = await sellerAPI(
            itemsApiResponse[i].body.seller_id,
            headers
          );

          //Build the full object to insert in the dataBase
          const newItem = {
            site: itemsApiResponse[i].body.site_id,
            id: itemsApiResponse[i].body.id.replace(/\D/g, ""),
            full_id: itemsApiResponse[i].body.id,
            price: itemsApiResponse[i].body.price
              ? itemsApiResponse[i].body.price
              : "price not found",
            start_time: itemsApiResponse[i].body.date_created,
            categoryName: categoryApiResponse
              ? categoryApiResponse.name
              : "category_id not found",
            currencyDescription: currencyApiResponse
              ? currencyApiResponse.description
              : "currency_id not found",
            sellerNickname: sellerApiResponse
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
      // Send the full object ready to insert in the DB
      await insertFileItems(newItems);
      currentBatch++;
      console.log(
        "fetching data from API id: ",
        batchedData[j],
        "batch number: ",
        currentBatch,
        " de: ",
        batchedData.length
      );
    }

    return { apiResponse: 200 };
  } catch (error) {
    console.error("Error fetching data on apiHandler:", error);
    throw error;
  }
}

async function categoryAPI(category_id, headers) {
  if (category_id) {
    // API call from category_id with headers to get category name
    categoryApiResponse = await retireRequest(
      `${categoriesApiUrl}/${category_id}`,
      { headers }
    );
    return categoryApiResponse;
  }
}

async function currencyAPI(currency_id, headers) {
  if (currency_id) {
    // API call from currency_id with headers to get description
    currencyApiResponse = await retireRequest(
      `${currencyApiUrl}/${currency_id}`,
      { headers }
    );
    return currencyApiResponse;
  }
}

async function sellerAPI(seller_id, headers) {
  if (seller_id) {
    // API call from seller_id with headers to get nickname
    sellerApiResponse = await retireRequest(`${sellerApiUrl}/${seller_id}`, {
      headers,
    });
    return sellerApiResponse;
  }
}

module.exports = {
  getItems,
  createHeader,
  sellerAPI,
  categoryAPI,
  currencyAPI,
  getHeader,
};
