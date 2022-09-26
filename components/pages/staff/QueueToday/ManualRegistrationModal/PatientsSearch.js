import React, { useEffect, useState } from "react";

import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import dynamic from "next/dynamic";

import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { useFilter, useRequest } from "../../../../../hooks";
import { getPatientsReq } from "../../../../../modules/firebase";
import { Input } from "../../../../common";

const PatientSearch = ({ onPatientSelect }) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [searchName, setSearchName] = useState("");

  // Local States
  const [patients, setPatients] = useState([]);
  const filtering = useFilter({});

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const { data: patientList, error: getError } = await getPatients();
      if (getError) return openErrorDialog(getError);

      setPatients(patientList);
      filtering.setData(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e) => {
    filtering.onNameChange(e?.target?.value);
    setSearchName(e?.target?.value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <Input
        debounce
        label="Patient Name"
        value={searchName}
        onChange={handleSearchChange}
      />

      <List sx={{ maxHeight: 500, overflow: "overlay" }}>
        {!!searchName &&
          filtering.filtered.map((i) => {
            const { id, name } = i;

            return (
              <ListItem button onClick={() => onPatientSelect(id)} key={id}>
                <ListItemText primary={name} sx={{ textAlign: "center" }} />
              </ListItem>
            );
          })}

        {!!searchName && filtering.filtered.length === 0 && (
          <Typography sx={{ textAlign: "center" }}>No Patient found</Typography>
        )}
      </List>
    </Box>
  );
};

export default PatientSearch;
