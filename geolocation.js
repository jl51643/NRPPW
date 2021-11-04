
const position = {
    latitude: null,
    longitude: null
}

module.exports = function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                position.latitude = position.coords.latitude;
                position.longitude = position.coords.longitude;
            },
            () => {

            }
        )
    }

    return position
};

