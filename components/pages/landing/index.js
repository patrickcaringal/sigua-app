import React, { useEffect, useState } from "react";

import { Box, Chip, Container, Typography } from "@mui/material";
import Image from "next/image";

import { useRequest } from "../../../hooks";
import { getBranchesReq, getServicesReq } from "../../../modules/firebase";
import Logo from "../../Logo";

const Landingpage = () => {
  // Requests
  const [getServices] = useRequest(getServicesReq);
  const [getBranches] = useRequest(getBranchesReq);

  // Local States
  const [services, setServices] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [branches, setBranches] = useState([]);

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

    fetchServices();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {/* Banner */}
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "row",
          py: 4,
          mb: 5,
          //   border: "1px solid blue",
        }}
      >
        <Box sx={{ width: 500 }}>
          <Image
            src="/banner.png"
            alt=""
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            justifyContent: "center",
            flex: 1,
            ml: 8,
            // my: 3,
            // mb: 10,
            // border: "1px solid blue",
          }}
        >
          <Typography variant="h3" fontWeight={600} color="primary.dark">
            We Care
          </Typography>
          <Typography
            variant="h3"
            fontWeight={600}
            color="primary.light"
            gutterBottom
          >
            About Your Health
          </Typography>
          <Typography
            variant="h6"
            fontWeight={400}
            fontStyle="italic"
            color="primary.dark"
          >
            Not just better healthcare, but a better healthcare experience.
          </Typography>
        </Box>
      </Container>

      {/* Branches */}
      <Box sx={{ backgroundColor: "#83C4FF" }}>
        <Container
          maxWidth="lg"
          sx={{
            // display: "flex",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          {branches.map((i, idx) => {
            const isEven = (idx + 1) % 2 == 0;
            const bg = isEven ? "#5DB2FF" : "transparent";
            return (
              <Box
                key={i.id}
                sx={{
                  flex: 1,
                  //   height: 320,
                  backgroundColor: bg,
                  display: "flex",
                  flexDirection: "column",
                  //   justifyContent: "center",
                  alignItems: "center",
                  py: 6,
                  px: 4,
                }}
              >
                <Typography
                  variant="h5"
                  color="common.white"
                  sx={{ mb: 2, letterSpacing: 2 }}
                  fontWeight={600}
                >
                  {i.name} BRANCH
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="common.white"
                  sx={{ mb: 2 }}
                >
                  Services
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {i.servicesId.map((i, idx) => (
                    <Chip
                      key={idx}
                      label={servicesMap[i]}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
                <Typography
                  variant="caption"
                  color="common.white"
                  sx={{ mt: 3 }}
                >
                  {i.address}
                </Typography>
              </Box>
            );
          })}
        </Container>
      </Box>
    </Box>
  );
};

export default Landingpage;
