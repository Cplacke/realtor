
export const db = await Deno.openKv();
// export const db = await Deno.openKv("https://api.deno.com/databases/48adcf9e-77a4-449b-925a-a9f4448ee5e2/connect");

const SECURITY = "security";
const USERS = "users";
const LISTINGS = "listings";

export const updateListingToUser = async(user: string, urls: string[]) => {
    await db.set(
        [LISTINGS, user], JSON.stringify(urls)
    );
    return urls;
}

export const updateUserSettings = async (user: string, settings: object) => {
    await db.set(
        [USERS, user], JSON.stringify(settings)
    )
    return settings;
}

export const getListingByUser = async(user: string) => {
    const res = await db.get(
        [LISTINGS, user]
    );
    return JSON.parse(res.value as string);
}

export const getUserSettings = async (user: string) => {
    const res = await db.get(
        [USERS, user]
    );
    return JSON.parse(res.value as string);
}

export const setUserRegistration = async (user: string, pass: string) => {
    await db.set(
        [SECURITY, user], pass
    )
}

export const checkRegistrationKey = async (user: string, pass: string) => {
    const registration = await db.get(
        [SECURITY, user]
    );
    return registration.value === pass;
}

setUserRegistration('tplacke', 'test-pass');

updateUserSettings('tplacke', {
    user: "tplacke",
    name: "tester",
    homepage: "https://www.weichert.com/agents/Tracy-Placke-G0079/?office=50-G67",
});

updateListingToUser('tplacke', [
    "https://www.weichert.com/127617343/",
    "https://www.weichert.com/127611463/",
]);


const clearKvStorage = async () => {
    let count = 0;
    let entries = db.list({ prefix: [USERS] });
    for await (const entry of entries) {
        await db.delete(entry.key)
        count++;
    }
    entries = db.list({ prefix: [LISTINGS] });
    for await (const entry of entries) {
        await db.delete(entry.key)
        count++;
    }
    entries = db.list({ prefix: [SECURITY] });
    for await (const entry of entries) {
        await db.delete(entry.key)
        count++;
    }
    console.info('kv cleared', count, 'records');
}

const getKvPrefeixRecordsCount = async (prefix: string[]) => {
    let count = 0;
    const entries = db.list({ prefix });
    for await (const entry of entries) {
        count++;
    }
    console.info('kv readings record count', prefix, count);
    return count;
}

export const getKvRecordsCount = async () => {
    let total = 0;
    total += await getKvPrefeixRecordsCount([USERS]);
    total += await getKvPrefeixRecordsCount([LISTINGS]);
    total += await getKvPrefeixRecordsCount([SECURITY]);

    console.info('kv total record count', total);
}

// await clearKvStorage();
await getKvRecordsCount();

