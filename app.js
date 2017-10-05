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
let groups = [];
let first = pages[0].shift();
first.row = getRow(first);
let second = undefined;
pages[0].forEach((obj)=>{
    obj.row = getRow(obj)
    if (obj.row == first.row) {
        if(second == undefined) second = obj;
        else if(second.row == obj.row){
        let group = [];
        group.push(first, second, obj);
        groups.push(group);
        second = undefined;
        }
    } else {
        first = obj;
        second = undefined;
    }
})


function getRow(item){
    const matrix = item.matrix;
    return matrix.pop();
}
groups.forEach((group)=>{
    let text ='';
    group.forEach((item)=>{
        text = text + item.text + ' ';
    })
    console.log(text); 
})



