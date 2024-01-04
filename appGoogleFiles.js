const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const PDFParser = require("pdf-parse");

async function fetchPdfFromDrive(url) {
  const fileId = url.match(/[-\w]{25,}/);
  if (!fileId) {
    throw new Error("Invalid Google Drive URL");
  }

  const response = await axios.get(`https://drive.google.com/uc?id=${fileId[0]}`, {
    responseType: 'arraybuffer',
  });

  return new Uint8Array(response.data);
}

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
  const pdfUrl1 = "https://drive.google.com/file/d/1n6_U5qB3P52qctWX4pMJgnjSyquEIcar";
//   const pdfUrl2 = "https://drive.google.com/file/d/1n6_U5qB3P52qctWX4pMJgnjSyquEIcar";
  const pdfUrl2 = "https://drive.google.com/file/d/1k4Oso_aULBRMRTXRVwqU_Bk3K4P7c_u1";

  try {
    const pdf1 = await fetchPdfFromDrive(pdfUrl1);
    const pdf2 = await fetchPdfFromDrive(pdfUrl2);

    let resp = await comparePDFs(pdf1, pdf2);
    if (resp) console.log("Difference in lines:", resp);
  } catch (error) {
    console.error("Error fetching or reading PDF files:", error.message);
  }
}

main();

app.listen(3000, () => console.log("Server started on port 3000"));
