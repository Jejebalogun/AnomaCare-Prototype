const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../public');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const filePath = path.join(PUBLIC_DIR, pathname);

  try {
    // Check if the file exists
    await fs.access(filePath);

    // Determine content type
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
    }[path.extname(filePath)] || 'application/octet-stream';

    // Read and serve the file
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (error) {
    // Handle 404 - File not found
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      // Handle other errors (e.g., server issues)
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});