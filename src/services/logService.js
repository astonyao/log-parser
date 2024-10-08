const {
  extractIPFromLogLine,
  extractURLFromLogLine,
} = require("../utils/extractor");

function countUniqueIPsFromLogData(data) {
  const logLines = data.split("\n");
  const uniqueIPs = new Set();

  logLines.forEach((line) => {
    if (line.trim() === "") return; // skip empty lines
    const ip = extractIPFromLogLine(line.trim());
    if (ip) {
      uniqueIPs.add(ip);
    }
  });

  return uniqueIPs.size;
}

// generic function to count occurrences
function findTopOccurrences(data, extractorFunction, topN = 3) {
  const logLines = data.split("\n");
  const counts = new Map();

  logLines.forEach((line) => {
    const value = extractorFunction(line.trim()); // Can be IP or URL
    if (value) {
      counts.set(value, (counts.get(value) || 0) + 1); // Increase existing counter or set new counter
    }
  });

  // Sort entries by count in descending order and return the top N results
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN);
}

function findTopIPs(data) {
  return findTopOccurrences(data, extractIPFromLogLine);
}

function findTopURLs(data) {
  return findTopOccurrences(data, extractURLFromLogLine);
}

module.exports = {
  countUniqueIPsFromLogData,
  findTopIPs,
  findTopURLs,
  findTopOccurrences,
};
