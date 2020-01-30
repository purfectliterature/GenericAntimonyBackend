/*
routes.js
Declares endpoints (routes).
*/

function routes(app) {
    const controller = require("./controller");

    // Declare routes here.
    app.route("/api").get(controller.index);
    app.route("/api/login").post(controller.login);
    app.route("/api/getUserProfile").post(controller.getUserProfile);
    app.route("/api/getStores").post(controller.getStores);
    app.route("/api/getDistributor").post(controller.getDistributor);
    app.route("/api/getProductsfromStoreId").post(controller.getProductsfromStoreId);

    app.route("/api/insertUser").post(controller.insertUser);
    app.route("/api/getWholeDatabase").post(controller.getWholeDatabase);
};

module.exports = routes;