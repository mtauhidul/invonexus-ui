export function convertMoneyAmount(amount) {
  // Now create a converter that will check if an money amount is string and have currency sign in front. If their is any currency sign it will be removed first then the amount will be converted to Number using javascript

  // Check if the amount is string
  if (typeof amount === 'string') {
    // Remove the currency sign
    amount = amount.replace(/[^0-9.]/g, '');

    // Convert the amount to Number
    amount = Number(amount);
  }

  // Check if the amount is number
  if (typeof amount === 'number') {
    // Check if the amount is not a number
    if (isNaN(amount)) {
      // Return 0 if the amount is not a number
      return 0;
    }

    // Return the amount if the amount is a number
    return amount;
  }
}
