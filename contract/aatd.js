var request = require('request');
var config = require('../config');
var Cryptr = require('cryptr');

module.exports = {

    generateOneTimeDAppAddress: async function(countryCode){

        if(this.trs.senderId !== config.owner) return "You are not the owner";

        var check = await app.model.Dapp.findAll({});

        if(check.length) return "Address already generated";

        var wallet = await new Promise((resolve, reject) => {
            request({
                method: 'GET',
                url: 'https://localhost:9305/api/accounts/new?countryCode=' + countryCode, 
                function (error, response, body) {
                    if(error) reject(error)
                    resolve(JSON.parse(body));
                }
            }
                );
        });

        if(!wallet) return "No response";
        if(!wallet.success) return "not successful";

        var cryptr = new Cryptr(config.key);
        const encryptedString = cryptr.encrypt(wallet.secret);
        // const decryptedString = cryptr.decrypt(encryptedString);

        app.sdb.create('dapp', {
            daddress: wallet.address,
            secret: encryptedString
        });
    },

    transfer: async function(to, amount){
        
        // Burn amount from this.trs.senderId wallet in this dapp

        var encryptedSecret = await app.model.Dapp.findOne({});
        if(!encryptedSecret) return "Address not generated yet for the dapp";

        var cryptr = new Cryptr(config.key);

        var transaction = await new Promise((resolve, reject) => {
            request({
                method: 'PUT',
                url: 'http://localhost:9305/api/dapps/276da0d4342cf5e121683cb7b6a03ad0f28390e5528195e8f394f57b42226ed7/transactions/unsigned',
                body: JSON.stringify({
                    args: JSON.stringify([this.trs.senderId, to, amount]),
                    type: 1001,
                    fee: "0",
                    secret: cryptr.decrypt(encryptedSecret.secret)
                }),
                function (error, response, body) {
                    if(error) reject(error)
                    resolve(JSON.parse(body));
                }
            }
                );
        });
        if(!transaction) return "No response from transaction";
        if(!transaction.success) return transaction.error;
    }
}