const AWS = require('aws-sdk')
const mysql = require('mysql')
const fetch = require('node-fetch')
const FormData = require('form-data')
const generateUniqueId = require('generate-unique-id')

const ID = process.env.S3_ID;
const SECRET = process.env.S3_SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const uploadPreview = async (description, hat, preview1, preview2) => {
    hatName = generateName()
    preview1Name = generateName()
    preview2Name = generateName()

    let hatLink = await up2S3(hatName, hat)
    let oneLink = await up2S3(preview1Name, preview1)
    let twoLink = await up2S3(preview2Name, preview2)

    const con = mysql.createConnection({
        host: process.env.HOST,
        port: '3306',
        user: "admin",
        password: process.env.PASSWORD,
    });

    con.connect(function(err) {
        console.log(err)
        con.query(`INSERT INTO main.images (description, hat, preview1, preview2) VALUES ('${description}', '${hatLink}', '${oneLink}', '${twoLink}')`, function(err, result, fields) {
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
    const manipulateRequest = await fetch(`http://manipulation-service:80/`, {
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
    let faceData = await downloadBuffer(face)
    console.log(face)
    console.log(faceData)
    let formData = new FormData()
    formData.append('file', hat, {filename: "hat", data: hat})
    formData.append('file', faceData, {filename: "face", data: faceData})
    console.log("Posting to Manipulate")

    return formData
}

async function downloadBuffer(url) {
    let resp = await fetch(url,{
        method: 'GET',
    })

    // receive the response
    let data = await resp.arrayBuffer()
    return Buffer.from(data)
}

function generateName() {
    const id = generateUniqueId({
        length: 16
    });

    return id + ".png"
}

async function up2S3(fileName, body) {
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: body
    };

    // Uploading files to the bucket
    // data.Location
    let response = await s3.upload(params).promise()

    return response.Location
}

exports.uploadPreview = uploadPreview
exports.callManipulate = callManipulate
