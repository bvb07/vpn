import { exec } from "child_process";
import { Request, Response } from "express";

//gen_vpn work
export async function Gen_Vpn(
  containerName: string,
  clientName: string,
  req: Request,
  res: Response
): Promise<void> {
  const  passphrase =  process.env.NEXT_PUBLIC_PASS_GEN_REVOKE 

  return new Promise((resolve, reject) => {
    exec(
      `docker exec ${containerName} bash -c 'echo ${passphrase} | easyrsa build-client-full ${clientName} nopass && ovpn_getclient ${clientName} > /etc/openvpn/pki/private/ovpn/${clientName}.ovpn'`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(stdout);
        }
      }
    );
  });
}
