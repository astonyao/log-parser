const fs = require("fs");

function extractIPFromLogLine(line) {
  let parts;

  if (line === "") return;
  // assumption: lines can be split by ' - -' or ' - admin'
  if (line.includes(" - -")) {
    parts = line.split(" - -");
  } else if (line.includes(" - admin")) {
    parts = line.split(" - admin");
  } else {
    console.warn(`Invalid log format: ${line}`);
    return null;
  }

  return parts[0].trim();
}

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

function extractURLFromLogLine(line) {
  const urlMatch = line.match(/"GET (.*?) HTTP/); // assumption: URL exists between "GET " and " HTTP"
  return urlMatch ? urlMatch[1] : null;
}

function findTopVisitedURLs(data) {
  const logLines = data.split("\n");
  const urlCounts = new Map();

  logLines.forEach((line) => {
    const url = extractURLFromLogLine(line.trim());
    if (url) {
      if (urlCounts.has(url)) {
        urlCounts.set(url, urlCounts.get(url) + 1);
      } else {
        urlCounts.set(url, 1);
      }
    }
  });

  const sortedURLs = [...urlCounts.entries()].sort((a, b) => b[1] - a[1]);

  return sortedURLs.slice(0, 3);
}

function findTopActiveIPs(data) {
  const logLines = data.split("\n");
  const ipCounts = new Map();

  logLines.forEach((line) => {
    const ip = extractIPFromLogLine(line.trim());
    if (ip) {
      if (ipCounts.has(ip)) {
        ipCounts.set(ip, ipCounts.get(ip) + 1);
      } else {
        ipCounts.set(ip, 1);
      }
    }
  });

  const sortedIPs = [...ipCounts.entries()].sort((a, b) => b[1] - a[1]);

  return sortedIPs.slice(0, 3);
}

// Read the log file and process the log data
const LOG_FILE_PATH = "src/logfile.log";
fs.readFile(LOG_FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const uniqueIPCount = countUniqueIPsFromLogData(data);
  console.log(`Number of unique IP addresses: ${uniqueIPCount}`);

  console.log("\n");

  const topURLs = findTopVisitedURLs(data);
  console.log("Top 3 most visited URLs:");
  topURLs.forEach(([url, count], index) => {
    console.log(`${index + 1}. ${url} (visited ${count} times)`);
  });

  console.log("\n");

  const topIPs = findTopActiveIPs(data);
  console.log("Top 3 most active IP addresses:");
  topIPs.forEach(([ip, count], index) => {
    console.log(`${index + 1}. ${ip} (appeared ${count} times)`);
  });
});
