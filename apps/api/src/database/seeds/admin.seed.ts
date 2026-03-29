import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/cargoconnect';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'DRIVER', 'COMPANY'],
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, discriminatorKey: 'role' },
);

async function seed() {
  await mongoose.connect(MONGO_URI);

  const User = mongoose.model('User', UserSchema);

  const email = 'admin@cargoconnect.com';
  const password = await bcrypt.hash('password', 10);

  await User.findOneAndUpdate(
    { email },
    { email, password, role: 'ADMIN', isVerified: true, isActive: true },
    { upsert: true, new: true },
  );

  console.log(`✅ Admin seeded: ${email} / password`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
