import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../db";
import { exec } from "child_process";
import { Download_vpn } from "../../vpn/download";
import protectedApiMiddleware from "./checkSession";
import { Request, Response } from "express";

export default async function downloadTask(req: Request, res: Response) {
  protectedApiMiddleware(req, res, async () => {
    const data = getConnection().get("tasks").value();
    const token = req.headers.authorization;
    const clientName = req.query.clientName as string;
    const dataName = `${clientName}`;
    const Docker_name = process.env.NEXT_PUBLIC_CONTAINER_NAME;
    try {
        const checkVPN = await exec(
        `docker exec ${Docker_name} bash -c 'cd /etc/openvpn/pki/private/ovpn  && test -e ${dataName}.ovpn && echo "File exists" || echo "File does not exist"'`
      );

      if (checkVPN) {
        await Download_vpn(`${Docker_name}`, dataName, req, res);
        console.log("Download successful");
      } else {
        console.log("File does not exist");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "File download failed" });
    }
    res.status(200).json({ data: "success" });
  });
}
