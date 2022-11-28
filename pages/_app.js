import "../styles/globals.scss";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  LeftSidebar,
  LoggedInInaccessibleRoute,
  MainContainer,
  Navbar,
  ProtectedRoute,
} from "../components";
import {
  LOGGED_IN_INACCESSIBLE_ROUTES,
  PROTECTED_ROUTES,
} from "../components/common/Routes";
import { AuthContextProvider } from "../contexts/AuthContext";
import { BackdropLoaderProvider } from "../contexts/BackdropLoaderContext";
import { ResponseDialogProvider } from "../contexts/ResponseDialogContext";
import { ScrollContextProvider } from "../contexts/ScrollContext";
import { defaultTheme } from "../modules/theme";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLoggedInInaccessible = LOGGED_IN_INACCESSIBLE_ROUTES.includes(
    router.pathname
  );
  const isProtected = PROTECTED_ROUTES.includes(router.pathname);

  return (
    <>
      <Head>
        <title>Sigua Medical Clinic</title>
        <meta name="description" content="Sigua Medical Clinic" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/sigua-logo-horizontal.svg" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <AuthContextProvider>
          <BackdropLoaderProvider>
            <ResponseDialogProvider>
              <ScrollContextProvider>
                <Navbar />
                <LeftSidebar />
                <MainContainer>
                  {
                    // should NOT be logged in to access routes
                    isLoggedInInaccessible ? (
                      <LoggedInInaccessibleRoute>
                        <Component {...pageProps} />
                      </LoggedInInaccessibleRoute>
                    ) : // should be logged in to access routes
                    isProtected ? (
                      <ProtectedRoute>
                        <Component {...pageProps} />
                      </ProtectedRoute>
                    ) : (
                      // accessible to anyone routes
                      <Component {...pageProps} />
                    )
                  }
                </MainContainer>
              </ScrollContextProvider>
            </ResponseDialogProvider>
          </BackdropLoaderProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
