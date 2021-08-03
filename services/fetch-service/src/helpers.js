import { connect } from 'http2';
import mysql from 'mysql2'
import fetch from 'node-fetch'
import FormData from 'form-data'

const HOST = process.env.HOST;
const PASSWORD = process.env.PASSWORD;

const con = mysql.createConnection({
    host: HOST,
    port: '3306',
    user: "admin",
    password: PASSWORD,
});

export async function listPictures() {
    var sql = "SELECT * FROM main.images WHERE approve='true'";
    const results = await con.promise().query(sql)
    return results
};

export async function downloadBuffer(url) {
    let resp = await fetch(url,{
        method: 'GET',
    })

    // receive the response
    let data = await resp.arrayBuffer()
    return data
}

export async function getSpecificHat(style) {
    var sql = `SELECT * FROM main.images WHERE description='${style}' AND approve='true'`;
    const results = await con.promise().query(sql)
    
    let hatList = results[0]
    console.log(hatList)

    let randNum = Math.floor(Math.random() * hatList.length)
    let hatLink = hatList[randNum].url
    console.log(hatLink)

    let image = await downloadBuffer(hatLink)
    image = Buffer.from(image)

    return image
}

export async function getHatData() {
    var sql = `SELECT description, url FROM main.images WHERE approve='true'`;
    const results = await con.promise().query(sql)
    
    let hatList = results[0]
    console.log(hatList)

    return hatList
}

export async function getRandomHat() {
    // get random hat picture
    let hats = await listPictures()
    let hatList = hats[0]
    console.log(hatList)

    let randNum = Math.floor(Math.random() * hatList.length)
    let hatLink = hatList[randNum].url
    console.log(hatLink)

    let image = await downloadBuffer(hatLink)
    image = Buffer.from(image)
    return image
}

export async function defaultBoss() {
    //my fav boss ever
    let johnKinmonth = await downloadBuffer("https://pbs.twimg.com/profile_images/812363965095235584/hfniQLSk_400x400.jpg");
    johnKinmonth = Buffer.from(johnKinmonth)

    return johnKinmonth
}

export async function requestManipulate(face, hat) {
    // hit the upload endpoint to upload image and retrieve unique image id
    let formData = new FormData()
    formData.append('file', face, {filename: "face", data: face})
    formData.append('file', hat, {filename: "hat", data: hat})
    const formHeaders = formData.getHeaders();
    console.log("Posting to Manipulate")
    
    const manipulateRequest = await fetch(`http://${process.env.MANIPULATE_ENDPOINT}/manipulate`, {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var b64Result = await manipulateRequest.json()
    console.log(`Received response from /manipulate`)

    return b64Result
}