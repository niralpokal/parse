var hummus = require('hummus');
var _ = require('lodash');
var extractText = require('./lib/text-extraction');
var pdfs = ['jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'august', 'september'];
var pdfParser = function (month) {
    var parsePages = function (pdf) {
        var fileToRun = "./input/" + pdf + ".pdf";
        var pdfReader = hummus.createReader(fileToRun);
        return extractText(pdfReader);
    };
    var pages = [];
    var parsedPages = parsePages(month);
    parsedPages.forEach(function (page, pageIndex) {
        var groups = [];
        if (page.length > 0) {
            var first_1 = page.shift();
            first_1.row = getRow(first_1);
            var second_1 = undefined;
            page.forEach(function (item) {
                if (item) {
                    item.row = getRow(item);
                    if (item.row == first_1.row) {
                        if (second_1 == undefined)
                            second_1 = item;
                        else if (second_1.row == item.row) {
                            var group = [first_1, second_1, item];
                            groups.push(group);
                            second_1 = undefined;
                        }
                    }
                    else {
                        first_1 = item;
                        second_1 = undefined;
                    }
                }
            });
            if (groups.length > 0) {
                var item = {
                    page: pageIndex,
                    groups: groups
                };
                pages.push(item);
            }
        }
    });
    function getRow(item) {
        var matrix = item.matrix;
        return matrix.pop();
    }
    return _.map(pages, function (page) {
        var filtered = _.filter(page.groups, function (item, index, arr) {
            var text = item[0].text;
            var filtered = (text.length != 5) ? false : true;
            return filtered;
        });
        if (filtered.length > 0)
            return filtered;
    });
};
var filterPurchases = function (purchases, filter) {
    if (filter === void 0) { filter = ''; }
    var filteredPurchases = _.map(purchases, function (page) {
        var filtered = _.filter(page, function (items) {
            var location = items[1].text;
            return (location.indexOf(filter) != -1) ? true : false;
        });
        return filtered;
    });
    return _.flatten(filteredPurchases);
};
var calcCosts = function (purchases) {
    var total = 0;
    if (purchases.length != 0) {
        total = _.reduce(purchases, function (sum, items) {
            var cost = Number(items[2].text);
            var text = items[1].text;
            if (Math.sign(cost) == -1)
                cost = filterPayments(text, cost);
            if (isNaN(cost))
                cost = 0;
            return sum += cost;
        }, total);
    }
    return total;
};
var filterPayments = function (item, cost) {
    var text = item.toUpperCase();
    if (text.indexOf('PAYMENT') != -1)
        return cost;
    else
        return 0;
};
(function (pdfs) {
    var totalCost = 0;
    var amazonTotal = 0;
    var newYorkTotal = 0;
    var totalMonths = 0;
    var filteredCost = 0;
    var caliTotal = 0;
    var newYorkMonths = 0;
    pdfs.forEach(function (month) {
        var purchases = pdfParser(month);
        var newYorkPurchases = filterPurchases(purchases, ' NY');
        var amazonPurchases = filterPurchases(purchases, 'AMAZON');
        var caliPurchases = filterPurchases(purchases, ' CA');
        var totalPurchases = filterPurchases(purchases);
        var newYorkCost = calcCosts(newYorkPurchases);
        var amazonCost = calcCosts(amazonPurchases);
        var purchaseCost = calcCosts(totalPurchases);
        var caliCost = calcCosts(caliPurchases);
        totalMonths += 1;
        if (newYorkPurchases.length == 0)
            newYorkMonths += 1;
        amazonTotal += amazonCost;
        newYorkTotal += newYorkCost;
        caliTotal += caliCost;
        filteredCost += newYorkCost + amazonCost;
        totalCost += purchaseCost;
    });
    console.log("New York Total: " + newYorkTotal.toFixed(2));
    console.log("Amazon Total: " + amazonTotal.toFixed(2));
    console.log("Amazon + New York Cost: " + filteredCost.toFixed(2));
    console.log("California Total: " + caliTotal.toFixed(2));
    console.log("Total Cost: " + totalCost.toFixed(2));
    console.log("Average Cost Monthly: " + (totalCost / totalMonths).toFixed(2));
    console.log("Average Cali Cost Monthly: " + (caliTotal / totalMonths).toFixed(2));
    console.log("Average New York Cost Monthly: " + (filteredCost / newYorkMonths).toFixed(2));
})(pdfs);
