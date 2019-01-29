app.route.get('/dAppAddress', async function(req, cb){
    var dapp = await app.model.Dapp.findOne({});
    if(!dapp) return {
        message: "Address not generated yet",
        isSuccess: false
    }
    return {
        address: dapp.daddress,
        isSuccess: true
    }
});