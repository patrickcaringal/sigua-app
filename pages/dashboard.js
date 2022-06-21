import React from "react";

import { Button } from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {
  const router = useRouter();

  const { userSession, signOutAnonymously } = useAuth();

  return (
    <>
      Patient Dashboard
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => {
          signOutAnonymously(userSession, {
            errorCb(error) {
              alert(error);
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
