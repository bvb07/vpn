import { exec } from "child_process";
import { Request, Response } from "express";

//dowload vpn  
export async function Download_vpn(
  containerName: string,
  clientName: string,
  req: Request,
  res: Response
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(
      `docker exec ${containerName} bash -c 'cd /etc/openvpn/pki/private/ovpn  && cat ${clientName}.ovpn'`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(stdout);
          console.log(`Client ${clientName}.ovpn file successfully generated`);
          if (!res.headersSent) {
            res.setHeader("Content-Type", "application/octet-stream");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename=${clientName}.ovpn`
            );
            res.send(stdout);
            resolve();
          } else {
            console.error(
              "Headers have already been sent, response cannot be modified"
            );
            reject(
              new Error(
                "Headers have already been sent, response cannot be modified"
              )
            );
          }
        }
      }
    );
  }).catch((error) => {
    console.error(error.message);
  });
}
