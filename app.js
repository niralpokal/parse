const fs = require('fs');
const hummus = require('hummus');
const _ = require('lodash');
const extractText = require('./lib/text-extraction');


let pdfs = ['jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'august', 'september'];


let parsePages = (pdf) => {
    let fileToRun = `./input/${pdf}.pdf`;
    console.log(fileToRun);
    let pdfReader = hummus.createReader(fileToRun);
    let pagesPlacements = extractText(pdfReader);
    return pagesPlacements;
}
let month = pdfs[8]
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

let purchases = [];
pages.forEach(page => {
    let filtered = page.groups.filter((item, index, arr) =>{
        let text = item[0].text;
        let filter = (text.length != 5) ? false : true;
        return filter; 
    })
    if(filtered.length > 0) purchases.push(filtered);
})
let newYorkPurchases = [];
let amazonPurchases = [];
purchases.forEach(page => {
    let newYork = page.filter(items =>{
        let location = items[1].text;
        return (location.indexOf(' NY') != -1) ? true : false;
    })
    let amazon = page.filter(items => {
        let location = items[1].text;
        return (location.indexOf('AMAZON') != -1) ? true : false;
    })
    newYorkPurchases.push(newYork);
    amazonPurchases.push(amazon);
})

let newYorkCost = 0;
let amazonCost = 0;
newYorkPurchases.forEach(page => {
    page.forEach(items =>{
        const date = items[0].text;
        const loc = items[1].text;
        const cost = Number(items[2].text);
        console.log(`${date}  ${loc}  ${cost}`);
        newYorkCost += cost;
    })
})

amazonPurchases.forEach(page => {
    page.forEach(items =>{
        const date = items[0].text;
        const loc = items[1].text;
        const cost = Number(items[2].text);
        console.log(`${date}  ${loc}  ${cost}`);
        amazonCost += cost;
    })
})

console.log(`New York Cost: ${newYorkCost.toFixed(2)}`);
console.log(`Amazon Purchases: ${amazonCost.toFixed(2)}`)
let totalCost = newYorkCost + amazonCost;
console.log(`Total Cost: ${totalCost.toFixed(2)}`)
