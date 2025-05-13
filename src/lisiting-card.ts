import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";


export const getAllListingView = async (urls: string[]) => {

    const listings = [];
    let i = 0;
    while (i < urls.length) {

        const response = await fetch(urls[i]);
        const pageBody = await response.text();

        const doc = new DOMParser().parseFromString(pageBody, "text/html");
        const address = doc.querySelector('#property-heading-details h1.address')?.innerText || '';
        const src = 'https:' + doc.querySelector('.pdp-photo')?.getAttribute('src');
        listings.push(
            getListingView(urls[i], address, src)
        );
        i++;
        console.info(address, '-- has loaded');
    }

    return `
        <div style="display: flex; flex-wrap: wrap; justify-content: center;">
            ${listings.join("")}
        </div>
    `;
}

export const getListingView = (url: string, page: string, src: string) => {
    return `
        <div class="polaroid" style="cursor: pointer" onclick="window.location.href = '${url}';">
            <img src="${src}" />
            <div class="caption">
                <h1>${page}</h1>
            </div>
        </div>
    `
}