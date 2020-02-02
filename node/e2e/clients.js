"use strict";
exports.__esModule = true;
process.env.DEBUG = 'simple-peer';
var Client_1 = require("../classes/Client");
var params_1 = require("./lib/params");
var genNow_1 = require("../utils/genNow");
var clients = [];
var partySummaries = [];
var startedAt = genNow_1.genNow();
setInterval(function () {
    console.log("[ellapsed: " + (genNow_1.genNow() - startedAt) + "]");
}, 1000);
var _loop_1 = function (i) {
    var client = new Client_1.Client({
        signalingServerUrls: params_1.signalingServerUrls,
        maxFriendshipsCount: params_1.maxFriendshipsCount,
        bootstrapOffersTimeout: i % 2 ? 0 : 5,
        maxOfferAttemptsCount: 5
    });
    clients.push(client);
    client.partySummarySnowdrop.addHandle(function (partySummary) {
        partySummaries[i] = partySummary;
        // console.log(
        //   util.inspect(
        //     partySummaries.map(() => {
        //       return partySummary.toJsonable()
        //     }),
        //     { showHidden: false, depth: null }
        //   )
        // )
    });
};
// test('create clients', () => {
for (var i = 0; i < params_1.clientsCount; i++) {
    _loop_1(i);
}
// })
// test('await fullyConnected', async () => {
//   await Promise.all(clients.map((client) => {
//     return client.awaitMaxFriendshipsConnected()
//   }))
// }, 100000)
