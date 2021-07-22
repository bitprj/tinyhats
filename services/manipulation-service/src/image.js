const Jimp = require('jimp')
const fetch = require('node-fetch')
require('dotenv').config()

const findBaby = async (baby) => {
  const subscriptionKey = ""
  const uriBase = "" + '/face/v1.0/detect';

  let params = new URLSearchParams({
    'returnFaceId': 'true',
  })

  // making the post request
  let resp = await fetch(uriBase + '?' + params.toString(),{
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

const overlayHat = async (hat, result, baby) => {
  let hatImg = await Jimp.read(hat);
  const image = await Jimp.read(baby);
  let face = result[0].faceRectangle

  hatImg = await hatImg.resize(face.width*1.5, face.height*1.5)

  image.composite(hatImg, face.left - face.width*0.3, face.top - face.height*1.5, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 0.9
  })

  // image.composite(hatImg, 0, 0, {
  //   mode: Jimp.BLEND_SOURCE_OVER,
  //   opacityDest: 1,
  //   opacitySource: 0.97
  // })

  return await image.getBase64Async(Jimp.MIME_PNG)
}

exports.findBaby = findBaby
exports.overlayHat = overlayHat