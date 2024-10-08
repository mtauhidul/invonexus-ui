export function dateConverter(inputDate) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // First, try to parse the input date as is
  let dateObj = new Date(inputDate);

  // If the parsing fails, try parsing with different formats
  if (isNaN(dateObj)) {
    const parts = inputDate.split(/[\/\-]/);
    const day = parseInt(parts[1]);
    const month = parseInt(parts[0]) - 1;
    const year = parseInt(parts[2]);

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      dateObj = new Date(year, month, day);
    }
  }

  if (!isNaN(dateObj)) {
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  } else {
    return 'Invalid Date';
  }
}
