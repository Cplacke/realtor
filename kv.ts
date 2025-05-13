
export const db = await Deno.openKv();

const USERS = "users";
const LISTINGS = "listings";

export const updateListingToUser = async(user: string, urls: string[]) => {
    await db.set(
        [LISTINGS, user], JSON.stringify(urls)
    );
    return urls;
}

export const updateUserRegistration = async (user: string, settings: object) => {
    await db.set(
        [USERS, user], JSON.stringify(settings)
    )
    return settings;
}



const clearKvStorage = async () => {
    let count = 0;
    const entries = db.list({ prefix: [USERS] });
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

const getKvRecordsCount = async () => {
    let total = 0;
    total += await getKvPrefeixRecordsCount([USERS]);
    total += await getKvPrefeixRecordsCount([LISTINGS]);

    console.info('kv total record count', total);
}

// await clearKvStorage();
await getKvRecordsCount();
