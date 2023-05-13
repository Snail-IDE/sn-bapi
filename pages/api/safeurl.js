const reportApi = `https://www.urlvoid.com/`;

const urlToReportUrl = (url) => {
    const split = String(url).split('://');
    let idx = 1;
    if (split.length <= 1) {
        idx = 0;
    }
    const afterProtoc = split[idx];
    if (!afterProtoc) return '';
    const urlSplit = afterProtoc.split(/[?#&\/\\]+/gmi);
    return urlSplit[0];
}

const parseHtml = (_html) => {
    const html = String(_html).toLowerCase().replace(/[ \n\r\t]+/gmi, "");

    if (html.includes(`<strong>error!</strong>domainnameisnotvalidortoolong.`)) {
        return {
            status: 400,
            result: { error: 'Domain name is not valid or too long.' }
        }
    }

    const _summary = html.substring(html.indexOf(`<divclass="panel-heading">reportsummary</div>`));
    const summary = _summary.substring(0, _summary.indexOf(`</tbody></table></div>`));

    const htmldetects = summary.substring(
        summary.indexOf(`<spanclass="font-bold">detectionscounts</span></td><td>`) + 55,
        summary.indexOf(`</span></td></tr><tr><td><spanclass=\"font-bold\">domainregistration`)
    );

    const rawScanDetails = {
        lastCheck: summary.substring(
            summary.indexOf(`<tr><td><spanclass="font-bold">lastanalysis</span></td><td>`) + 59,
            summary.indexOf(`&nbsp;|&nbsp;<iclass="fafa-refresh"aria-hidden="true">`)
        ).replace("ago", ""),
        detections: htmldetects.split('/').map(v => v.replace(/[^0-9]+/gmi, ""))
    }

    const scanDetails = {
        lastCheck: {
            time: Number(rawScanDetails.lastCheck.replace(rawScanDetails.lastCheck.split(/[0-9]+/gmi)[1], "")),
            unit: rawScanDetails.lastCheck.split(/[0-9]+/gmi)[1]
        },
        unsafeScore: {
            string: rawScanDetails.detections[0] + "/" + rawScanDetails.detections[1],
            percentage: (Number(rawScanDetails.detections[0]) / Number(rawScanDetails.detections[1])) * 100,
            decimalPercentage: (Number(rawScanDetails.detections[0]) / Number(rawScanDetails.detections[1])),
            value: Number(rawScanDetails.detections[0]),
            max: Number(rawScanDetails.detections[1])
        }
    }
    scanDetails.unsafe = scanDetails.unsafeScore.percentage >= 10;
    scanDetails.safe = !scanDetails.unsafe;

    return {
        status: 200,
        result: scanDetails
    }
}

export default async (req, res) => {
    const url = urlToReportUrl(req.query.url);
    if (!url) {
        res.status(400)
        res.json({ error: 'Proper URL must be provided' });
        return;
    }
    fetch(reportApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `site=${url}&go=`
    }).then(response => {
        response.text().then(html => {
            const json = parseHtml(html);
            res.status(json.status)
            res.json(json.result);
        })
    }).catch(err => {
        res.status(400)
        res.json({ error: err });
    })
}