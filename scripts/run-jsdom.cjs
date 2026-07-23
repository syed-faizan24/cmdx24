const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const htmlPath = path.join(distPath, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error("Run npm run build first.");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", (e) => {
  console.error("JSDOM Error:", e);
});
virtualConsole.on("log", (l) => {
  console.log("JSDOM Log:", l);
});
virtualConsole.on("jsdomError", (err) => {
  console.error("JSDOM JS Error:", err);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "file://" + distPath + "/",
  virtualConsole
});

dom.window.onerror = function(msg, src, lno, col, error) {
  console.error("Global window.onerror:", msg, error);
}

dom.window.addEventListener('load', () => {
  console.log("JSDOM Loaded.");
  setTimeout(() => {
    console.log("Root content length:", dom.window.document.getElementById('root').innerHTML.length);
    process.exit(0);
  }, 1000);
});
