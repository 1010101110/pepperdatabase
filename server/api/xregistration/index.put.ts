import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // auth
  const authuser = (await getUserFromRequest(event)) as any;

  const {
    ID,
    exchange,
    email,
    user,
    region,
    wishlist,
    address,
    sent,
    received,
    returned,
    returned_note,
  } = body || {};

  //get registration
  const [rresults] = await db.execute(
    "SELECT * FROM xregistration WHERE ID = ?",
    [ID],
  );
  if ((rresults as any[]).length !== 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid registration",
    });
  }
  const beforeUpdate = (rresults as any[])[0];

  const [result] = await db.execute(
    `UPDATE xregistration SET
      exchange = ?,
      user = ?,
      region = ?,
      wishlist = ?,
      address = ?,
      sent = ?,
      received = ?,
      returned = ?,
      returned_note = ?,
      edit_on = NOW()
     WHERE ID = ?`,
    [
      exchange,
      user,
      region,
      wishlist,
      address,
      sqlDate(sent),
      sqlDate(received),
      sqlDate(returned),
      returned_note,
      ID,
    ],
  );

  //sent email notification
  if(beforeUpdate.sent == null && sent != null){
    //we don't need a notification for this one
  }

  //received notification
  if(beforeUpdate.received == null && received != null){
    // send email
    resend.emails.send({
      from: "Pepper <pepper@pepperdatabase.org>",
      to: email,
      subject: "XChange Package Received by admin",
      html: `
<h2>The admin has recieved your package! ${received}</h2>
<br>
🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨`,
    });
  }

  //returned email notification
  if(beforeUpdate.returned == null && returned != null){
    // send email
    resend.emails.send({
      from: "Pepper <pepper@pepperdatabase.org>",
      to: email,
      subject: "XChange Package returning to you",
      html: `
<h2>The admin sent your package! ${returned}</h2>
<br>
<pre>${returned_note}</pre>
<br>
🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨🌶️✨`,
    });

  }

  addHistory(`/xchange`,`updated xchange ${exchange} registration`, authuser.id)

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  };
});
