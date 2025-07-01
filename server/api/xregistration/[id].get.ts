import db from '~/server/utils/db'
import {getUserFromRequest} from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  //param
  const { id } = getRouterParams(event);
  const decode = decodeURIComponent(id).trim();
  if (!decode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing ID'
    })
  }

  //check auth
  const user = await getUserFromRequest(event) as any

  //get registration
  const [rresults] = await db.execute('SELECT * FROM xregistration WHERE ID = ? and email = ?', [decode,user?.email])
  if ((rresults as any[]).length !== 1) {
      throw createError({ statusCode: 404, statusMessage: 'Invalid registration' })
  }
  const r = (rresults as any)[0] || {};

  // //get accession
  if((r as any).ID){
    const [aresults] = await db.execute('SELECT * FROM xaccession WHERE xregistration = ?', [(r as any).ID])
    const a = (aresults as any[]).map(r => {
      try{
        r.images = JSON.parse(r.images)
      }catch(err){
        //blank accessions do nothing
      }
      return r;
    })
    return {r:r,a:a};
  }

  return {r:r,a:[]};
});