# Log Parser Project

This project parses a log file containing HTTP requests and reports on the following:

- The number of unique IP addresses
- The top 3 most visited URLs
- The top 3 most active IP addresses

## How to Run

1. **Install Node.js** if you haven't already: [https://nodejs.org](https://nodejs.org)

2. **Clone the repository** or download the files.

3. **Navigate to the project directory**:

```bash
cd path/to/project
```

4. **Install dependencies**:

```bash
 npm install
```

5. **Run the application**:

```bash
node src/index.js
```

## Sample Output

```bash
Number of unique IP addresses: 11

Most visited URLs:
1. /docs/manage-websites/ (2 times)
2. /intranet-analytics/ (1 times)
3. http://example.net/faq/ (1 times)

Most active IP addresses:
1. 168.41.191.40 (4 times)
2. 177.71.128.21 (3 times)
3. 50.112.0.11 (3 times)
```

## Running Tests

```bash
npm test
```

## Assumptions

- **Log Data Format:**
  1. All requests are `GET` requests.
  2. URLs are located between `"GET "` and `" HTTP/"` in each log entry.
  3. IP addresses are at the beginning of each log line, before `" - -"` or `" - admin"`.
- **Consistent Log Format:**
  - All log entries follow the same structure, with variations like `" - -"` and `" - admin"`.
- **Single Line Entries:**
  - Each log entry is on a single line.
- **IPv4 Only:**
  - IPv6 addresses are not currently handled.

## Future Recommendations

- **Tie-Breaking Algorithm:**
  - Implement a method to handle ties in rankings, such as:
    - Listing all URLs or IPs with the same number of visits.
    - Sorting tied items alphabetically or by earliest timestamp.
- **Support Other HTTP Methods:**
  - Update URL extraction to handle methods like `POST`, `PUT`, `DELETE`, etc.
- **IPv6 Support:**
  - Enhance IP extraction to support IPv6 addresses.
- **Use Regular Expressions:**
  - Use regular expressions for parsing log lines.
- **Performance Optimisation:**
  - For large log files, consider processing them using streams.
- **Configuration Options:**
  - Allow customisation of parameters like `topN` or log file path through config files or command line arguments.
