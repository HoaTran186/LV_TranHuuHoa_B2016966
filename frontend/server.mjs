import https from "https";
import fs from "fs";
import { parse } from "url";
import next from "next";

const httpsOptions = {
    pfx: fs.readFileSync("C:/Users/Admin/Documents/GitHub/LV_TranHuuHoa_B2016966/backend/localhost.pfx"),
    passphrase: "hoa19691973",
};

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    https.createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, () => {
        console.log("> Ready on https://localhost:3000");
    });
});