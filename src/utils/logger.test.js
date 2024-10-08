const { logTopOccurrences } = require("./logger");

describe("logTopOccurrences", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("should log correct output for given label and occurrences", () => {
    const label = "Most visited URLs";
    const occurrences = [
      ["/docs/manage-websites/", 2],
      ["/intranet-analytics/", 1],
      ["http://example.net/faq/", 1],
    ];

    logTopOccurrences(label, occurrences);

    // Build expected calls to console.log
    const expectedCalls = [
      [`${label}:`],
      ["1. /docs/manage-websites/ (2 times)"],
      ["2. /intranet-analytics/ (1 times)"],
      ["3. http://example.net/faq/ (1 times)"],
      ["\n"],
    ];

    expectedCalls.forEach((args, index) => {
      expect(console.log).toHaveBeenNthCalledWith(index + 1, ...args);
    });

    expect(console.log).toHaveBeenCalledTimes(expectedCalls.length);
  });

  test("should handle empty occurrences array", () => {
    const label = "Most active IP addresses";
    const occurrences = [];

    logTopOccurrences(label, occurrences);

    const expectedCalls = [[`${label}:`], ["\n"]];

    expectedCalls.forEach((args, index) => {
      expect(console.log).toHaveBeenNthCalledWith(index + 1, ...args);
    });

    expect(console.log).toHaveBeenCalledTimes(expectedCalls.length);
  });

  test("should handle single occurrence", () => {
    const label = "Unique IP addresses";
    const occurrences = [["192.168.1.1", 5]];

    logTopOccurrences(label, occurrences);

    const expectedCalls = [[`${label}:`], ["1. 192.168.1.1 (5 times)"], ["\n"]];

    expectedCalls.forEach((args, index) => {
      expect(console.log).toHaveBeenNthCalledWith(index + 1, ...args);
    });

    expect(console.log).toHaveBeenCalledTimes(expectedCalls.length);
  });

  test("should handle occurrences with counts of 1", () => {
    const label = "Least visited URLs";
    const occurrences = [
      ["/page1", 1],
      ["/page2", 1],
      ["/page3", 1],
    ];

    logTopOccurrences(label, occurrences);

    const expectedCalls = [
      [`${label}:`],
      ["1. /page1 (1 times)"],
      ["2. /page2 (1 times)"],
      ["3. /page3 (1 times)"],
      ["\n"],
    ];

    expectedCalls.forEach((args, index) => {
      expect(console.log).toHaveBeenNthCalledWith(index + 1, ...args);
    });

    expect(console.log).toHaveBeenCalledTimes(expectedCalls.length);
  });
});
