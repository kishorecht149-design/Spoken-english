import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function createCertificatePdf({
  learnerName,
  courseTitle
}: {
  learnerName: string;
  courseTitle: string;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 25,
    y: 25,
    width: 792,
    height: 545,
    borderWidth: 4,
    borderColor: rgb(0.05, 0.28, 0.42)
  });

  page.drawText("Certificate of Completion", {
    x: 210,
    y: 470,
    size: 28,
    font,
    color: rgb(0.05, 0.28, 0.42)
  });

  page.drawText(learnerName, {
    x: 250,
    y: 360,
    size: 24,
    font,
    color: rgb(0.1, 0.1, 0.12)
  });

  page.drawText(`has successfully completed ${courseTitle}`, {
    x: 215,
    y: 300,
    size: 18,
    font: bodyFont,
    color: rgb(0.25, 0.25, 0.3)
  });

  return pdf.save();
}
