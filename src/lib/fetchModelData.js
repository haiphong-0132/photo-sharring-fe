/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */

const BE_URL = process.env.REACT_APP_BE_URL

async function fetchModel(url) {
  try{
    const response = await fetch(BE_URL + "/api" + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
    });
    if (!response.ok){
      throw new Error("Network not ok");
    }
    
    return response.json();

  } catch(err){
    console.error("Error with fetch", err);
    throw err;
  };
}

export default fetchModel;
