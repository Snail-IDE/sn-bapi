// static host will restart after a while of no reqs
const defaultImageURL = 'https://pm-bapi.vercel.app/images/proxy/proj_thumbnail_browserres.png';
const widescreenImageURL = 'https://pm-bapi.vercel.app/images/proxy/proj_wide_thumbnail_browserres.png';
const imageCache = {};

let defaultImage;
let defaultWideImage;

export default async (req, res) => {
    const projId = String(req.query.id) || '0';
    const widescreen = String(req.query.widescreen) == 'true';

    const item = imageCache[projId];
    if (item) {
        const expired = (Date.now() - item.date) > 5000;
        if (item.buffer && !expired) {
            const buffer = item.buffer;
            res.status(200);
            res.setHeader("Content-Type", 'image/png');
            res.send(buffer);
            return;
        }
    }

    if (!defaultImage) {
        const response = await fetch(defaultImageURL);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        defaultImage = buffer;
    }
    if (!defaultWideImage) {
        const response = await fetch(widescreenImageURL);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        defaultWideImage = buffer;
    }

    let userImage;
    let contentType = 'image/png';
    let failed = false;
    try {
        const response = await fetch(`https://projects.penguinmod.com/api/pmWrapper/iconUrl?id=${projId}${widescreen ? '&widescreen=true' : ''}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        contentType = response.headers.get('content-type') || 'image/png';
        userImage = buffer;
    } catch {
        failed = true;
    }

    if (failed || !contentType.startsWith('image/')) {
        res.status(200)
            .setHeader("Content-Type", 'image/png')
            .send(widescreen ? defaultWideImage : defaultImage);
        return;
    }
    imageCache[projId] = {
        buffer: userImage,
        date: Date.now()
    };
    res.status(200)
        .setHeader("Content-Type", contentType)
        .send(userImage);
}