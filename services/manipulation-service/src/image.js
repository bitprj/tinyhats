const Jimp = require('jimp')
const faceapi = require('face-api.js')
const canvas = require('canvas')
// require('@tensorflow/tfjs-node');

const { Canvas, Image, ImageData } = canvas  
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const findFace = async (baby) => {
  const image = await canvas.loadImage(baby)
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./weights')
  // const Canvas = canvas.createCanvas(image.width, image.height)
  // const ctx = Canvas.getContext('2d')
  // ctx.drawImage(image, 0, 0, image.width, image.height)
  // console.log(ctx)

  const fullFaceDescription = await faceapi.detectAllFaces(image)
  // use await to retrieve face data

  let relData = fullFaceDescription[0]._box
  console.log(`Detected faces: ${JSON.stringify(relData)}`)

  return relData;
  // {"_x":225.59293228387833,"_y":122.78662695563085,"_width":183.89773482084274,"_height":181.8649869230835}
}

const overlayHat = async (hat, result, baby) => {
  let hatImg = await Jimp.read(hat);
  const image = await Jimp.read(baby);
  let jimpFace = image.bitmap

  let width = result._width
  let height = result._height
  let left = result._x
  let top = result._y
  console.log(width, height, left, top)
  //  BoundingBox.Width:      ${data.BoundingBox.Width}`)

  hatImg = await hatImg.resize(width, height)

  image.composite(hatImg, left - width*0.1, top - height*1.2, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 0.9
  })

  return await image.getBase64Async(Jimp.MIME_PNG)
}

const uploadPreview = async (description, hat, preview1, preview2) => {
  const con = mysql.createConnection({
    host: HOST,
    port: '3306',
    user: "admin",
    password: PASSWORD,
  });

  con.connect(function(err) {
      console.log(err)
      con.query(`INSERT INTO main.images (description, hat, preview1, preview2) VALUES ('${description}', '${hat}', '${preview1}', '${preview2}')`, function(err, result, fields) {
          if (err) console.log(err);
          if (result) console.log({description: `${description}`});
          if (fields) console.log(fields);
      });
      // connect to mysql and push data
  });

  return {description: `${description}`}
}

exports.findFace = findFace
exports.overlayHat = overlayHat
exports.uploadPreview = uploadPreview
