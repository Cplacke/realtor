import { 
    getListingByUser, getUserSettings,
    updateListingToUser, updateUserSettings,
    checkRegistrationKey, getKvRecordsCount
} from './kv.ts'

export const saveAdminChanges = async (req: Request) => {
    const body = await req.json();
    const user = body.user;

    const settings = await getUserSettings(user);
    let listings = await getListingByUser(user);

    settings.homepage = body.homepage;
    listings = body.listings;

    if (await checkRegistrationKey(body.user, body.pass)) {
        updateListingToUser(user, listings);
        updateUserSettings(user, settings);

        getKvRecordsCount();

        return new Response(body, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response('Bad key provided for update.', {
        status: 403
    });

}