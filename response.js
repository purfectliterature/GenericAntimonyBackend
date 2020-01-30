/*
response.js
Defines all the default HTTP responses.
*/

exports.statusOK = function(values, res) {
    const data = {
        "status": 200,
        "values": values
    };
    res.json(data);
    res.end();
};

function makeStatusFunction(code, message) {
    function statusFunction(res) {
        const data = {
            "status": code,
            "values": message
        };
        res.status(code);
        res.json(data);
        res.end();
    }

    return statusFunction;
};

// Define status functions that return static messages here.
exports.statusNotFound = makeStatusFunction(404, "Not found.");
exports.statusSessionExpired = makeStatusFunction(440, "Session expired. Please login again.");
exports.statusInvalidToken = makeStatusFunction(498, "Invalid token. Please login again.");
exports.statusForbidden = makeStatusFunction(403, "There's nothing to see here for you.")
exports.statusBadRequest = (message) => {return makeStatusFunction(400, message)};