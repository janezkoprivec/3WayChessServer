import mongoose from "mongoose";
import { User, Player, Game, IPlayer } from "./db-models";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chess-game');
  // console.log('test', mongoose.connection.readyState);

  setTimeout(async () => {
    try {
      console.log("Starting database seeding...");

      // Clear existing data
      console.log("Clearing existing data...");
      await Promise.all([Player.deleteMany({}), Game.deleteMany({})]);
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

      // Create players with different colors for each user
      console.log("Creating players...");
      const players: IPlayer[] = [];
      for (const user of users) {
        const whitePlr = await Player.create({
          user: user._id,
          color: "white",
        });
        const blackPlr = await Player.create({
          user: user._id,
          color: "black",
        });
        players.push(whitePlr, blackPlr);
      }
      console.log(`Created ${players.length} players`);

      // Game creation helper function
      const createGame = async (
        status: "active" | "waiting" | "finished",
        index: number
      ) => {
        const player1Index = Math.floor(Math.random() * players.length);
        let player2Index;
        do {
          player2Index = Math.floor(Math.random() * players.length);
        } while (
          player2Index === player1Index ||
          players[player1Index].user.toString() ===
            players[player2Index].user.toString()
        );

        const timeControls = [
          { type: "bullet", time: 180, increment: 0 },
          { type: "blitz", time: 300, increment: 2 },
          { type: "rapid", time: 600, increment: 5 },
        ] as const;

        const randomTimeControl =
          timeControls[Math.floor(Math.random() * timeControls.length)];

        const game = await Game.create({
          name: `Game ${index + 1}`,
          status,
          players: [players[player1Index]._id, players[player2Index]._id],
          createdBy: players[player1Index]._id,
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
        Player.countDocuments(),
        Game.countDocuments(),
      ]);

      console.log("Final database counts:", {
        users: finalCounts[0],
        players: finalCounts[1],
        games: finalCounts[2],
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error; // Re-throw the error to ensure it's not silently caught
    }
  }, 3000);
}
seedDatabase();
