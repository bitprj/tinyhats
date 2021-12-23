const mysql = require('mysql')

const uploadPreview = async (description, hat, preview1, preview2) => {
  const con = mysql.createConnection({
    host: process.env.HOST,
    port: '3306',
    user: "admin",
    password: process.env.PASSWORD,
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

const callManipulate = async (face, hat) => {
    let formData = await createForm(face, hat)
    const formHeaders = formData.getHeaders();
    const manipulateRequest = await fetch(`http://manipulate-service:80/manipulate`, {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var b64Result = await manipulateRequest.json()

    return b64Result.preview
}

async function createForm(face, hat) {
    face = await downloadBuffer(face)
    let formData = new FormData()
    formData.append('file', face, {filename: "face", data: face})
    formData.append('file', hat, {filename: "hat", data: hat})
    console.log("Posting to Manipulate")

    return formData
}

async function downloadBuffer(url) {
    let resp = await fetch(url,{
        method: 'GET',
    })

    // receive the response
    let data = await resp.arrayBuffer()
    return data
}

exports.uploadPreview = uploadPreview
exports.callManipulate = callManipulate
