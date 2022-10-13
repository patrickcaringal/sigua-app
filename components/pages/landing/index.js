import React, { useEffect, useState } from "react";

import { Box, Chip, Container, Typography } from "@mui/material";
import Image from "next/image";

import { useRequest } from "../../../hooks";
import {
  getAnnouncementsReq,
  getBranchesReq,
  getServicesReq,
} from "../../../modules/firebase";
import Logo from "../../Logo";
import AnnouncementSection from "./Announcement";
import BannerSection from "./Banner";
import BranchSection from "./Branch";

const Landingpage = () => {
  // Requests
  const [getServices] = useRequest(getServicesReq);
  const [getBranches] = useRequest(getBranchesReq);
  const [getAnnouncements] = useRequest(getAnnouncementsReq);

  // Local States
  const [services, setServices] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [branches, setBranches] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const { data, map, error } = await getServices();
      if (error) return openErrorDialog(error);

      setServices(data);
      setServicesMap(map);
    };

    const fetchBranches = async () => {
      // Get Branches
      const { data, error } = await getBranches({ mapService: false });
      if (error) return openErrorDialog(error);

      setBranches(data);
    };

    const fetchAnnouncements = async () => {
      // Get Announcement
      const { data, error } = await getAnnouncements();
      if (error) return openErrorDialog(error);

      setAnnouncements(data);
    };

    fetchServices();
    fetchBranches();
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <BannerSection />
      <BranchSection branches={branches} servicesMap={servicesMap} />
      <AnnouncementSection announcements={announcements} />
    </Box>
  );
};

export default Landingpage;
