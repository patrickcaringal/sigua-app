import "../styles/globals.scss";
import { useRouter } from "next/router";

import LoggedInInaccessibleRoute from "../components/LoggedInInaccessibleRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContextProvider } from "../contexts/AuthContext";

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
    <AuthContextProvider>
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
  );
}

export default MyApp;
