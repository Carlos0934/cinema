import { MongoClient } from "mongo";

export const connect = async () => {
  const mongoUrl =
    Deno.env.get("MONGO_URL") || "mongodb://127.0.0.1:27017/cinema";
  console.log("Connecting to MongoDB at", mongoUrl);
  const client = new MongoClient();

  await client.connect(mongoUrl);

  return client;
};
