import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const taskFound = getConnection()
      .get("tasks")
      .find((task) => task.email === req.query.email)
      .value();

    if (!taskFound) {
      return res.json({ message: "Task was not found" });
    }

    res.json(taskFound);
  }
}
