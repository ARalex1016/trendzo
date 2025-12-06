import app from "./app.ts";

import { env } from "./Config/env.config.ts";
import { connectDB } from "./Config/mongoose.config.ts";

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
  connectDB();
});
