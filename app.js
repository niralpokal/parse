const fs = require('fs');
const PDFParser = require('pdf2json');
let pdfParser = new PDFParser();

   pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
   pdfParser.on("pdfParser_dataReady", pdfData => {
       console.log(pdfData);
       fs.writeFile("./output/myFile.json", JSON.stringify(pdfData));
       console.log(pdfData);
   });

   pdfParser.loadPDF("./input/myFile.pdf");

