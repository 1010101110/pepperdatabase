import { deleteImage } from '~/server/utils/image'

export default defineEventHandler(async (event) => {
    //auth
    const user = await getUserFromRequest(event) as any

    //param
    const body = await readBody(event)
    if(body.id){

        try{
            await db.execute('UPDATE users2 SET avatar = ? where ID = ?',[null,body.id]);

            await deleteImage(body.avatar);

            return {success:true};
        }catch(e){
            console.log(e)
        }
    }

    return {success:false};

});