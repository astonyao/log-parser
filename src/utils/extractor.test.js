const { extractIPFromLogLine, extractURLFromLogLine } = require("./extractor");

describe("extractIPFromLogLine", () => {
  test('should extract IP from standard log line with "- -" format', () => {
    const line =
      '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET / HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractIPFromLogLine(line)).toBe("177.71.128.21");
  });

  test('should extract IP from log line with "- admin" format', () => {
    const line =
      '50.112.0.11 - admin [11/Jul/2018:17:31:05 +0200] "GET /hosting/ HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractIPFromLogLine(line)).toBe("50.112.0.11");
  });

  test("should return null for empty line", () => {
    expect(extractIPFromLogLine("")).toBeNull();
  });

  test("should return null and log warning for invalid format", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const line = "Invalid log line format";
    expect(extractIPFromLogLine(line)).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(`Invalid log format: ${line}`);
    consoleSpy.mockRestore();
  });

  test("should extract IP with whitespace trimming", () => {
    const line =
      '   168.41.191.40          - - [09/Jul/2018:10:11:30 +0200] "GET / HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractIPFromLogLine(line)).toBe("168.41.191.40");
  });
});

describe("extractURLFromLogLine", () => {
  test("should extract URL from log line with GET request", () => {
    const line =
      '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET /faq/ HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractURLFromLogLine(line)).toBe("/faq/");
  });

  test("should extract URL with full URL in request", () => {
    const line =
      '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractURLFromLogLine(line)).toBe("http://example.net/faq/");
  });

  test("should return null if GET is not found", () => {
    const line =
      '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "POST /faq/ HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractURLFromLogLine(line)).toBeNull();
  });

  test("should return null if HTTP/ is not found", () => {
    const line =
      '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET /faq/" 200 3574 "-" "User-Agent"';
    expect(extractURLFromLogLine(line)).toBeNull();
  });

  test("should return null for empty line", () => {
    expect(extractURLFromLogLine("")).toBeNull();
  });

  test("should handle URLs with query parameters", () => {
    const line =
      '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET /search?q=test HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractURLFromLogLine(line)).toBe("/search?q=test");
  });

  test("should handle extra spaces in the request line", () => {
    const line =
      '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "  GET   /faq/   HTTP/1.1" 200 3574 "-" "User-Agent"';
    expect(extractURLFromLogLine(line)).toBe("/faq/");
  });
});
