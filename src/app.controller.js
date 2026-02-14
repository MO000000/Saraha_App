import express from "express";
import checkConnection from "./DB/connectionDB.js";

const app = express();
const port = 3000;

const bootstrap = async () => {
  app.use(express.json());

  app.get("/", (req, res) => res.send("Hello World!"));

  checkConnection();

  app.use("{/*demo}", (req, res, next) => {
    res
      .status(404)
      .json({ message: `URL ${req.originalUrl} not found` }, { cause: 404 });
  });

  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  checkConnection();
};
