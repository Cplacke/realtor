// deno run -A --unstable-kv --watch client.ts

import { 
    setUserRegistration,
    updateListingToUser,
    updateUserSettings
} from './src/kv.ts'

setUserRegistration('tplacke', 'floridaman');

updateUserSettings('tplacke', {
    user: "tplacke",
    name: "Tracy Placke",
    homepage: "https://www.florida.weicherthallmark.com/agents/1150457/Tracy+Placke",
});

updateListingToUser('tplacke', [
    "https://www.florida.weicherthallmark.com/property/24-S5127758-5150-gentry-oaks-place-st-cloud-FL-34772",
]);