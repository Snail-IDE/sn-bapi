export default async (req, res) => {
    const privateCode = req.query.privateCode;
    fetch(`https://auth-api.itinerary.eu.org/auth/verifyToken/${privateCode}`).then(response => {
        if (!response.ok) {
            response.text().then(text => {
                res.status(400)
                res.json({ error: text });
            }).catch(err => {
                res.status(400)
                res.json({ error: err });
            })
            return;
        }
        response.json().then(responseJson => {
            res.status(200)
            res.json(responseJson);
        }).catch(err => {
            res.status(400)
            res.json({ error: err });
        })
    }).catch(err => {
        res.status(400)
        res.json({ error: err });
    })
}