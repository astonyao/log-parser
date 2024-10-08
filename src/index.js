const fs = require("fs");
const LogService = require("./services/logService");
const { logTopOccurrences } = require("./utils/logger");

const LOG_FILE_PATH = "src/logfile.log";

fs.readFile(LOG_FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Part 1: The number of unique IP addresses
  const uniqueIPCount = LogService.countUniqueIPsFromLogData(data);
  console.log(`Number of unique IP addresses: ${uniqueIPCount} \n`);

  // Part 2: The top 3 most visited URLs
  const topURLs = LogService.findTopURLs(data);
  logTopOccurrences("Most visited URLs", topURLs);

  // Part 3: The top 3 most active IP addresses
  const topIPs = LogService.findTopIPs(data);
  logTopOccurrences("Most active IP addresses", topIPs);
});
