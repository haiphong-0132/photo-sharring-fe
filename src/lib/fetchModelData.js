/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
function fetchModel(url) {
  const models = fetch("https://2qxzt2-8081.csb.app/api" + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error with fetch", error);
      throw error;
    });

  return models;
}

export default fetchModel;
