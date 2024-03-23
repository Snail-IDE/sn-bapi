// yes this is hosted statically, still wondering though
const startDate = Date.now();

export default async (req, res) => {
    res.status(200)
        .setHeader('Content-Type', 'application/json')
        .json({ 'time': Date.now() - startDate });
}