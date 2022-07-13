import React, { useEffect, useMemo } from "react";

import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const staffRoutes = ["/staff/dashboard"];
const doctorRoutes = ["/doctor/dashboard", "/doctor/staffs"];

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isStaff, isAdmin } = useAuth();
  const router = useRouter();

  const isRouteNotAllowed = useMemo(
    () => ({
      staff: isStaff && isLoggedIn && !staffRoutes.includes(router.pathname),
      doctor: isAdmin && isLoggedIn && !doctorRoutes.includes(router.pathname),
    }),
    [isLoggedIn, isAdmin, isStaff, router.pathname]
  );

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

    if (isRouteNotAllowed.doctor) {
      router.push("/doctor/dashboard");
      return;
    }
  }, [router, isRouteNotAllowed]);

  const isAllowed = !lodash.values(isRouteNotAllowed).some((i) => i);

  return <>{isLoggedIn && isAllowed ? children : null}</>;
};

export default ProtectedRoute;
