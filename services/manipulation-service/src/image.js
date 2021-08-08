const Jimp = require('jimp')
const AWS = require('aws-sdk')

const config = new AWS.Config({
  accessKeyId: process.env.S3_ID,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.AWS_REGION
})

const client = new AWS.Rekognition();

const findBaby = async (baby) => {
  const params = {
    Image: {
      // only accepts pure buffer
      "Bytes": baby
    },
    Attributes: ['ALL']
  }
  
  let data = await client.detectFaces(params).promise()
  // use await to retrieve face data
  console.log(`Detected faces: ${JSON.stringify(data.FaceDetails[0].BoundingBox)}`)

  return data;
}

const overlayHat = async (hat, result, baby, translate, rotate) => {
  let hatImg = await Jimp.read(hat);
  const image = await Jimp.read(baby);
  let jimpFace = image.bitmap

  let face = result.FaceDetails[0].BoundingBox

  let width = face.Width * jimpFace.width
  let height = face.Height * jimpFace.height
  let left = face.Left * jimpFace.width
  let top = face.Top * jimpFace.height
  //  BoundingBox.Width:      ${data.BoundingBox.Width}`)

  hatImg = await hatImg.resize(width, height)
  hatImg = await hatImg.rotate(rotate)

  translate = translate * 0.3

  image.composite(hatImg, left - width*translate, top - height*1.2, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 0.9
  })

  return await image.getBase64Async(Jimp.MIME_PNG)
}

exports.findBaby = findBaby
exports.overlayHat = overlayHat
