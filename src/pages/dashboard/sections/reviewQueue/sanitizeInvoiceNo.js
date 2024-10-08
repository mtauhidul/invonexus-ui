export const sanitizeInvoiceNo = (invoiceNo) => {
  return invoiceNo.replace(/[^0-9]/g, '');
};
