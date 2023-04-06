import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function protectedApiMiddleware(req : any, res : any, next : any) {
  const session = await getServerSession(req, res, authOptions)
   try{
  if (session.role === "admin") {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2))
    next()
  } else {
    // Not Signed in
    res.status(301).json({ message: "Not authenticated admin" })
  }
}catch (err) {
  res.status(301).json({ message: err })
}
}
