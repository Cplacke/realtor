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
    }).then((res) => {
        console.info(res);
        if (res.status === 200) {
            $('#password-input')[0].style.border = '';
            addPopUpMessage(
                'Success', 'Your changes have been saved. You can now close this window.', res.status)
        } else {
            $('#password-input')[0].style.border = 'red solid 2px';
            addPopUpMessage(
                'Failure', 'Changes Failed to save; your password may be incorrect. Please try again.', res.status)
        }
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

const addPopUpMessage = (title, msg, code) => {
    $('.submit')[0].innerHTML += `
        <div id="message" style="background-color: ${code == 200 ? 'lightgreen' : 'lightcoral'}; padding: 5px 20px; border-radius: 8px;">
            <h4> ${title} </h4>
            <p> ${msg} </p>
        </div>
    `;

    setTimeout(() => {
        $('#message')[0].remove();
    }, code == 200 ? 5000 : 2000)
}