import React, { useEffect, useState } from "react";

import lodash from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useRequest } from "../../../../hooks";
import { getBranchesReq } from "../../../../modules/firebase";
import { BranchesDialog } from "../../../shared";
import QueueToday from "./index";

const defaultModal = {
  open: false,
  data: {},
};

const DashboardPage = () => {
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [branchesModal, setBranchesModal] = useState(defaultModal);
  const [branchId, setBranchId] = useState(null);

  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBranches = async () => {
    // Get Branches
    const { data: branchList, error: getBranchError } = await getBranches({
      mapService: false,
    });
    if (getBranchError) return openErrorDialog(getBranchError);

    const data = branchList.map((i) => ({
      ...lodash.pick(i, ["name", "id"]),
    }));

    setBranchesModal({
      open: true,
      data,
    });
  };

  const handleBranchModalClose = () => {
    setBranchesModal(defaultModal);
  };

  const handleBranchQueue = (id) => {
    setBranchId(id);
  };

  return (
    <>
      {branchId && (
        <QueueToday branchId={branchId} openBranchModal={fetchBranches} />
      )}
      {branchesModal.open && (
        <BranchesDialog
          open={branchesModal.open}
          data={branchesModal.data}
          onBranchClick={handleBranchQueue}
          onClose={handleBranchModalClose}
        />
      )}
    </>
  );
};

export default DashboardPage;
