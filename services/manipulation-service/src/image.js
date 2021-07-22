const Jimp = require('jimp')
const fetch = require('node-fetch')

const findBaby = async (baby) => {
  const subscriptionKey = "352800627962499db666d887d8b6da43"
  const uriBase = "https://colefaceapi.cognitiveservices.azure.com" + '/face/v1.0/detect';

  let params = new URLSearchParams({
    'returnFaceId': 'true',
  })

  // making the post request
  let resp = await fetch(uriBase + '?' + params.toString(),{
      /*The await expression causes async function execution to pause until a Promise is settled 
      (that is, fulfilled or rejected), and to resume execution of the async function after fulfillment. 
      When resumed, the value of the await expression is that of the fulfilled Promise*/
      method: 'POST',
      body: baby,
      // we want to send the image
      headers: {
          'Content-Type' : 'application/octet-stream',
          'Ocp-Apim-Subscription-Key' : subscriptionKey
      }
  })

  // receive the response
  let data = await resp.json();
  console.log(data)
  return data;
}

exports.findBaby = findBaby