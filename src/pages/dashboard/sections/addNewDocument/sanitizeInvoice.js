export const sanitizeInvoice = (res) => {
  console.log('Raw Invoice: ', res);
  const stringText = res;

  const jsonStart = stringText.indexOf('{');
  const jsonEnd = stringText.lastIndexOf('}') + 1; // Increment the end index by 1

  const jsonString = stringText.substring(jsonStart, jsonEnd);

  const invoice = JSON.parse(jsonString);

  const document = {
    vendorName: invoice?.vendorName,
    vendorAddress: invoice?.vendorAddress,
    invoiceNumber: invoice?.invoiceNumber,
    invoiceDate: invoice?.invoiceDate,
    dueDate: invoice?.dueDate,
    lineItems: invoice?.lineItems,
    subtotal: invoice?.subtotal,
    tax: invoice?.tax,
    discount: invoice?.discount,
    totalAmount: invoice?.totalAmount,
    bankName: invoice?.bankName,
    bankAccountNumber: invoice?.bankAccountNumber,
    contactInformation: invoice?.contactInformation,
  };

  // console.log('Sanitized Invoice: ', document);

  return document;
};
