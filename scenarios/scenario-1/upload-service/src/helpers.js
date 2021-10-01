import generateUniqueId from 'generate-unique-id'
import mysql from 'mysql2'

const HOST = process.env.HOST;
const PASSWORD = process.env.PASSWORD;

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
    const con = mysql.createConnection({
        host: HOST,
        port: '3306',
        user: "admin",
        password: PASSWORD,
    });

    con.connect(function(err) {
        console.log(err)
        con.query(`INSERT INTO main.images (keyId, base64, fileName, description, approve) VALUES ('${key}', '${base64}', '${key + ext}', '${name}', 'false')`, function(err, result, fields) {
            // if (err) console.log(err);
            if (result) console.log({key: key, fileName: key + ext, base64: base64, description: name, approve: "false"});
            if (fields) console.log(fields);
        });
        // connect to mysql and push data
    });
    return {key: key, fileName: key + ext, base64: base64, description: name, approve: "false"}
};