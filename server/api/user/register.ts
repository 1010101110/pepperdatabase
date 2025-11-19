import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  //validate email
  if (!body.email || !body.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email" });
  }

  //validate username
  if (!body.username || body.username.length < 3) {
    throw createError({ statusCode: 400, statusMessage: "Invalid username" });
  }

  //validate via db
  const [existingUser] = await db.execute(
    "SELECT * FROM users2 WHERE email = ? OR name = ?",
    [body.email, body.username],
  );
  if ((existingUser as any[]).length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists",
    });
  }

  try {
    //generate hash
    const hash = await bcrypt.hash(body.username, 10);

    //insert into db
    const [uinsert] = await db.execute(
      "INSERT INTO users2 (email, name, activation_hash) VALUES (?, ?, ?)",
      [body.email, body.username, hash],
    );

    // send email
    resend.emails.send({
      from: "Pepper <pepper@pepperdatabase.org>",
      to: body.email,
      subject: "Welcome To PepperDatabase",
      html: `
<span>Keep this secret, it's your pepper database pdb login ${hash}</span>
<br>
<a style="display:inline-block; border: 1px solid #3f51b5; font-size:2em; padding: 10px; margin: 10px;" href="https://pepperdatabase.org/api/user/login?activation_hash=${hash}">Press to login</a>
<br>
🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨`,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    const [urollback] = await db.execute("DELETE FROM users2 where email = ?", [
      body.email,
    ]);
    return { success: false, error: err?.toString() };
  }
});
