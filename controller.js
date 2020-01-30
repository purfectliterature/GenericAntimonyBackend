/*
controller.js
Defines endpoints from routes.js.
*/

const connection = require("./connection");
const response = require("./response");
const crypto = require("crypto");

exports.index = function(req, res) {
    response.statusOK("Hello World, from backend services!", res);
};

exports.login = function(req, res) {
    const username = req.body.username;

    connection.query("SELECT user_id, user_type FROM users WHERE username=?", [username], function(error, results, fields) {
        if (error) throw error;
        
        if (results.length === 1) {
            const userId = results[0].user_id;
            const userType = results[0].user_type;

            // Generate new token
            const tokenUid = Math.floor(Math.random() * Math.PI * 9999999);
            const tokenRaw = tokenUid.toString() + username;
            const tokenNew = crypto.createHash("md5").update(tokenRaw).digest("hex");

            // Update new token and last login date
            connection.query("UPDATE users SET token=?, last_login=CURRENT_DATE() WHERE username=?", [tokenNew, username], function(error, results, fields) {
                if (error) throw error;
            });

            // Parse new data and status OK
            const parsedData = {
                "token": tokenNew,
                "user_id": userId,
                "user_type": userType
            };
            response.statusOK(parsedData, res);
        } else {
            response.statusNotFound(res);
        }
    });
};

exports.getUserProfile = function(req, res) {
    const tokenBody = req.body.token;
    const userIdBody = req.body.user_id;

    // Step (1) Validate saved token and server's token
    connection.query("SELECT token FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {
            const tokenDbase = results[0].token;
            if (tokenDbase === tokenBody) {

                // Step (2) Validate last login date difference with current date
                connection.query("SELECT DATEDIFF(CURRENT_DATE(), last_login) as date_diff FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
                    if (error) throw error;
                    const dateDifference = results[0].date_diff;
                    if (dateDifference <= 7) {
                        // Step (2.5) Every successful authentication, update last_login (functions as last access date)
                        connection.query("UPDATE users SET last_login=CURRENT_DATE() WHERE user_id=?", [userIdBody], function(error, results, fields) {
                            if (error) throw error;
                        });


                        // Step (3) All things well, return user profile
                        connection.query("SELECT username, name, contact FROM users WHERE user_id=?",[userIdBody], function(error, results, fields) {
                            if (error) throw error;
                            response.statusOK(results[0], res);
                        });
                    } else {
                        response.statusSessionExpired(res);
                    }
                });
            } else {
                response.statusInvalidToken(res);
            }
        } else {
            response.statusNotFound(res);
        }
    });
};

exports.getStores = function(req, res) {
    const tokenBody = req.body.token;
    const userIdBody = req.body.user_id;

    // Step (1) Validate saved token and server's token
    connection.query("SELECT token FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {
            const tokenDbase = results[0].token;
            if (tokenDbase === tokenBody) {

                // Step (2) Validate last login date difference with current date
                connection.query("SELECT DATEDIFF(CURRENT_DATE(), last_login) as date_diff FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
                    if (error) throw error;
                    const dateDifference = results[0].date_diff;
                    if (dateDifference <= 7) {
                        // Step (2.5) Every successful authentication, update last_login (functions as last access date)
                        connection.query("UPDATE users SET last_login=CURRENT_DATE() WHERE user_id=?", [userIdBody], function(error, results, fields) {
                            if (error) throw error;
                        });


                        // Step (3) All things well, return stores
                        connection.query("SELECT stores.store_id, stores.name, stores.address, stores.pic, stores.pic_contact FROM stores, dists_stores, users WHERE dists_stores.store_id = stores.store_id AND dists_stores.dist_id = users.dist_id AND users.user_id=?;",[userIdBody], function(error, results, fields) {
                            if (error) throw error;
                            
                            response.statusOK(results, res);

                        });
                    } else {
                        response.statusSessionExpired(res);
                    }
                });
            } else {
                response.statusInvalidToken(res);
            }
        } else {
            response.statusNotFound(res);
        }
    });
};

exports.getDistributor = function(req, res) {
    const tokenBody = req.body.token;
    const userIdBody = req.body.user_id;

    // Step (1) Validate saved token and server's token
    connection.query("SELECT token FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {
            const tokenDbase = results[0].token;
            if (tokenDbase === tokenBody) {

                // Step (2) Validate last login date difference with current date
                connection.query("SELECT DATEDIFF(CURRENT_DATE(), last_login) as date_diff FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
                    if (error) throw error;
                    const dateDifference = results[0].date_diff;
                    if (dateDifference <= 7) {
                        // Step (2.5) Every successful authentication, update last_login (functions as last access date)
                        connection.query("UPDATE users SET last_login=CURRENT_DATE() WHERE user_id=?", [userIdBody], function(error, results, fields) {
                            if (error) throw error;
                        });

                        // Step (3) All things well, return distributor details
                        connection.query("SELECT dists.name, dists.address, dists.area, dists.pic, dists.pic_contact FROM dists, users WHERE users.user_id = ? AND users.dist_id = dists.dist_id", [userIdBody], function(error, results, fields) {
                            if (error) throw error;
                            
                            response.statusOK(results[0], res);

                        });
                    } else {
                        response.statusSessionExpired(res);
                    }
                });
            } else {
                response.statusInvalidToken(res);
            }
        } else {
            response.statusNotFound(res);
        }
    });
};

exports.getProductsfromStoreId = function(req, res) {
    const tokenBody = req.body.token;
    const userIdBody = req.body.user_id;
    const storeIdBody = req.body.store_id;

    // Step (1) Validate saved token and server's token
    connection.query("SELECT token FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {
            const tokenDbase = results[0].token;
            if (tokenDbase === tokenBody) {

                // Step (2) Validate last login date difference with current date
                connection.query("SELECT DATEDIFF(CURRENT_DATE(), last_login) as date_diff FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
                    if (error) throw error;
                    const dateDifference = results[0].date_diff;
                    if (dateDifference <= 7) {
                        // Step (2.5) Every successful authentication, update last_login (functions as last access date)
                        connection.query("UPDATE users SET last_login=CURRENT_DATE() WHERE user_id=?", [userIdBody], function(error, results, fields) {
                            if (error) throw error;
                        });

                        // Step (3) All things well, return stores' products
                        connection.query("SELECT prod_name_ids.name as product_name, products.size as product_size, product_types.desc as product_type, prices.price as product_price, stores_prods.focus as focus FROM prod_name_ids, products, product_types, prices, stores_prods, stores_prices WHERE stores_prods.store_id = ? AND stores_prods.product_id = products.product_id AND products.name_id = prod_name_ids.name_id AND prod_name_ids.type_id = product_types.product_type AND stores_prices.store_id = stores_prods.store_id AND stores_prices.price_code = prices.price_code AND prices.product_id = products.product_id",[storeIdBody], function(error, results, fields) {
                            if (error) throw error;
                            
                            response.statusOK(results, res);

                        });
                    } else {
                        response.statusSessionExpired(res);
                    }
                });
            } else {
                response.statusInvalidToken(res);
            }
        } else {
            response.statusNotFound(res);
        }
    });
};

exports.insertUser = function(req, res) {
    const apiName = "insertUser";
    const tokenBody = req.body.token;
    const userIdBody = req.body.user_id;

    // Step (1) Check if user exists
    connection.query("SELECT token, user_type FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {

            // Step (1.5a) Check if user_type has privilege to access this API
            const userType = results[0].user_type.toString();
            const tokenDbase = results[0].token;
            connection.query("SELECT insertUser as allowed_stat FROM user_privileges WHERE user_type=?", [userType], function(error, results, fields) {
                if (error) throw error;

                const allowed = results[0].allowed_stat;
                if (allowed) {

                    // Step (1.5b) Validate saved token and server's token
                    if (tokenDbase === tokenBody) {

                        // Step (2) Validate last login date difference with current date
                        connection.query("SELECT DATEDIFF(CURRENT_DATE(), last_login) as date_diff FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
                            if (error) throw error;
                            const dateDifference = results[0].date_diff;
                            if (dateDifference <= 7) {
                                // Step (2.5) Every successful authentication, update last_login (functions as last access date)
                                connection.query("UPDATE users SET last_login=CURRENT_DATE() WHERE user_id=?", [userIdBody], function(error, results, fields) {
                                    if (error) throw error;
                                });
        
                                // Step (3) All things well, DO THE THING
                                const newUsername = req.body.values.username;
                                const newName = req.body.values.name;
                                const newContact = req.body.values.contact;
                                const newUserType = req.body.values.user_type;
                                const newDistId = req.body.values.dist_id;
                                const newToken = "Placeholder for fresh new user";

                                connection.query("SELECT user_id FROM users WHERE username=?", [newUsername], function(error, results, fields) {
                                    if (error) throw error;
                                    if (results.length > 0) {
                                        response.statusBadRequest("User with the provided username exists.")(res);
                                    } else {
                                        connection.query("INSERT INTO users VALUES(NULL, ?, ?, ?, ?, ?, ?, CURRENT_DATE())", [newUsername, newName, newContact, newUserType, newDistId, newToken], function(error, results, fields) {
                                            if (error) throw error;
        
                                            connection.query("SELECT user_id, username FROM users WHERE username=?", [newUsername], function(error, results, fields) {
                                                if (error) throw error;
        
                                                if (results.length === 1) {
                                                    const newUserId = results[0].user_id;
                                                    response.statusOK(results[0], res);
                                                } else {
                                                    console.log(`[${apiName}] insertion ${newUsername} queried, but cannot be found after inserted`);
                                                    response.statusBadRequest("Insertion passed but cannot be traced.")(res);
                                                }
                                                
                                            });
                                        });
                                    }
                                });

                            } else {
                                response.statusSessionExpired(res);
                            }
                        });
                    } else {
                        response.statusInvalidToken(res);
                    }

                } else {
                    response.statusForbidden(res);
                }
            });

            
        } else {
            response.statusNotFound(res);
        }
    });
};

exports.getWholeDatabase = function(req, res) {
    const apiName = "getWholeDatabase";
    const tokenBody = req.body.token;
    const userIdBody = req.body.user_id;

    // Step (1) Check if user exists
    connection.query("SELECT token, user_type FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {

            // Step (1.5a) Check if user_type has privilege to access this API
            const userType = results[0].user_type.toString();
            const tokenDbase = results[0].token;
            connection.query("SELECT getWholeDatabase as allowed_stat FROM user_privileges WHERE user_type=?", [userType], function(error, results, fields) {
                if (error) throw error;

                const allowed = results[0].allowed_stat;
                if (allowed) {

                    // Step (1.5b) Validate saved token and server's token
                    if (tokenDbase === tokenBody) {

                        // Step (2) Validate last login date difference with current date
                        connection.query("SELECT DATEDIFF(CURRENT_DATE(), last_login) as date_diff FROM users WHERE user_id=?", [userIdBody], function(error, results, fields) {
                            if (error) throw error;
                            const dateDifference = results[0].date_diff;
                            if (dateDifference <= 7) {
                                // Step (2.5) Every successful authentication, update last_login (functions as last access date)
                                connection.query("UPDATE users SET last_login=CURRENT_DATE() WHERE user_id=?", [userIdBody], function(error, results, fields) {
                                    if (error) throw error;
                                });
        
                                // Step (3) All things well, DO THE THING
                                
                                connection.query("SELECT * FROM dists", function(error, results, fields) {
                                    if (error) throw error;
                                    const resDists = results;
                                    connection.query("SELECT users.user_id, users.username, users.name, users.contact, users.user_type, users.dist_id, dists.name AS dist_name from users, dists WHERE users.dist_id = dists.dist_id ORDER BY users.user_id", function(error, results, fields) {
                                        if (error) throw error;
                                        const resUsers = results;
                                        connection.query("SELECT * FROM stores", function(error, results, fields) {
                                            if (error) throw error;
                                            const resStores = results;
                                            connection.query("SELECT * FROM user_types", function(error, results, fields) {
                                                if (error) throw error;
                                                const resUserTypes = results;

                                                const parsedData = {
                                                    dists: resDists,
                                                    users: resUsers,
                                                    stores: resStores,
                                                    user_types: resUserTypes
                                                };

                                                response.statusOK(parsedData, res);
                                            });
                                        });
                                    });
                                });

                                // end line for API action

                            } else {
                                response.statusSessionExpired(res);
                            }
                        });
                    } else {
                        response.statusInvalidToken(res);
                    }

                } else {
                    response.statusForbidden(res);
                }
            });

            
        } else {
            response.statusNotFound(res);
        }
    });
};