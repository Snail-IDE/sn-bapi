const libraryUrl = 'https://library.penguinmod.com/files/emojis';

export default async (req, res) => {
    try {
        const response = await fetch(libraryUrl);
        const htmle = await response.text();
        const emojis = htmle
            .substring(htmle.indexOf('</header><ul id=files>') + 22, htmle.indexOf('</ul></main>'))
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0) // remove blank lines
            .filter(line => line.endsWith('.png</a>')) // remove .txt file
            .map(emoji => {
                const cut = emoji.substring(22);
                const final = cut.substring(cut.indexOf('>') + 1, cut.indexOf('.png</a>'))
                return final;
            });

        if (!Array.isArray(emojis)) throw new Error('emojis did not return array');

        res.status(200)
            .setHeader('Content-Type', 'application/json')
            .json(emojis);
    } catch (e) {
        res.status(400)
            .setHeader('Content-Type', 'application/json')
            .json({
                error: String(e)
            });
    }
}