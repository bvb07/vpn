import { getConnection } from "../../db";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createdata(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    var { role, uid, email, displayName, photo } = req.body;
    const existingTask = getConnection().get("tasks").find({ uid }).value();
    if (existingTask) {
      res.status(201).json({ message: "Task already exists." });
      return;
    }
    const time = new Date().toLocaleDateString("th-TH", { timeZone: "UTC" });

    const thaiRegex = /[\u0E00-\u0E7F]/;

    const thaitest = thaiRegex.test(displayName);

    if (thaitest) {
      displayName = email.split(".").join("_");
    } else {
      console.log("English success");
    }
    const newTask = {
      role,
      uid,
      email,
      displayName,
      status: "pending",
      time,
      iscreated: false,
      photo,
    };

    try {
      getConnection().get("tasks").push(newTask).write();
      res.status(200).json({ message: "Task created successfully." });
    } catch (error) {
      res.status(302).send("it was eror createdata");
    }
  }
}
