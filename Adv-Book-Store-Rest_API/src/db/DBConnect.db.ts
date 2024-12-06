import mongoose from 'mongoose';

export async function DbConnect(): Promise<void> {
  try {
    const dbResponse = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/online-book-store`
    );
    if (dbResponse.connections[0].readyState === 1) {
      console.log(
        `Database Connected Successfully with Host:${dbResponse.connection.host}`
      );
    } else {
      console.error(`failed to connect with Database`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Failed To Connect With Database::${error}`);
    process.exit(1);
  }
}
