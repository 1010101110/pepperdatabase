export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  //validate email
  if (!body.email || !body.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email" });
  }

  try {
    //validate via db
    const [existingUser] = await db.execute(
      "SELECT * FROM users2 WHERE email = ?",
      [body.email],
    );
    const user = (existingUser as any[])[0];
    if (!user) {
      throw createError({ statusCode: 400, statusMessage: "Invalid email" });
    }

    // send email
    email.emails.send({
      from: "Pepper <pepper@pepperdatabase.org>",
      to: body.email,
      subject: "Welcome To PepperDatabase",
      html: `
<span>Keep this secret, it's your pepper database pdb login ${user.activation_hash}</span>
<br>
<a style="display:inline-block; border: 1px solid #3f51b5; font-size:2em; padding: 10px; margin: 10px;" href="https://pepperdatabase.org/api/user/login?activation_hash=${user.activation_hash}">Press to login</a>
<br>
🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨`,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, error: err?.toString() };
  }
});
