const mysql = require('mysql2');

exports.handler = (event, context, callback) => {

    var conn = mysql.createConnection({
        host: "database-pruebas.cvdiq9drvcm2.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "bvdm9iSLzQWT2YutZmw5",
        port: 3306,
        database: "teletok_lambda"
    });

    conn.connect(function(error) {
        if (error) {
            conn.end(function() {
                callback(error, {
                    statusCode: 400,
                    body: JSON.stringify({
                        "estado": "error",
                        "msg": error
                    }),
                });
            });
        }
        else {
            var id = event.queryStringParameters.id;
            var sql = "SELECT p.id, p.description, p.creation_date, u.username, count(c.post_id) as 'commentCount', c.message FROM teletok_lambda.post p INNER JOIN post_comment c ON (c.post_id = p.id) INNER JOIN user u ON (u.id = p.id) WHERE p.id = ?";
            var params = [id];
            conn.query(sql, params, 
            function(err, result) {
                if (err) {
                    conn.end(function(){;
                    callback(err, {
                        statusCode: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            "estado": "error",
                            "msg": err
                        })
                    });
                    });
                }
                else {
                    conn.end(function() {
                        callback(null,  {
                            statusCode: 200,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "estado": "ok",
                                "msg": result
                            })
                        });

                    });
                }
            });
        }
    });
};
