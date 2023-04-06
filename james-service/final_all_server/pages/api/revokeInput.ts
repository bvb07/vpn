import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../db";
import { revokeClient } from "../../vpn/revoke";
import protectedApiMiddleware from "./checkSession";
//api for revoke and update status
import { Request, Response } from "express";
export default async function handler(
  req: Request,
  res: Response
) {
  if (req.method === "POST") {
    protectedApiMiddleware(req, res, async () => {
      try {
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
  } 
}
