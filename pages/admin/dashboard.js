import React from "react";

import { Button } from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../contexts/AuthContext";

const DashboardPage = () => {
  const router = useRouter();

  const { userSession, signOut, clearSession } = useAuth();

  return (
    <>
      Admin Dashboard
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => {
          signOut({
            errorCb(error) {
              alert(error);
            },
          });
        }}
      >
        Sign Out x
      </Button>
    </>
  );
};

export default DashboardPage;
