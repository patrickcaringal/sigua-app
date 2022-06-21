import "../styles/globals.scss";
import { useRouter } from "next/router";

import LoggedInInaccessibleRoute from "../components/LoggedInInaccessibleRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContextProvider } from "../contexts/AuthContext";

const loggedInInaccessibleRoutes = ["/", "/signin", "/signup"];
const protectedRoutes = ["/dashboard"];

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
