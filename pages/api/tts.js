const gTTS = require('gtts');

export default async (req, res) => {
  const text = req.query.text;
  if (!text || typeof text !== 'string') {
    return res.status(400)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify({
        error: "Provide some text",
        example: "/tts?text=Wow%20so%20cool"
      }, null, 4));
  }
  let lang = req.query.lang;
  if (!lang || typeof lang !== 'string') {
    lang = 'en';
  }

  let gtts;
  try {
    gtts = new gTTS(text, lang);
  } catch (err) {
    return res.status(400)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify({
        error: String(err)
      }, null, 4));
  }
  res.status(200);
  gtts.stream().pipe(res);
}