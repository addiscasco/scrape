var makeDate = function () {
    var d = new Date();
    var formattedDate = "";
    // add month to the string, date, and full year
    formattedDate += (d.getMonth() + 1) + "_";
    formattedDate += d.getDate() + "_";
    formattedDate += d.getFullYear();
    return formattedDate;
};

module.exports = makeDate;