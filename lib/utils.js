exports.capitalizeWords = (words) => {
  words = words.split(/[_-]/);

  return words
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
};
