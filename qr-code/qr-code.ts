import * as QRCode from 'npm:qrcode';
import { Buffer } from 'node:buffer';

const URL = "https://tpsells.deno.dev";

await Deno.writeFile(
    'qr-code.svg', 
    Buffer.from(
        await QRCode.toString(URL, { type: 'svg' })
    )
);

console.info(await QRCode.toString(URL));