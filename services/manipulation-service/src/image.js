const Jimp = require('jimp')
const Canvas = require('canvas')
const kittydar = require('kittydar')

const findCat = (cat) => {
  var img = new Canvas.Image; // creating an image object
  img.src = cat;

  var w = img.width;
  var h = img.height;

  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);

  var cats = kittydar.detectCats(canvas);
  console.log('There are', cats.length, 'cats in this photo');

}

exports.findCat = findCat