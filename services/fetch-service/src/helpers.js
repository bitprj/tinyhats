import { connect } from 'http2';
import mysql from 'mysql2'
import fetch from 'node-fetch'

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