
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (order) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  
  // Get fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Set up some variables for positioning
  const margin = 50;
  let y = page.getHeight() - margin;
  const lineHeight = 25;
  
  // Draw header
  page.drawText('INVOICE', {
    x: margin,
    y,
    size: 24,
    font: helveticaBold,
  });
  
  y -= 20;
  
  page.drawText(`Invoice #: ${order.id}`, {
    x: margin,
    y,
    size: 12,
    font: helveticaBold,
  });
  
  y -= lineHeight;
  
  page.drawText(`Date: ${new Date(order.created_at).toLocaleDateString()}`, {
    x: margin,
    y,
    size: 12,
    font: helvetica,
  });
  
  y -= lineHeight * 1.5;
  
  // Customer information
  page.drawText('Customer Information:', {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
  });
  
  y -= lineHeight;
  
  page.drawText(`Name: ${order.customer_name || 'Walk-in Customer'}`, {
    x: margin,
    y,
    size: 12,
    font: helvetica,
  });
  
  y -= lineHeight;
  
  if (order.email) {
    page.drawText(`Email: ${order.email}`, {
      x: margin,
      y,
      size: 12,
      font: helvetica,
    });
    y -= lineHeight;
  }
  
  if (order.phone) {
    page.drawText(`Phone: ${order.phone}`, {
      x: margin,
      y,
      size: 12,
      font: helvetica,
    });
    y -= lineHeight;
  }
  
  if (order.address) {
    page.drawText(`Address: ${order.address}`, {
      x: margin,
      y,
      size: 12,
      font: helvetica,
    });
    y -= lineHeight;
  }
  
  y -= lineHeight;
  
  // Items header
  page.drawText('Items:', {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
  });
  
  y -= lineHeight;
  
  // Table header
  const col1 = margin;
  const col2 = margin + 250;
  const col3 = margin + 350;
  const col4 = margin + 450;
  
  page.drawText('Product', {
    x: col1,
    y,
    size: 12,
    font: helveticaBold,
  });
  
  page.drawText('Qty', {
    x: col2,
    y,
    size: 12,
    font: helveticaBold,
  });
  
  page.drawText('Price', {
    x: col3,
    y,
    size: 12,
    font: helveticaBold,
  });
  
  page.drawText('Total', {
    x: col4,
    y,
    size: 12,
    font: helveticaBold,
  });
  
  y -= lineHeight;
  
  // Draw line
  page.drawLine({
    start: { x: margin, y },
    end: { x: page.getWidth() - margin, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight;
  
  // Items
 for (const item of order.items) {
  page.drawText(item.name, {
    x: col1,
    y,
    size: 12,
    font: helvetica,
  });

  page.drawText(item.quantity.toString(), {
    x: col2,
    y,
    size: 12,
    font: helvetica,
  });

  // FIX: Always convert to number before toFixed
 page.drawText(`Rs.${Number(item.price).toFixed(2)}`, {
  x: col3,
  y,
  size: 12,
  font: helvetica,
});

const total = Number(item.quantity) * Number(item.price);
page.drawText(`Rs.${total.toFixed(2)}`, {
  x: col4,
  y,
  size: 12,
  font: helvetica,
});

  y -= lineHeight;
}
  // Draw line
  page.drawLine({
    start: { x: margin, y },
    end: { x: page.getWidth() - margin, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight * 1.5;
  
  // Total
   page.drawText('Total Amount:', {
    x: col3 - 50,
    y,
    size: 14,
    font: helveticaBold,
  });

  // Fix: Ensure total_amount is a number
  const totalAmount = Number(order.total_amount) || 0;
page.drawText(`Rs.${totalAmount.toFixed(2)}`, {
  x: col4,
  y,
  size: 14,
  font: helveticaBold,
});
  y -= lineHeight * 3;
  
page.drawText('Your satisfaction is our priority. Visit us again soon!', {
  x: page.getWidth() / 2 - 130,
  y,
  size: 14,
  font: helveticaBold,
});
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  
  // Ensure the directory exists
  const dir = path.join(__dirname, '../invoices');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filePath = path.join(dir, `invoice_${order.id}.pdf`);
  fs.writeFileSync(filePath, pdfBytes);
  
  return filePath;
};

module.exports = generateInvoice;