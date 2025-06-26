import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try{
    const [resp] = await db.execute(`select name, email, bio, avatar from users2 where activation_hash=${body.activation_hash} and deleted = 0`)
    const user = (resp as any[])[0]
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    //store in cookie for autologin
    setCookie(event, 'auth_token', user.activation_hash, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    })

    return user
  }catch(err){
    return err
  }
})