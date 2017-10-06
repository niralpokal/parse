const fs = require('fs');
const hummus = require('hummus');
const _ = require('lodash');
const extractText = require('./lib/text-extraction');

let parsePages = () => {
    let fileToRun = './input/myFile.pdf';
    let pdfReader = hummus.createReader(fileToRun);
    let pagesPlacements = extractText(pdfReader);
    return pagesPlacements;
}
let pages = [];
let parsedPages = parsePages();
parsedPages.forEach((page, pageIndex) => {
    let groups = [];
    if(page.length >0){
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
console.log(pages);
