import mongoose from "mongoose";
import { Game, User } from "./db-models";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chess-game');

  setTimeout(async () => {
    try {
      console.log("Starting database seeding...");

      // Clear existing data
      console.log("Clearing existing data...");
      await Promise.all([Game.deleteMany({}), User.deleteMany({})]);
      console.log("Existing data cleared.");

      // Create test users
      console.log("Creating users...");
      const users = await Promise.all([
        User.create({ username: "player1" }),
        User.create({ username: "player2" }),
        User.create({ username: "player3" }),
        User.create({ username: "player4" }),
        User.create({ username: "player5" }),
      ]);
      console.log(`Created ${users.length} users`);

      // Game creation helper function
      const createGame = async (
        status: "active" | "waiting" | "finished",
        index: number
      ) => {
        const user1Index = Math.floor(Math.random() * users.length);
        let user2Index;
        do {
          user2Index = Math.floor(Math.random() * users.length);
        } while (user2Index === user1Index);

        // Randomly assign colors
        const isFirstPlayerWhite = Math.random() < 0.5;
        const whitePlayerId = isFirstPlayerWhite ? users[user1Index]._id : users[user2Index]._id;
        const blackPlayerId = isFirstPlayerWhite ? users[user2Index]._id : users[user1Index]._id;

        const timeControls = [
          { type: "bullet", time: 3, increment: 0 },
          { type: "blitz", time: 5, increment: 2 },
          { type: "rapid", time: 10, increment: 5 },
        ] as const;

        const randomTimeControl =
          timeControls[Math.floor(Math.random() * timeControls.length)];

        const game = await Game.create({
          name: `Game ${index + 1}`,
          status,
          whitePlayer: whitePlayerId,
          blackPlayer: blackPlayerId,
          createdBy: users[user1Index]._id,
          timeControl: randomTimeControl,
        });

        console.log(`Created ${status} game: ${game.name}`);
        return game;
      };

      console.log("Creating games...");

      // Create games sequentially to avoid any potential race conditions
      // Create 6 waiting games
      for (let i = 0; i < 6; i++) {
        await createGame("waiting", i);
      }

      // Create 5 active games
      for (let i = 0; i < 5; i++) {
        await createGame("active", i + 6);
      }

      // Create 4 finished games
      for (let i = 0; i < 4; i++) {
        await createGame("finished", i + 11);
      }

      console.log("Database seeded successfully");

      // Log final counts
      const finalCounts = await Promise.all([
        User.countDocuments(),
        Game.countDocuments(),
      ]);

      console.log("Final database counts:", {
        users: finalCounts[0],
        games: finalCounts[1],
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  }, 3000);
}

seedDatabase();
