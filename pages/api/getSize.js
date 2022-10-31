var Jimp = require('jimp');

function isValidUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }

  return true;
}

export default async (req, res) => {
  let url = req.query.url
  if (isValidUrl(url) !== true || url.includes("<" || ">" || "<script>" || "</script>") || encodeURIComponent(url).includes("%3C" || "%3E" || "%20")) {
    return res.status(400).setHeader('Content-Type', 'text/plain').send("lol");
  }
  Jimp.read(url, (err, image) => {
    if (err) return res.status(400).setHeader('Content-Type', 'text/plain').send("bruh");
    res.setHeader("Content-Type", 'application/json');
    res.send(JSON.stringify({
      width: image.bitmap.width,
      height: image.bitmap.height
    }));
  });
}