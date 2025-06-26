import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    //validate email
    if (!body.email || !body.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
    }

    //validate username
    if (!body.username || body.username.length < 3) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid username' })
    }

    //validate via db
    const [existingUser] = await db.execute(
        'SELECT * FROM users2 WHERE email = ? OR name = ?',
        [body.email, body.username]
    )
    if ((existingUser as any[]).length > 0) {
        throw createError({ statusCode: 409, statusMessage: 'User already exists' })
    }

    try{
        //generate hash
        const hash = await bcrypt.hash(body.username,10);

        //insert into db
        const [uinsert] = await db.execute(
            'INSERT INTO users2 (email, name, activation_hash) VALUES (?, ?, ?)',
            [body.email, body.username, hash]
        )

        //send email
        const { sendMail } = useNodeMailer()
        await sendMail({
            from: 'pepper@pepperdatabase.org',
            to: body.email,
            subject: 'Welcome To PepperDatabase',
            text: `keep this secret, it your pepper database pdb login ${hash} 🤨`
        })
    }catch(err){
        const [urollback] = await db.execute(
            'DELETE FROM users2 where email = ?',
            [body.email]
        )
    }

    return {}
})