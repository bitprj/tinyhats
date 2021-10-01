import mysql from 'mysql'

export const con = mysql.createConnection({
    host: process.env.HOST,
    port: '3306',
    user: "admin",
    password: process.env.PASSWORD
});

con.connect(function(err) {
    if (err) throw err;

    con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');
    con.query('CREATE TABLE IF NOT EXISTS images(id int NOT NULL AUTO_INCREMENT, keyId varchar(30), url varchar(255), fileName varchar(255), description varchar(255), approve varchar(30), PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
        console.log(fields);
        console.log(error);
    });
    con.end();
});

con.connect(function(err) {
    con.query(`SELECT * FROM main.images WHERE approve='true'`, function(err, result, fields) {
        if (err) console.log(err);
        for (var i = 0; i < result.length; i++) {
            var entry = result[i]
            console.log(`INSERT INTO images VALUES (${entry.id}, '${entry.keyId}', '${entry.url}', '${entry.fileName}', '${entry.description}', 'true');`)
        }
        if (result) console.log("Current state: " + JSON.stringify(result));

// Current state: [{"id":1,"keyId":"lfwy1ted33t35cnx","url":"https://uwuaascat.s3.amazonaws.com/lfwy1ted33t35cnx.jpeg","fileName":"lfwy1ted33t35cnx.jpeg","description":"baby lying down"},{"id":2,"keyId":"dt0q129qcum37sxk","url":"https://uwuaascat.s3.amazonaws.com/dt0q129qcum37sxk.jpeg","fileName":"dt0q129qcum37sxk.jpeg","description":"baby lying down"},{"id":3,"keyId":"nhx7x0rc2o7vo81k","url":"https://uwuaascat.s3.amazonaws.com/nhx7x0rc2o7vo81k.jpeg","fileName":"nhx7x0rc2o7vo81k.jpeg","description":"baby lying down"},{"id":4,"keyId":"xy3lbwaixwfr2e6q","url":"https://uwuaascat.s3.amazonaws.com/xy3lbwaixwfr2e6q.jpeg","fileName":"xy3lbwaixwfr2e6q.jpeg","description":"baby lying down"},{"id":5,"keyId":"aa6wfoezrnhpw0qq","url":"https://uwuaascat.s3.amazonaws.com/aa6wfoezrnhpw0qq.jpeg","fileName":"aa6wfoezrnhpw0qq.jpeg","description":"baby lying down"},{"id":6,"keyId":"anxtx42ucy4p5gyf","url":"https://uwuaascat.s3.amazonaws.com/anxtx42ucy4p5gyf.jpeg","fileName":"anxtx42ucy4p5gyf.jpeg","description":"baby lying down"},{"id":7,"keyId":"2yjf94pgpswxn0kr","url":"https://uwuaascat.s3.amazonaws.com/2yjf94pgpswxn0kr.jpeg","fileName":"2yjf94pgpswxn0kr.jpeg","description":"baby lying down"},{"id":8,"keyId":"3lh9ypagvkm2j4mh","url":"https://uwuaascat.s3.amazonaws.com/3lh9ypagvkm2j4mh.jpeg","fileName":"3lh9ypagvkm2j4mh.jpeg","description":"baby lying down"}]
    });
});