import { exec } from "child_process";
import { Request, Response } from "express";

//revoke vpn
export const revokeClient = async (clientName: string,  req: Request,res: Response) => {
   const Docker_name = process.env.NEXT_PUBLIC_CONTAINER_NAME
   const passphrase =  process.env.NEXT_PUBLIC_PASS_GEN_REVOKE
   const command =`docker exec ${Docker_name} bash -c 'ovpn_revokeclient ${clientName} ${passphrase}'`;
  try {
     await exec(command);
     await exec(`docker exec ${Docker_name} bash -c 'cd /etc/openvpn/pki/private/ovpn  &&  rm -v ${clientName}.ovpn'`);
   } catch (error) {
     console.error(`revoking client certificate: ${error} `);
   }
 };
