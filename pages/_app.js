import "../styles/globals.scss";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";

import {
  LeftSidebar,
  LoggedInInaccessibleRoute,
  MainContainer,
  Navbar,
  ProtectedRoute,
} from "../components";
import { AuthContextProvider } from "../contexts/AuthContext";
import { BackdropLoaderProvider } from "../contexts/BackdropLoaderContext";
import { ResponseDialogProvider } from "../contexts/ResponseDialogContext";
import { defaultTheme } from "../modules/theme";

const loggedInInaccessibleRoutes = [
  "/",
  "/signin",
  "/signup",
  // admin
  "/doctor/signin",
  "/staff/signin",
];

const protectedRoutes = [
  "/dashboard",
  "/family-members",
  // admin
  "/doctor/dashboard",
  "/doctor/staffs",
  "/staff/dashboard",
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLoggedInInaccessible = loggedInInaccessibleRoutes.includes(
    router.pathname
  );
  const isProtected = protectedRoutes.includes(router.pathname);

  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthContextProvider>
        <BackdropLoaderProvider>
          <ResponseDialogProvider>
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
                    {/* TODO Role protected route */}
                    <Component {...pageProps} />
                  </ProtectedRoute>
                ) : (
                  // accessible to anyone routes
                  <Component {...pageProps} />
                )
              }
            </MainContainer>
          </ResponseDialogProvider>
        </BackdropLoaderProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
