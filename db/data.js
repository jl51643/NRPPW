module.exports.data = function initData() {
    const data = []

    data.unshift({
        user: "homer.simpson@mailinator.com",
        latitude : "45.79969",
        longitude : "15.9486",
        date: "2021-11-06T10:00:00.00Z"
    })

    data.unshift({
        user: "peter.griffin@mailinator.com",
        latitude : "45.788686",
        longitude : "15.89999",
        date: "2021-11-06T11:00:00.00Z"
    })

    data.unshift({
        user: "fred.flinstone@mailinator.com",
        latitude : "45.794696",
        longitude : "15.95564",
        date: "2021-11-06T12:00:00.00Z"
    })

    data.unshift({
        user: "johnny.bravo@mailinator.com",
        latitude : "45.784795",
        longitude : "15.96485",
        date: "2021-11-06T13:00:00.00Z"
    })

    data.unshift({
        user: "eric.cartman@mailinator.com",
        latitude : "45.80",
        longitude : "16.0",
        date: "2021-11-06T14:00:00.00Z"
    })
    return data
}