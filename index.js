const https = require('https');
const querystring = require("querystring");

const _get = async url => {
  return new Promise((resolve, reject) => {
    let responseData = "";
    const request = https.get(url, response => {
      response.on("data", chunk => {
        responseData += chunk;
      });

      // The whole response has been received
      response.on("end", () => {
        try {
          const out = JSON.parse(responseData);

          if (response.statusCode === 200) {
            resolve(out);
          } else {
            reject(new Error(`Status code ${response.statusCode}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on("error", error => {
      reject(error);
    });
    request.end();
  });
};

const getNextPickupDate = async (address) => {
  const baseUrl = 'https://gastrikeatervinnare.se/wp-admin/admin-ajax.php';
  const params = querystring.stringify({
    'action': 'get_search_as_json',
    'filters[]': 'pickup',
    'q': address,
  });

  const url = `${baseUrl}?${params}`;
  const response = await _get(url)

  return response.data;
}

module.exports = getNextPickupDate;
