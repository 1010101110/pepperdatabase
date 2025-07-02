import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const base = "/var/www/data/docs";
  const { slug } = getRouterParams(event);
  const filePath = path.join(base, slug);
  if (fs.existsSync(filePath)) {
    return sendStream(event, fs.createReadStream(filePath));
  } else {
    return createError({ statusCode: 404, statusMessage: "doc not found" });
  }
});
