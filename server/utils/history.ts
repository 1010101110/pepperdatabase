import db from "~/server/utils/db";

export async function addHistory(url: string, action: string, actionby: number = 0){
    try{
        await db.execute(
            `INSERT INTO history (url,action,action_by) VALUES(?,?,?)`,
            [url,action,actionby]
        )
    }catch(err){
        console.log(err)
    }
}