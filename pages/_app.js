import "../styles/globals.scss";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";

import {
  LoggedInInaccessibleRoute,
  Navbar,
  ProtectedRoute,
} from "../components/";
import { AuthContextProvider } from "../contexts/AuthContext";
import { defaultTheme } from "../modules/theme";

const loggedInInaccessibleRoutes = [
  "/",
  "/signin",
  "/signup",
  // admin
  "/admin/signin",
  "/admin/signup",
];

const protectedRoutes = [
  "/dashboard",
  "/family-members",
  // admin
  "/admin/dashboard",
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
        <Navbar />
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
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
