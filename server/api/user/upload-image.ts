import formidable from 'formidable';
import { handleImageUpload } from '~/server/utils/image'

export default defineEventHandler(async (event) => {
    //auth
    const user = await getUserFromRequest(event) as any

    // process / save image to disk
    const result = await handleImageUpload(event, {
        folder: 'images',
    });

    if(result.success){
        //update user
        if(result.fields && result.fields.user){
            const aID = Array.isArray(result.fields.user) ? result.fields.user[0] : result.fields.user
            await db.execute('UPDATE users2 SET avatar = ? where ID = ?',[result.url,aID]);
        }else{
            throw createError('bad user');
        }
    }

    return result;
})