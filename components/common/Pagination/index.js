import React from "react";

import { Box, Pagination } from "@mui/material";

const PaginationComp = ({ pagination, onChange }) => {
  if (pagination.pages.length <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Pagination
        variant="outlined"
        shape="rounded"
        count={pagination.pages.length}
        page={pagination.info.activePage + 1}
        onChange={onChange}
      />
    </Box>
  );
};

export default PaginationComp;
