import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../db";
import protectedApiMiddlewareUser from "../checkSessionUser";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    protectedApiMiddlewareUser(req, res, async () => {
      const taskFound = getConnection()
        .get("tasks")
        .find((task) => task.uid === req.query.uid)
        .value();

      if (!taskFound) {
        return res.status(204).json({ message: "Task was not found" });
      }

      res.json(taskFound);
    });
    }
}
