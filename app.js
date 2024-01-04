const express = require("express");
const app = express();

const fs = require("fs");
const PDFParser = require("pdf-parse");

async function parsePdf(pdfData) {
  const data = await PDFParser(pdfData);
  return data.text;
}

async function comparePDFs(pdf1, pdf2) {
  const text1 = await parsePdf(pdf1);
  const text2 = await parsePdf(pdf2);

  if (text1 === text2) {
    console.log("Files are identical");
  } else {
    console.log("Files are different");
    console.log("Difference of lines:");
    return printDifference(text1, text2);
  }
}

function printDifference(text1, text2) {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  let diffLinesArray = [];

  for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
    if (lines1[i] !== lines2[i]) {
      // console.log(`Line ${i + 1}:`);
      // console.log(`  File 1: ${lines1[i]}`);
      // console.log(`  File 2: ${lines2[i]}`);
      diffLinesArray.push({
        lines: `Line ${i + 1}`,
        file1: lines1[i],
        file2: lines2[i],
      });
    }
  }
  return diffLinesArray;
}

async function main() {
  const pdfPath1 = "./assets/1.pdf";
  const pdfPath2 = "./assets/2.pdf";

  try {
    const pdf1 = fs.readFileSync(pdfPath1);
    const pdf2 = fs.readFileSync(pdfPath2);

    let resp = await comparePDFs(pdf1, pdf2);
   if(resp)  console.log("resp", resp);
  } catch (error) {
    console.error("Error reading PDF files:", error.message);
  }
}

main();

app.listen(3000, () => console.log("Server started on port 3000"));
