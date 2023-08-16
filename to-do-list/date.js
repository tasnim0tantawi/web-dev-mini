// console.log(module);
// This exports the getDate function to the app.js file or whatever file requires date.js
module.exports.getDate = function() {
    let today = new Date();
// let day = days[today.getDay()];
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    let day = today.toLocaleDateString('en-US', options);
    return day;
}


module.exports.getDay = function() {
    let today = new Date();
// let day = days[today.getDay()];
    let options = {
        weekday: 'long',
    };
    let day = today.toLocaleDateString('en-US', options);
    return day;
}
