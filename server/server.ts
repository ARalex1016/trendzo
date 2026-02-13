import app from "./app.ts";

import { env } from "./Config/env.config.ts";
import { connectDB } from "./Config/mongoose.config.ts";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
};

startServer();
