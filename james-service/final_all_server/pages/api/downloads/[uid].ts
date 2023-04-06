import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../db";
import protectedApiMiddlewareUser from "../checkSessionUser";
import { exec } from "child_process";
import { Download_vpn } from "../../../vpn/download";
import e, { Request, Response } from "express";
import { findVPN } from "../../../vpn/findVPN";
import { log } from "console";
export default async function handler(req: Request, res: Response) {
  //download  for user
  if (req.method === "GET") {
    protectedApiMiddlewareUser(req, res, async () => {
      const taskFound = await getConnection()
        .get("tasks")
        .find((task) => task.uid === req.query.uid)
        .value();
      if (!taskFound) {
        return res.status(204).json({ message: "Task was not found" });
      }

      const data = getConnection().get("tasks").value();
      const { clientName, iscreated } = req.query;
      const dataName = `${clientName}`;
      const Docker_name = process.env.NEXT_PUBLIC_CONTAINER_NAME;
      try {
        const checkVPN = await exec(
        `docker exec ${Docker_name} bash -c 'cd /etc/openvpn/pki/private/ovpn && test -e ${dataName}.ovpn &&  echo "File exists" || echo "File does not exist"'`
      );

        if (checkVPN) {
          if(taskFound.displayName === dataName){
            await Download_vpn(`${Docker_name}`, dataName, req, res);
            console.log("Download successful");
            res.status(200).json({success : "You download successfully"});
          }else{
            res.status(400).json({err : "File not access"})
          }
        } else {
          throw new Error("File does not exist");
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "File download failed" });
      }
      res.status(200).json({data : "success"}) 
    });
  }
}
