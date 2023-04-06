import { getConnection } from "../../db";
import type { NextApiRequest, NextApiResponse } from "next";
import  protectedApiMiddleware from "./checkSession";

export default async function getdata(
  req: NextApiRequest,
  res: NextApiResponse
) {
  protectedApiMiddleware(req, res, async () => {
    const db = getConnection();
    const tasks = db.get("tasks").value();
    return res.status(200).json(tasks);
  })
}
