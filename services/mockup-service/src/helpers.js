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

export async function getSpecificHat(style) {
    var sql = `SELECT * FROM main.images WHERE description='${style}'`;
    const results = await con.promise().query(sql)
        .catch(err => console.log(err))
    
    let hatList = results[0]
    // console.log(hatList)

    let hatData = hatList[0].hat
    hatData = hatData.replace("data:image/png;base64,", "")
    console.log(hatData)

    let image = Buffer.from(hatData, 'base64')
    console.log(image)

    return image
}

export async function requestManipulate(face, hat) {
    let formData = await createForm(face, hat)
    const formHeaders = formData.getHeaders();
    const manipulateRequest = await fetch(`http://${process.env.MANIPULATE_ENDPOINT}/`, {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var b64Result = await manipulateRequest.json()
    return b64Result
}

async function createForm(face, hat) {
    let formData = new FormData()
    formData.append('file', hat, {filename: "hat", data: hat})
    formData.append('file', face, {filename: "face", data: face})
    console.log("Posting to Manipulate")

    return formData
}