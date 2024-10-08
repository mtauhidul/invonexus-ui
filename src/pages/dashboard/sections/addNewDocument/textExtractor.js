// import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// export async function extractText(file) {
//   console.log('file', file);
//   return new Promise((resolve, reject) => {
//     if (!file || file.type !== 'application/pdf') {
//       reject('Invalid PDF file');
//     }

//     const reader = new FileReader();

//     reader.onload = async function () {
//       try {
//         const pdfData = reader.result;
//         const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
//         const numPages = pdf.numPages;
//         const textContent = [];

//         for (let pageNum = 1; pageNum <= numPages; pageNum++) {
//           const page = await pdf.getPage(pageNum);
//           const pageText = await page.getTextContent();
//           const pageTextArray = pageText.items.map((item) => item.str);
//           textContent.push(pageTextArray.join(' '));
//         }

//         const pdfText = textContent.join('\n');
//         resolve(pdfText);
//       } catch (error) {
//         reject(error);
//       }
//     };

//     reader.onerror = function () {
//       reject('Error reading PDF file');
//     };

//     reader.readAsArrayBuffer(file);
//   });
// }
