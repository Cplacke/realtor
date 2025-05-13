window.onload = () => {

    console.info({
        settings,
        listings
    });

    // initialize form
    $('#homepage-input')[0].setAttribute('value', settings.homepage);
    $('#listing-urls')[0].innerHTML = listings.map((url, i) => (
        ListingInputElement(i, url)
    )).join('');

}

const saveChanges = () => {
    const homepage = $('#homepage-input')[0].value;
    const urls = [];
    const listingInputs = $('.listing-input input');

    for(let i=0; i<listingInputs.length; i++) {
        urls.push(listingInputs[i].value)
    }

    settings.homepage = homepage;

    fetch('/api/save', {
        body: JSON.stringify({
            homepage,
            listings: urls,
            user: settings.user,
            pass: $('#password-input')[0].value
        }),
        method: 'POST'
    })
}

const addListing = () => {
    const j = $('.listing-input input').length+1;
    $('#listing-urls')[0].innerHTML += ListingInputElement(j, 'https://www.weichert.com/');
}

const change = (index) => {
    $(`#listing-input-${index}`)[0].setAttribute('value', $(`#listing-input-${index}`)[0].value);
}


const ListingInputElement = (index, initialValue) => {
    return `
        <div id="listing-${index}" class="listing-input">
            <input id="listing-input-${index}" type="text" value="${initialValue}" onchange="change(${index})"/>
            <button onclick="$('#listing-${index}').remove()"> Delete </button>
        </div>
    `
}
