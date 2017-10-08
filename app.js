
const fs = require('fs');
const hummus = require('hummus');
const _ = require('lodash');
const extractText = require('./lib/text-extraction');


const pdfs = ['jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'august', 'september'];

function pdfParser(month) {
    let parsePages = (pdf) => {
        let fileToRun = `./input/${pdf}.pdf`;
        let pdfReader = hummus.createReader(fileToRun);
        let pagesPlacements = extractText(pdfReader);
        return pagesPlacements;
    }
    let pages = [];
    let parsedPages = parsePages(month);
    
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
                            let group = [];
                            group.push(first, second, item);
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
                let item = {
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
    
    let purchases = pages.filter(page => {
        let filtered = page.groups.filter((item, index, arr) =>{
            let text = item[0].text;
            let filter = (text.length != 5) ? false : true;
            return filter; 
        })
        if(filtered.length > 0) return filtered;
        else return false;
    })
    return purchases;
}

filterPurchases = (purchases, filter) => {
    let filteredPurchases = purchases.map(page => { 
        let filtered = page.groups.filter(items =>{
            let location = items[1].text;
            return (location.indexOf(filter) != -1) ? true : false;
        })
        return filtered;
    })
    return filteredPurchases;
}

newYorkCosts = (purchases) => {
    const newYorkFilter = ' NY';
    let newYorkPurchases = filterPurchases(purchases, newYorkFilter);
    let newYorkCost = 0;

    newYorkPurchases.forEach(page => { 
        page.forEach(items =>{
            const date = items[0].text;
            const loc = items[1].text;
            const cost = Number(items[2].text);
            console.log(`${date}  ${loc}  ${cost}`);
            newYorkCost += cost;
        })
    }) 
    console.log(`New York Cost: ${newYorkCost.toFixed(2)}`);
    return newYorkCost;

} 

amazonCosts = (purchases) => {
    const amazonFilter = 'AMAZON';
    let amazonPurchases = filterPurchases(purchases, amazonFilter);
    let amazonCost = 0;

    amazonPurchases.forEach(page => {
        page.forEach(items =>{
            const date = items[0].text;
            const loc = items[1].text;
            const cost = Number(items[2].text);
            console.log(`${date}  ${loc}  ${cost}`);
            amazonCost += cost;
        })
    })
    console.log(`Amazon Purchases: ${amazonCost.toFixed(2)}`)
    return amazonCost;
}



((pdfs) => {
    let totalCost = 0;
    let amazonTotal = 0;
    let newYorkTotal = 0;
    let totalMonths = 0;
    pdfs.forEach(month =>{
        const purchases = pdfParser(month)
        const newYorkCost = newYorkCosts(purchases);
        const amazonCost = amazonCosts(purchases);
        if (newYorkCost != 0) totalMonths +=1;
        amazonTotal += amazonCost;
        newYorkTotal += newYorkCost;
        totalCost += newYorkCost + amazonCost;
    })
    console.log(`New York Total: ${newYorkTotal.toFixed(2)}`);
    console.log(`Amazon Total: ${amazonTotal.toFixed(2)}`);
    console.log(`Total Cost: ${totalCost.toFixed(2)}`);
    console.log(`Average Cost Monthly: ${(totalCost.toFixed(2) /totalMonths).toFixed(2)}`);
})(pdfs);
