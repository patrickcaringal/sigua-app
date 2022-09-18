import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addDoctorReq,
  deleteDoctorReq,
  getBranchesReq,
  getDoctorsReq,
  updateDoctorReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import { PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import ManageDoctorModal from "./ManageDoctorModal";
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const DoctorsPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getDoctors] = useRequest(getDoctorsReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [addDoctor] = useRequest(addDoctorReq, setBackdropLoader);
  const [updateDoctor] = useRequest(updateDoctorReq, setBackdropLoader);
  const [deleteDoctor] = useRequest(deleteDoctorReq, setBackdropLoader);

  // Local States
  const [doctors, setDoctors] = useState([]);
  const [doctorModal, setDoctorModal] = useState(defaultModal);
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      // Get Doctors
      const { data, error: getError } = await getDoctors({
        mapBranch: false,
      });
      if (getError) return openErrorDialog(getError);

      setDoctors(data);
    };

    const fetchBranches = async () => {
      // Get Branches
      const {
        data: branchList,
        map: branchMap,
        error: getBranchError,
      } = await getBranches({ mapService: false });
      if (getBranchError) return openErrorDialog(getBranchError);

      setBranches(
        branchList.map((i) => ({
          ...lodash.pick(i, ["name", "id"]),
        }))
      );
      setBranchesMap(branchMap);
    };

    fetchDoctors();
    // fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDoctorModalOpen = () => {
    setDoctorModal({
      open: true,
      data: null,
    });
  };

  const handleAddDoctor = async (docs) => {
    docs = docs.map((i) => ({
      ...i,
      ...personBuiltInFields(i),
    }));

    // Add
    const { data: newDocs, error: addError } = await addDoctor({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setDoctors((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Doctor", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setDoctorModal(defaultModal);
      },
    });
  };

  const handleEditDoctor = async (updatedDocs) => {
    const updatedDoctor = {
      ...updatedDocs[0],
      ...personBuiltInFields(updatedDocs[0]),
    };
    const doctorCopy = [...doctors];
    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedDoctor,
      oldDocs: doctorCopy,
    });

    // TODO: change email
    // const isEmailUpdated = !lodash.isEqual(
    //   doctors[index].email,
    //   updatedDoctor.email
    // );

    // Update
    const { error: updateError } = await updateDoctor({
      doctor: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setDoctors(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Doctor", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setDoctorModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (doctor) => {
    openResponseDialog({
      content: confirmMessage({ noun: "Doctor", item: doctor.name }),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(doctor)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (doctor) => {
    // Delete
    const { error: deleteError } = await deleteDoctor({ doctor });
    if (deleteError) return openErrorDialog(deleteError);

    // Success
    setDoctors((prev) => prev.filter((i) => i.id !== doctor.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Doctor", verb: "deleted" }),
      type: "SUCCESS",
    });
  };

  const handleDoctorModalClose = () => {
    setDoctorModal(defaultModal);
  };

  const handleEditModalOpen = (doctor) => {
    setDoctorModal({
      open: true,
      data: doctor,
    });
  };

  const handleRestoreRedirect = () => {
    router.push(PATHS.DOCTOR.DOCTOR_RESTORE);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Doctors" }],
      }}
      toolbarContent={
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRestoreRedirect}
            startIcon={<RestoreIcon />}
          >
            restore
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDoctorModalOpen}
            startIcon={<AddCircleIcon />}
          >
            add doctor
          </Button>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Name" },
                { text: "Email", sx: { width: 200 } },
                { text: "Birthdate", sx: { width: 140 } },
                { text: "Age", sx: { width: 40 }, align: "center" },
                { text: "Gender", sx: { width: 100 } },
                // { text: "Contact No.", sx: { width: 140 } },
                { text: "Address", sx: { width: 400 } },
                { text: "Actions", sx: { width: 100 } },
              ].map(({ text, align, sx }) => (
                <TableCell
                  key={text}
                  {...(align && { align })}
                  {...(sx && { sx: { ...sx, fontWeight: "bold" } })}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {doctors.map((i) => {
              const { id, branch, birthdate } = i;
              const data = {
                ...i,
                branchName: branchesMap[branch],
              };

              return (
                <TableRow key={id}>
                  <TableCells data={data} />
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEditModalOpen({
                          ...i,
                          birthdate: formatTimeStamp(birthdate),
                        })
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteConfirm(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {doctorModal.open && (
        <ManageDoctorModal
          branches={branches}
          open={doctorModal.open}
          data={doctorModal.data}
          onClose={handleDoctorModalClose}
          onSave={!doctorModal.data ? handleAddDoctor : handleEditDoctor}
        />
      )}
    </AdminMainContainer>
  );
};

export default DoctorsPage;
