function runQuery(dbConnect, query, res, isSpecialCase) {
    try {
        if (dbConnect.state !== "authenticated") {
            res.status(500);
            res.send({statusCode: 500, msg: "db connection failed"});
            return;
        }

        dbConnect.query(query, function (error, results, fields) {
            let toSend = {};
            if (error) {
                toSend.msg = error?.sqlMessage || "query failed";
                toSend.statusCode = 400; 
            } else {
                if (isSpecialCase) {
                    toSend.statusCode = 200;
                    toSend.data = results;
                    
                    if (results.length == 0){
                        toSend.msg = "Please Check Your Username And Password ";
                    } else {
                        toSend.msg = "success";
                    }
                } else {
                    toSend.msg = "success";
                    toSend.statusCode = 200;
                    toSend.data = results;
                }
            }
            res.status(toSend.statusCode);
            res.send(toSend);
        });
    } catch (err) {
        res.status(500);
        res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
    }
}

function mySQLRealEscapeString (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

module.exports = { runQuery, mySQLRealEscapeString };