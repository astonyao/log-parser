// Extract IP address from a log line
function extractIPFromLogLine(line) {
  let parts;

  if (line === "") return null;
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

// Extract URL from a log line
function extractURLFromLogLine(line) {
  const getIndex = line.indexOf("GET ");
  const httpIndex = line.indexOf(" HTTP/");

  if (getIndex !== -1 && httpIndex !== -1) {
    return line.substring(getIndex + 4, httpIndex).trim();
  }

  return null;
}

module.exports = {
  extractIPFromLogLine,
  extractURLFromLogLine,
};
