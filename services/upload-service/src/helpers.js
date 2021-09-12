import generateUniqueId from 'generate-unique-id'
import mysql from 'mysql'

const HOST = process.env.HOST;
const PASSWORD = process.env.PASSWORD;

const con = mysql.createConnection({
    host: HOST,
    port: '3306',
    user: "admin",
    password: PASSWORD,
});

export const fileExt = (ext) => {
    if (ext == "image/png") {
        return '.png'
    } else if (ext == "image/jpeg") {
        return '.jpeg'
    } else if (ext == "image/jpg") {
        return '.jpg'
    } else {
        process.exit()
    }
}

export const uniqueId = () => {
    const id = generateUniqueId({
        length: 16
    });
    // generate length 16 random file name

    return id
}

export async function push2RDS(key, ext, name, base64) {
    con.connect(function(err) {
        con.query(`INSERT INTO main.images (keyId, fileName, base64, description, approve) VALUES ('${key}', '${key + ext}', '${base64}', '${name}', 'false')`, function(err, result, fields) {
            if (err) console.log(err);
            if (result) console.log({key: key, fileName: key + ext, base64: base64, description: name, approve: "false"});
            if (fields) console.log(fields);
        });
        // connect to mysql and push data
    });
    return {key: key, fileName: key + ext, base64: base64, description: name, approve: "false"}
};