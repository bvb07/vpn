import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function protectedApiMiddlewareUser(req :any, res:any, next:any) {
  const session = await getServerSession(req, res, authOptions)

   try{
  if (session) {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2))
    next()
  } else {
    // Not Signed in
    console.log("no session",session);

    res.status(204).json({ message: "Not authenticated" })
 
  }
}catch (err) {
  res.status(204).json({ message: "Not authenticated you try " })
}
}
