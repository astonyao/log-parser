// Helper function to log the top occurrences
function logTopOccurrences(label, occurrences) {
  console.log(`${label}:`);
  occurrences.forEach(([item, count], index) => {
    console.log(`${index + 1}. ${item} (${count} times)`);
  });
  console.log("\n");
}

module.exports = {
  logTopOccurrences,
};
