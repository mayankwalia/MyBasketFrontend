// Converts date string to a readable format
export function formatDateTime(datetimeString) {
  const date = new Date(datetimeString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// Return image file from base64 string
// Return default image path if there's no image data
export function imageFromBase64String(image_file) {
  if (image_file && typeof image_file === 'string') {
    return `data:image/png;base64,${image_file.slice(2, -1)}`;
  }
  return '../assets/images/logo2.png'
}