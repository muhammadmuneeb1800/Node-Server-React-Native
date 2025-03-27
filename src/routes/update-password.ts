import { Response, Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middlewares/auth";

const router = Router();

router.put(
  "/update-password",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid current password" });
      }
      const hashPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: hashPassword },
      });
      res.json({ message: "Password updated successfully", updatedUser });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);

export default router;
