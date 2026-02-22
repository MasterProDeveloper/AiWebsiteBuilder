import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const users: any = {};

export async function register(req: any, res: any) {

  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const id = uuid();

  users[id] = {
    id,
    email,
    password: hashed,
    role: "owner"
  };

  res.json({ success: true });
}

export async function login(req: any, res: any) {

  const { email, password } = req.body;

  const user = Object.values(users).find(
    (u: any) => u.email === email
  );

  if (!user) return res.status(401).json({ error: "Invalid" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ error: "Invalid" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({ token });
}
