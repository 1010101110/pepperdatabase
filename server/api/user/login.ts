import { setCookie, getQuery, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  // get passed in value
  let hash;
  if (event.method === "GET") {
    const query = getQuery(event);
    hash = query.activation_hash;
  }
  if (event.method === "POST") {
    const body = await readBody(event);
    hash = body.activation_hash;
  }

  try {
    const decode = decodeURIComponent(hash).trim();
    const [resp] = await db.execute(
      `select id, name, email, bio, avatar from users2 where activation_hash=? and deleted = false`,
      [decode],
    );
    const user = (resp as any[])[0];
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Login: Invalid credentials",
      });
    }

    //set active and update active timestamp
    await db.execute(
      `UPDATE users2 SET active = true, action_timestamp = NOW() WHERE activation_hash=?`,
      [decode],
    );

    //store in cookie for autologin
    setCookie(event, "auth_token", decode, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    if (event.method === "GET") {
      //redirect to logged in user
      return sendRedirect(event, "/user");
    } else {
      //return the object
      return user;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
});
