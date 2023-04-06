import React from "react";
import { Layout } from "../components/Layout";
import AuthContextProvider from "../contexts/AuthContext";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  CSSReset,
} from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Head>
        <title>Customix VPN</title>
        <meta name="description" content="Customix VPN" />
      </Head>
      <SessionProvider session={session}>
        <AuthContextProvider ssr={true}>
          <ChakraProvider theme={theme} ssr={true}>
            <CSSReset />
            <Layout>
              <ColorModeScript initialColorMode={config.initialColorMode} />
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </AuthContextProvider>
      </SessionProvider>
    </>
  );
}
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  return {
    props: {},
  };
}
