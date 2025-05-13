import { YamlLoader } from "https://deno.land/x/yaml_loader/mod.ts";
import { getAllListingView } from "./lisiting-card.ts";

const yamlLoader = new YamlLoader();
const config = await yamlLoader.parseFile("./edit-me.yaml") as any;

export const router = async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname.toLocaleLowerCase().includes('admin')) {
        return new Response(
            Deno.readTextFileSync('admin.html').replace(
                '{{  SCRIPT_CONTENT  }}',
                '' // Deno.readTextFileSync('admin-client.js')
            ),
            {
                status: 200, headers: { 'Content-Type': 'text/html' }
            }
        )
    }
    if (url.pathname.toLocaleLowerCase().includes('code')) {
        return new Response(
            Deno.readTextFileSync('qr-code/qr-code.svg').replace(
                '{{  SCRIPT_CONTENT  }}',
                '' // Deno.readTextFileSync('admin-client.js')
            ),
            {
                status: 200, headers: { 'Content-Type': 'text/html' }
            }
        )
    }

    if (config.links.homes?.length) {
        const homes = config.links.homes;
        if (homes.length === 1) {
            return Response.redirect(homes[0], 302);
        }

        return new Response(
            Deno.readTextFileSync('index.html').replace(
                '{{  DOCUMENT_CONTENT  }}',
                await getAllListingView(config.links.homes)
            ),
            {
                status: 200, headers: { 'Content-Type': 'text/html' }
            }
        )
    }
    
    return Response.redirect(config.homepage, 302);

}

Deno.serve(router)