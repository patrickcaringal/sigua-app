import React from "react";

import { Button } from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {
  const router = useRouter();

  const { signOut } = useAuth();

  return (
    <>
      Dashboard Page
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => {
          signOut({
            successCb() {
              router.push("/signin");
            },
          });
        }}
      >
        Sign Out
      </Button>
    </>
  );
};

export default DashboardPage;
