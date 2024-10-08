const {
  countUniqueIPsFromLogData,
  findTopIPs,
  findTopURLs,
  findTopOccurrences,
} = require("./logService");

describe("logService", () => {
  describe("countUniqueIPsFromLogData", () => {
    test("should return the correct number of unique IP addresses", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /page1 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "GET /page2 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.1 - - [10/Jul/2018:22:23:28 +0200] "GET /page3 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:24:28 +0200] "GET /page4 HTTP/1.1" 200 3574 "-" "User-Agent"
      `;
      const uniqueIPCount = countUniqueIPsFromLogData(logData);
      expect(uniqueIPCount).toBe(3);
    });

    test("should return zero for empty log data", () => {
      const logData = "";
      const uniqueIPCount = countUniqueIPsFromLogData(logData);
      expect(uniqueIPCount).toBe(0);
    });

    test("should handle log data with invalid lines", () => {
      const logData = `
        Invalid log line
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /page1 HTTP/1.1" 200 3574 "-" "User-Agent"
        Another invalid line
      `;
      const uniqueIPCount = countUniqueIPsFromLogData(logData);
      expect(uniqueIPCount).toBe(1);
    });
  });

  describe("findTopIPs", () => {
    test("should return the top active IP addresses", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /page1 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "GET /page2 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.1 - - [10/Jul/2018:22:23:28 +0200] "GET /page3 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:24:28 +0200] "GET /page4 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:25:28 +0200] "GET /page5 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.1 - - [10/Jul/2018:22:26:28 +0200] "GET /page6 HTTP/1.1" 200 3574 "-" "User-Agent"
      `;
      const topIPs = findTopIPs(logData);
      expect(topIPs).toEqual([
        ["192.168.1.1", 3],
        ["192.168.1.2", 2],
        ["192.168.1.3", 1],
      ]);
    });

    test("should handle ties correctly", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /page1 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "GET /page2 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:23:28 +0200] "GET /page3 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.4 - - [10/Jul/2018:22:24:28 +0200] "GET /page4 HTTP/1.1" 200 3574 "-" "User-Agent"
      `;
      const topIPs = findTopIPs(logData);
      expect(topIPs).toEqual([
        ["192.168.1.1", 1],
        ["192.168.1.2", 1],
        ["192.168.1.3", 1],
      ]);
    });

    test("should return an empty array for empty log data", () => {
      const logData = "";
      const topIPs = findTopIPs(logData);
      expect(topIPs).toEqual([]);
    });
  });

  describe("findTopURLs", () => {
    test("should return the top visited URLs", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /home HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "GET /about HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:23:28 +0200] "GET /contact HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.1 - - [10/Jul/2018:22:24:28 +0200] "GET /home HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:25:28 +0200] "GET /home HTTP/1.1" 200 3574 "-" "User-Agent"
      `;
      const topURLs = findTopURLs(logData);
      expect(topURLs).toEqual([
        ["/home", 3],
        ["/about", 1],
        ["/contact", 1],
      ]);
    });

    test("should handle full URLs in requests", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET http://example.com/home HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "GET http://example.com/about HTTP/1.1" 200 3574 "-" "User-Agent"
      `;
      const topURLs = findTopURLs(logData);
      expect(topURLs).toEqual([
        ["http://example.com/home", 1],
        ["http://example.com/about", 1],
      ]);
    });

    test("should return an empty array for empty log data", () => {
      const logData = "";
      const topURLs = findTopURLs(logData);
      expect(topURLs).toEqual([]);
    });
  });

  describe("findTopOccurrences", () => {
    // function to extract status code from log lines. assuming status code is the only 3 digit number
    const extractStatusCode = (line) => {
      const match = line.match(/"[^"]*" (\d{3})/);
      return match ? match[1] : null;
    };

    test("should return top 3 occurrences of status codes", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /page1 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "POST /submit HTTP/1.1" 200 0 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:23:28 +0200] "GET /page2 HTTP/1.1" 404 0 "-" "User-Agent"
        192.168.1.4 - - [10/Jul/2018:22:24:28 +0200] "GET /page3 HTTP/1.1" 302 0 "-" "User-Agent"
        192.168.1.5 - - [10/Jul/2018:22:25:28 +0200] "PUT /update HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.6 - - [10/Jul/2018:22:26:28 +0200] "POST /submit HTTP/1.1" 302 0 "-" "User-Agent"
      `;

      const topOccurrences = findTopOccurrences(logData, extractStatusCode);

      expect(topOccurrences).toEqual([
        ["200", 3],
        ["302", 2],
        ["404", 1],
      ]);
    });

    test("should return an empty array for empty log data", () => {
      const logData = "";
      const topOccurrences = findTopOccurrences(logData, extractStatusCode);
      expect(topOccurrences).toEqual([]);
    });

    test("should handle invalid log lines", () => {
      const logData = `
        Invalid log line
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /home HTTP/1.1" 200 3574 "-" "User-Agent"
        Another invalid line
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "POST /submit HTTP/1.1" 500 0 "-" "User-Agent"
      `;
      const topOccurrences = findTopOccurrences(logData, extractStatusCode);

      expect(topOccurrences).toEqual([
        ["200", 1],
        ["500", 1],
      ]);
    });

    test("should return top N occurrences when topN is specified", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /page1 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "POST /submit HTTP/1.1" 302 0 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:23:28 +0200] "GET /page2 HTTP/1.1" 404 0 "-" "User-Agent"
        192.168.1.4 - - [10/Jul/2018:22:24:28 +0200] "GET /page3 HTTP/1.1" 500 0 "-" "User-Agent"
        192.168.1.5 - - [10/Jul/2018:22:25:28 +0200] "PUT /update HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.6 - - [10/Jul/2018:22:26:28 +0200] "POST /submit HTTP/1.1" 302 0 "-" "User-Agent"
        192.168.1.7 - - [10/Jul/2018:22:27:28 +0200] "DELETE /delete HTTP/1.1" 404 0 "-" "User-Agent"
        192.168.1.8 - - [10/Jul/2018:22:28:28 +0200] "GET /page4 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.9 - - [10/Jul/2018:22:29:28 +0200] "GET /page5 HTTP/1.1" 200 3574 "-" "User-Agent"
      `;

      const topOccurrences = findTopOccurrences(logData, extractStatusCode, 2);

      expect(topOccurrences).toEqual([
        ["200", 4],
        ["302", 2],
      ]);
    });

    test("should handle ties correctly when topN is less than unique status codes", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /page1 HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "GET /page2 HTTP/1.1" 404 0 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:23:28 +0200] "GET /page3 HTTP/1.1" 500 0 "-" "User-Agent"
      `;

      const topOccurrences = findTopOccurrences(logData, extractStatusCode, 2);

      expect(topOccurrences).toEqual([
        ["200", 1],
        ["404", 1],
      ]);
    });

    test("should handle logs with only one status code", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /home HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "POST /about HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:23:28 +0200] "GET /contact HTTP/1.1" 200 3574 "-" "User-Agent"
      `;
      const topOccurrences = findTopOccurrences(logData, extractStatusCode);

      expect(topOccurrences).toEqual([["200", 3]]);
    });

    test("should handle logs with multiple status codes occurring equally", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /home HTTP/1.1" 200 3574 "-" "User-Agent"
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "POST /about HTTP/1.1" 404 0 "-" "User-Agent"
        192.168.1.3 - - [10/Jul/2018:22:23:28 +0200] "GET /contact HTTP/1.1" 500 0 "-" "User-Agent"
        192.168.1.4 - - [10/Jul/2018:22:24:28 +0200] "GET /services HTTP/1.1" 302 0 "-" "User-Agent"
      `;
      const topOccurrences = findTopOccurrences(logData, extractStatusCode);

      expect(topOccurrences).toEqual([
        ["200", 1],
        ["404", 1],
        ["500", 1],
      ]);
    });

    test("should ignore lines where status code cannot be extracted", () => {
      const logData = `
        192.168.1.1 - - [10/Jul/2018:22:21:28 +0200] "GET /home HTTP/1.1" - "-" "User-Agent"
        Invalid line without status code
        192.168.1.2 - - [10/Jul/2018:22:22:28 +0200] "POST /about HTTP/1.1" 404 0 "-" "User-Agent"
      `;
      const topOccurrences = findTopOccurrences(logData, extractStatusCode);

      expect(topOccurrences).toEqual([["404", 1]]);
    });
  });
});
