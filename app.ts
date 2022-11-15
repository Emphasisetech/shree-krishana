import express, { Request, Response, NextFunction, Application } from "express";
import dotenv from "dotenv";
import path from "path";
import fileUpload from "express-fileupload";
import "reflect-metadata";
import cors from "cors"

import { query } from "./connection/query";
dotenv.config();

import routes from "./api/v1/routes/index";
import { connection } from "./connection/connection";
import { Employee } from "./api/v1/models/employee";

//creating App
const app: Application = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
connection.then(async con => {
  try {
    await con.runMigrations();
    let emp = await con.getRepository(Employee)
    emp.find()
      .then(async (e: any) => {
        if (e.length == 0) {
          let data = await emp.query(query);
        } else {
          console.log("emp.query", "<<<<<<<<<<");
        }
      })  
  } catch (err) {
    console.log("emp.query err", "<<<<<<<<<<");
  }
});

app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use("/public/uploads", express.static("public/uploads"));
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  console.log("headers>>>>", req.headers.authorization, "<<<<<headers");
  console.log("req.body>>>>", req.method, req.originalUrl, req.body, "<<<<<req.body");
  next();
}, routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on ${PORT}`));

