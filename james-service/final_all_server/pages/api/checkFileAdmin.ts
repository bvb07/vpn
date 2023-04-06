import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../db";
import protectedApiMiddleware from "./checkSession";
import { exec } from "child_process";

import  { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  //download  for user
  if (req.method === "GET") {
    protectedApiMiddleware(req, res, async () => {
      const data = getConnection().get("tasks").value();
      const { clientName, iscreated } = req.query;
      const dataName = `${clientName}`;
      const { exec } = require("child_process");
      const Docker_name = process.env.NEXT_PUBLIC_CONTAINER_NAME;
      const directoryPath = "/etc/openvpn/pki/private/ovpn";
      exec(
        `docker exec ${Docker_name} bash -c 'cd ${directoryPath} && ls '`,
        (error: string, stdout: string, stderr: string) => {
          if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).json({ error: "Failed to get file list" });
            return;
          }
          const fileNames = stdout.split("\n").filter((name: string) => !!name);

          res.json({ files: fileNames });
        }
      );
    });
  }
}
