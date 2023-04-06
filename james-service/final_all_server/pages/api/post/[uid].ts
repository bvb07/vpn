import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../db";
import { revokeClient } from "../../../vpn/revoke";
import protectedApiMiddleware from "../checkSession";
//api for revoke and update status
import { Request, Response } from "express";
export default async function handler(req: Request, res: Response) {
  if (req.method === "POST") {
    protectedApiMiddleware(req, res, async () => {
      try {
        const taskFound = getConnection()
          .get("tasks")
          .find((task) => task.uid === req.query.uid)
          .value();

        if (!taskFound) {
          return res.status(204).json({ msg: "Task was not found" });
        }
        const { clientName } = req.query;
        const dataName = `${clientName}`;
        const revoke = await revokeClient(dataName, req, res)
          .then(() => console.log("revoke success "))
          .catch((err) => console.error(err));
        console.log("revoke ovpn success");
        res.status(200).json({ msg: "Revoke ovpn success" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "File revoke vpn failed" });
      }
    });
  } else if (req.method === "PUT") {
    protectedApiMiddleware(req, res, async () => {
      try {
        const taskFound = getConnection()
          .get("tasks")
          .find((task) => task.uid === req.query.uid)
          .value();
        if (!taskFound) {
          return res.status(404).json({ msg: "Task was not found" });
        }
        const updatedTask = getConnection()
          .get("tasks")
          .find((task) => task.uid === req.query.uid)
          .assign(req.body)
          .write();

        res.json(updatedTask);
      } catch (error) {
        return res.status(500).json({ error: "error" });
      }
    });
  } else if (req.method === "DELETE") {
    protectedApiMiddleware(req, res, async () => {
      try {
        const taskFound = getConnection()
          .get("tasks")
          .find((task) => task.uid === req.query.uid)
          .value();

        if (!taskFound) {
          return res.status(404).json({ msg: "Task was not found" });
        }
        const deletedTask = getConnection()
          .get("tasks")
          .remove((task) => task.uid === req.query.uid)
          .write();

        res.json(deletedTask);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to delete task" });
      }
    });
  }
}
