import { exec } from "child_process";

//Find file VPN  
export const findVPN= async (clientName: string) => {
    const Docker_name = process.env.NEXT_PUBLIC_CONTAINER_NAME
    try {
        const checkVPN = exec(
            `docker exec ${Docker_name} bash -c 'cd /etc/openvpn/pki/private/ovpn && test -e ${clientName}.ovpn && echo "File exists" || echo "File does not exist"'`
          );
          return true;
    } catch (error) {
        console.log(`this server have problem for find VPN`);
        return  false;
      }
    };
