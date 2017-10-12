const hummus = require('hummus');
const _ = require('lodash');
const extractText = require('./lib/text-extraction');

const pdfs = ['jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'august', 'september'];

function pdfParser(month) {
    const parsePages = (pdf) => {
        const fileToRun = `./input/${pdf}.pdf`;
        const pdfReader = hummus.createReader(fileToRun);
        return pagesPlacements = extractText(pdfReader);
    }
    let pages = [];
    const parsedPages = parsePages(month);
    parsedPages.forEach((page, pageIndex) => {
        let groups = [];
        if(page.length > 0){
            let first = page.shift();
            first.row = getRow(first);
            let second = undefined;
            page.forEach((item)=>{
                if(item) {
                    item.row = getRow(item)
                    if (item.row == first.row) {
                        if(second == undefined) second = item;
                        else if(second.row == item.row){
                            const group = [first, second, item];
                            groups.push(group);
                            second = undefined;
                        }
                    } else {
                        first = item;
                        second = undefined;
                    }
                }
            })
            if (groups.length > 0){
                const item = {
                    page: pageIndex,
                    groups
                };
                pages.push(item)
            }
        }
    })
    
    function getRow(item){
        const matrix = item.matrix;
        return matrix.pop();
    }
    
    return purchases = _.map(pages, page => {
        const filtered = _.filter(page.groups, (item, index, arr) =>{
            const text = item[0].text;
            const filtered = (text.length != 5) ? false : true;
            return filtered; 
        })
        if(filtered.length > 0) return filtered;
    })
}

const filterPurchases = (purchases, filter = '') => {
    const filteredPurchases = _.map(purchases, page => { 
        const filtered = _.filter(page, items =>{
            const location = items[1].text;
            return (location.indexOf(filter) != -1) ? true : false;
        })
        return filtered;
    })
    return filtered = _.flatten(filteredPurchases);
}

const calcCosts = (purchases) => {
    let total = 0;
    if (purchases.length !=0) {
        total =  _.reduce(purchases, (sum, items) =>{
            let cost = Number(items[2].text);
            const text = items[1].text;
            if (Math.sign(cost) == -1) cost = filterPayments(text, cost);
            if (isNaN(cost)) cost = 0;
            return sum += cost;
        },total)   
    }
    return total;
}

const filterPayments = (item, cost) =>{
    const text = item.toUpperCase();
    if (text.indexOf('PAYMENT') != -1) return cost;
    else return 0;
}

((pdfs) => {
    let totalCost = 0;
    let amazonTotal = 0;
    let newYorkTotal = 0;
    let totalMonths = 0;
    let filteredCost = 0;
    let caliTotal = 0;
    let newYorkMonths = 0;
    pdfs.forEach(month =>{
        const purchases = pdfParser(month)
        const newYorkPurchases = filterPurchases(purchases, ' NY');
        const amazonPurchases = filterPurchases(purchases, 'AMAZON');
        const caliPurchases = filterPurchases(purchases, ' CA');
        const totalPurchases = filterPurchases(purchases);
        const newYorkCost = calcCosts(newYorkPurchases);
        const amazonCost = calcCosts(amazonPurchases);
        const purchaseCost = calcCosts(totalPurchases);
        const caliCost = calcCosts(caliPurchases);
        totalMonths += 1;
        if(newYorkPurchases.length == 0) newYorkMonths += 1;
        amazonTotal += amazonCost;
        newYorkTotal += newYorkCost;
        caliTotal += caliCost;
        filteredCost += newYorkCost + amazonCost;
        totalCost += purchaseCost;
    })
    console.log(`New York Total: ${newYorkTotal.toFixed(2)}`);
    console.log(`Amazon Total: ${amazonTotal.toFixed(2)}`);
    console.log(`Amazon + New York Cost: ${filteredCost.toFixed(2)}`)
    console.log(`California Total: ${caliTotal.toFixed(2)}`)
    console.log(`Total Cost: ${totalCost.toFixed(2)}`);
    console.log(`Average Cost Monthly: ${(totalCost.toFixed(2) /totalMonths).toFixed(2)}`);
    console.log(`Average Cali Cost Monthly: ${(caliTotal.toFixed(2) /totalMonths).toFixed(2)}`);
    console.log(`Average New York Cost Monthly: ${(filteredCost.toFixed(2) /newYorkMonths).toFixed(2)}`);
})(pdfs);