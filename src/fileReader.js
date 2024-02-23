//Import libraries
const fs = require("fs");
const csv = require("fast-csv");
const readline = require("readline");
const path = require("path");

//Process file depending on it's format
async function processFile(name, format, customDelimiter) {
  //Config for the CSV file
  const fileConfig = {
    encoding: "utf-8",
    headers: true,
    delimiter: customDelimiter
  };

  const filePath = path.join(__dirname, "uploads", name);
  const stream = fs.createReadStream(filePath, fileConfig);

  let joinedData = [];

  // use JSONstream if it's a json file
  if (format == "json") {
    //Import library
    const JSONStream = require("JSONStream");
    //Parse jsonstream
    const jsonParser = stream.pipe(JSONStream.parse("*"));
    //save the read data
    const jsonData = [];
    //Promise to return when it finishes the reading
    return new Promise((resolve) => {
      //Handles data event when the stream is read and saves it on the array
      jsonParser.on("data", (data) => {
        jsonData.push(data);
        //Save JoinedData
        const join = `${data.site}${data.id}`;
        joinedData.push(join);
      });
      //Handles when it finishes reading the file
      jsonParser.on("end", async () => {
        const uniqueJoinedData = [...new Set(joinedData)];
        resolve({ original: jsonData, joined: uniqueJoinedData });
      });
    });
  } else if (format == "csv") {
    //Use fast-csv when it's a csv file and import delimiter from user
    const csvStream = csv.parse(fileConfig);
    const csvData = [];

    return new Promise((resolve) => {
      //Handles data event when the stream is read and saves it on the array
      csvStream
        .on("data", (data) => {
          csvData.push(data);
          //Save JoinedData
          const join = `${data.site}${data.id}`;
          joinedData.push(join);
        })
        //Handles when it finishes reading the file
        .on("end", async () => {
          const uniqueJoinedData = [...new Set(joinedData)];
          resolve({ original: csvData, joined: uniqueJoinedData });
        });
      //Read data will be proccessed by the parser from CSV
      stream.pipe(csvStream);
    });
  } else if (format == "txt") {
    //Use readline for txt file
    const lineReader = readline.createInterface({
      input: stream,
    });
    const txtData = [];
    //Handles data event when the stream is read and saves it on the array
    return new Promise((resolve) => {
      lineReader.on("line", (line) => {
        // Regular expression to match the site and id
        const match = line.match(/(\S+)\s+(\S+)/);

        if (match) {
          const site = match[1];
          const id = match[2];
          txtData.push(line);
          // Save JoinedData
          const join = `${site}${id}`;
          joinedData.push(join);
        } else {
          console.error(`Error parsing line: ${line}`);
        }
      });
      //Handles when it finishes reading the file
      lineReader.on("close", async () => {
        const uniqueJoinedData = [...new Set(joinedData)];
        uniqueJoinedData.shift();
        resolve({ original: txtData, joined: uniqueJoinedData });
      });
    });
  } else if (format === "jsonl") {
    // readLine to proccess the jsonl files
    const lineReader = readline.createInterface({
      input: stream,
    });
    const jsonlData = [];

    return new Promise((resolve) => {
      lineReader.on("line", (line) => {
        try {
          //trim leading spaces
          const cleanedLine = line.trim();
          const jsonData = JSON.parse(cleanedLine);
          jsonlData.push(jsonData);
          //join the json site and id
          const join = `${jsonData.site}${jsonData.id}`;
          joinedData.push(join);
        } catch (error) {
          console.error(`Error parsing JSON line: ${line}`);
        }
      });

      lineReader.on("close", async () => {
        const uniqueJoinedData = [...new Set(joinedData)];
        uniqueJoinedData.shift();
        resolve({ original: jsonlData, joined: uniqueJoinedData });
      });
    });
  } else {
    // Format not supported
    const errorMessage = "Format not supported";
    return Promise.reject(new Error(errorMessage));
  }
}

//Export the function
module.exports = { processFile };
