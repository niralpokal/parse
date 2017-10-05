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

let pages = parsePages();
pages[0].forEach((item)=>{
   console.log(item.text);
});
console.log(pages.length)


