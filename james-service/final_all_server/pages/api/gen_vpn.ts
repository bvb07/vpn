import { exec } from "child_process";
import { Gen_Vpn } from "../../vpn/model";
import { getConnection } from "../../db";
import type { NextApiRequest, NextApiResponse } from "next";
import protectedApiMiddleware from "./checkSession";
import { Request, Response } from "express";
export default async function getTasks(req: Request, res: Response) {
  if (req.method === "POST") {
    protectedApiMiddleware(req, res, async () => {
      const data = getConnection().get("tasks").value();
      const { clientName, iscreated } = req.query;
      const dataName = `${clientName}`;
      const Docker_name = process.env.NEXT_PUBLIC_CONTAINER_NAME
      const checkVPN = exec(
        `docker exec {Docker_name} bash -c 'cd /etc/openvpn/pki/private/ovpn  && test -e ${dataName}.ovpn && echo "File exists" || echo "File does not exist"'`
      );
      if (iscreated) {
        try {
          const openVpn = await Gen_Vpn("openvpn", dataName, req, res)
            .then(() => console.log("Generate successful"))
            .catch((err) => console.error(err));
          console.log(" wait for build vpn");
          res.status(200).json({ msg: "File build vpn is working" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "File build vpn failed" });
        }
      } else {
        console.log("Have generate already");
        res.status(200).json({ msg: "Have generate already" });
      }
    });
  }
}
