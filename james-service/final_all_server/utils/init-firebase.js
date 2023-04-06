import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const appName = process.env.NEXT_PUBLIC_WEB_APP
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId:  process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket:  process.env.NEXT_PUBLIC_STORAGE,
  messagingSenderId:  process.env.NEXT_PUBLIC_MESSAGE,
  appId:   process.env.NEXT_PUBLIC_APPID,
}

const app = initializeApp(firebaseConfig,`${appName}`)

export const auth = getAuth(app)


