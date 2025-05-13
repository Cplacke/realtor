import { getAllListingView } from "./lisiting-card.ts";
import { getUserSettings, getListingByUser } from './kv.ts'
import { saveAdminChanges } from './api.ts';


export const router = async (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname.toLocaleLowerCase().includes('code')) {
        return new Response(
            Deno.readTextFileSync('qr-code/qr-code.svg'),
            {
                status: 200, headers: { 'Content-Type': 'text/html' }
            }
        )
    }
    if (url.pathname.toLocaleLowerCase().includes('api/')) {
        return await saveAdminChanges(req);
    }

    const settings = await getUserSettings('tplacke') as any;
    const listings= await getListingByUser('tplacke') as string[];


    if (url.pathname.toLocaleLowerCase().includes('admin')) {
        return new Response(
            Deno.readTextFileSync('public/admin.html').replace(
                '{{ SCRIPT_CONTENT }}',
                `<script>` +
                `const settings = ${JSON.stringify(settings)};` + 
                `const listings = ${JSON.stringify(listings)};` + 
                Deno.readTextFileSync('public/client.js') +
                `</script>`
            ),
            {
                status: 200, headers: { 'Content-Type': 'text/html' }
            }
        )
    }

    if (listings?.length) {
        if (listings.length === 1) {
            return Response.redirect(listings[0], 302);
        }

        return new Response(
            Deno.readTextFileSync('public/index.html').replace(
                '{{  DOCUMENT_CONTENT  }}',
                await getAllListingView(listings)
            ),
            {
                status: 200, headers: { 'Content-Type': 'text/html' }
            }
        )
    }
    
    return Response.redirect(settings.homepage, 302);

}