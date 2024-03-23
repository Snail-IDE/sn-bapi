// static host will restart after a while of no reqs
const defaultImageURL = 'https://pm-bapi.vercel.app/images/proxy/user_browserres.png';
const imageCache = {};

let defaultImage;

export default async (req, res) => {
    const username = String(req.query.username);
    if (imageCache[username]) {
        const buffer = imageCache[username];
        res.status(200);
        res.setHeader("Content-Type", 'image/png');
        res.send(buffer);
        return;
    }

    if (!defaultImage) {
        const response = await fetch(defaultImageURL);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        defaultImage = buffer;
    }

    let userImage;
    let contentType = 'image/png';
    let failed = false;
    try {
        const response = await fetch(`https://trampoline.turbowarp.org/avatars/by-username/${username}`);
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
            .send(defaultImage);
        return;
    }
    imageCache[username] = userImage;
    res.status(200)
        .setHeader("Content-Type", contentType)
        .send(userImage);
}