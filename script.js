const upload = document.getElementById('upload');
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const addTextBtn = document.getElementById('addTextBtn');
const saveBtn = document.getElementById('saveBtn');
const textInput = document.getElementById('textInput');

let pdfDoc = null;
let pdfBytes = null;
let editedPdfDoc = null;

upload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const arrayBuffer = await file.arrayBuffer();
  pdfBytes = arrayBuffer;

  // Show using PDF.js
  const loadingTask = pdfjsLib.getDocument(arrayBuffer);
  pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: ctx, viewport }).promise;

  // Load using PDF-lib
  editedPdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
});

addTextBtn.addEventListener('click', async () => {
  if (!editedPdfDoc) return alert("Please upload a PDF first.");

  const page = editedPdfDoc.getPage(0);
  const text = textInput.value || "Sample Text";
  page.drawText(text, {
    x: 50,
    y: 700,
    size: 24,
    color: PDFLib.rgb(0, 0, 0),
  });

  alert("Text added! Click 'Save as New PDF' to download.");
});

saveBtn.addEventListener('click', async () => {
  if (!editedPdfDoc) return alert("Nothing to save.");

  const newPdfBytes = await editedPdfDoc.save();
  const blob = new Blob([newPdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "edited.pdf";
  link.click();
});
