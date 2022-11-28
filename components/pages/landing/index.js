import React, { useEffect, useRef, useState } from "react";

import { Box, Chip, Container, Typography } from "@mui/material";
import Image from "next/image";

import { useScroll } from "../../../contexts/ScrollContext";
import { useRequest } from "../../../hooks";
import {
  getAnnouncementsReq,
  getApprovedFeedbacksReq,
  getBranchesReq,
  getServicesReq,
} from "../../../modules/firebase";
import Logo from "../../Logo";
import AnnouncementSection from "./Announcement";
import BannerSection from "./Banner";
import BranchSection from "./Branch";
import FeedbackSection from "./Feedback";
import FooterSection from "./Footer";

const Landingpage = () => {
  const { feedbackRef, branchRef, announcementRef } = useScroll();

  // Requests
  const [getServices] = useRequest(getServicesReq);
  const [getBranches] = useRequest(getBranchesReq);
  const [getAnnouncements] = useRequest(getAnnouncementsReq);
  const [getFeedbacks] = useRequest(getApprovedFeedbacksReq);

  // Local States
  const [services, setServices] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [branches, setBranches] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

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

    const fetchFeedbacks = async () => {
      const { data, error } = await getFeedbacks();
      if (error) return openErrorDialog(error);

      setFeedbacks(data);
    };

    fetchServices();
    fetchBranches();
    fetchAnnouncements();
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <BannerSection />
      <div ref={branchRef} style={{ paddingTop: 50 }}>
        <BranchSection branches={branches} servicesMap={servicesMap} />
      </div>
      <div ref={announcementRef} style={{ paddingTop: 30 }}>
        <AnnouncementSection announcements={announcements} />
      </div>
      <div ref={feedbackRef}>
        <FeedbackSection feedbacks={feedbacks} />
      </div>
      <FooterSection />
    </Box>
  );
};

export default Landingpage;
