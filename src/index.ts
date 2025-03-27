import express from "express";
import cors from "cors";
import signupRouter from "./routes/signup";
import signinRouter from "./routes/signin";
import updatePasswordRouter from "./routes/update-password";
import productRouter from "./routes/product";
import { AuthMiddleware } from "./middlewares/auth";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", signinRouter);
app.use("/api/auth", signupRouter);

app.use("/api/user", AuthMiddleware, updatePasswordRouter);
app.use("/api/user", AuthMiddleware, productRouter);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
