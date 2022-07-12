import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const staffRoutes = ["/staff/dashboard"];
const doctorRoutes = ["/doctor/dashboard"];

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isStaff, isAdmin } = useAuth();
  const router = useRouter();

  const isRouteNotAllowed = {
    staff: isStaff && isLoggedIn && !staffRoutes.includes(router.pathname),
    doctor: isAdmin && isLoggedIn && !doctorRoutes.includes(router.pathname),
  };

  useEffect(() => {
    if (!isLoggedIn) {
      if (router.pathname.includes("/doctor")) {
        router.push("/doctor/signin");
        return;
      }

      if (router.pathname.includes("/staff")) {
        router.push("/staff/signin");
        return;
      }

      router.push("/");
    }
  }, [router, isLoggedIn]);

  useEffect(() => {
    if (isRouteNotAllowed.staff) {
      router.push("/staff/dashboard");
      return;
    }
  }, [router, isRouteNotAllowed.staff]);

  return <>{isLoggedIn && !isRouteNotAllowed.staff ? children : null}</>;
};

export default ProtectedRoute;
