import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

// Manually resolve .env path from seed.js location (src/seed)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seedUsers = [
  {
    email: "emma.thompson@example.com",
    fullname: "Emma Thompson",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    fullname: "Olivia Miller",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    fullname: "Sophia Davis",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    fullname: "Ava Wilson",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.brown@example.com",
    fullname: "Isabella Brown",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.johnson@example.com",
    fullname: "Mia Johnson",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    fullname: "Charlotte Williams",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    fullname: "Amelia Garcia",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    email: "james.anderson@example.com",
    fullname: "James Anderson",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william.clark@example.com",
    fullname: "William Clark",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    fullname: "Benjamin Taylor",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas.moore@example.com",
    fullname: "Lucas Moore",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    fullname: "Henry Jackson",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    fullname: "Alexander Martin",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    fullname: "Daniel Rodriguez",
    password: bcrypt.hashSync("123456", 10),
    profilepic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Connected to DB");

    await User.deleteMany(); // Optional: clean old users
    await User.insertMany(seedUsers);

    console.log("✅ Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding script
seedDatabase();
