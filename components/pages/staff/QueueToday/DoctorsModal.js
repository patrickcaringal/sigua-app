import React, { useEffect, useState } from "react";

import lodash from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  getBranchDoctorsReq,
  getQueuesTodayReq,
} from "../../../../modules/firebase";
import { today } from "../../../../modules/helper";
import { DoctorDialog } from "../../../shared";

const DoctorsModal = ({
  open,
  branchId,
  queueDoctors,
  onDoctorSelect,
  date = today,
  onClose,
}) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getBranchDoctor] = useRequest(getBranchDoctorsReq, setBackdropLoader);
  const [getQueuesToday] = useRequest(getQueuesTodayReq, setBackdropLoader);

  // Local States
  const [doctors, setDoctors] = useState([]);
  const [unavailableDoctors, setUnavailableDoctors] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchDoctors = async () => {
        // Get Doctors
        const payload = { branchId };
        const { data: doctorList, error: getError } = await getBranchDoctor(
          payload
        );
        if (getError) return openErrorDialog(getError);

        const mapped = doctorList.reduce((acc, i) => {
          if (queueDoctors.includes(i.id)) return acc;
          const d = { ...lodash.pick(i, ["name", "id"]) };
          return [...acc, d];
        }, []);

        setDoctors(mapped);
      };

      const fetchQueuesToday = async () => {
        // Get Doctors
        const payload = { today: date };
        const { data, error: getError } = await getQueuesToday(payload);
        if (getError) return openErrorDialog(getError);

        const unavailDoctors = data.reduce((acc, i) => {
          i.doctors.forEach((d) => {
            acc.add(d);
          });
          return acc;
        }, new Set());

        setUnavailableDoctors(Array.from(unavailDoctors));
      };

      fetchDoctors();
      fetchQueuesToday();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <DoctorDialog
      open={open}
      data={doctors.filter((i) => !unavailableDoctors.includes(i.id))}
      onItemClick={onDoctorSelect}
      onClose={onClose}
    />
  );
};

export default DoctorsModal;
