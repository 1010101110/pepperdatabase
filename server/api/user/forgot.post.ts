export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    //validate email
    if (!body.email || !body.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
    }

    try{
        //validate via db
        const [existingUser] = await db.execute(
            'SELECT * FROM users2 WHERE email = ? OR name = ?',
            [body.email]
        )
        const user = (existingUser as any[])[0]
        if(!user){
            throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
        }

        // send email
        const { sendMail } = useNodeMailer()
        await sendMail({
            from: 'pepper@pepperdatabase.org',
            to: body.email,
            subject: 'Welcome To PepperDatabase',
            text: `keep this secret, it your pepper database pdb login ${user.activation_hash} <br> <a href="https://pepperdatabase.org/api/user/login/activation_hash=${user.activation_hash}">click to login</a> 🤨`
        })

        return {success:true}
    }catch(err){
        return {success:false, error:err};
    }
})