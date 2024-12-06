import 'dotenv/config';
// dotenv at first place
import app from './src/app';
import { DbConnect } from './src/db/DBConnect.db';

const PORT = process.env.PORT || 4000;
(async function startServer() {
  try {
    await DbConnect();

    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`failed to start server::${error}`);
    process.exit(1);
  }
})();
