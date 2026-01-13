/**
 * Componente RankingTabs
 * Abas para navegar entre diferentes tipos de ranking
 */

"use client";

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Restaurant as KioskIcon,
  Fastfood as ProductIcon,
  People as StaffIcon,
} from "@mui/icons-material";
import { RankingList } from "@/components/RankingList";
import { RatingTargetType } from "@/types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ranking-tabpanel-${index}`}
      aria-labelledby={`ranking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `ranking-tab-${index}`,
    "aria-controls": `ranking-tabpanel-${index}`,
  };
};

export const RankingTabs: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: "Quiosques",
      icon: <KioskIcon />,
      targetType: "kiosk" as RatingTargetType,
      description: "Os quiosques mais bem avaliados",
    },
    {
      label: "Produtos",
      icon: <ProductIcon />,
      targetType: "product" as RatingTargetType,
      description: "Os produtos mais deliciosos",
    },
    {
      label: "Funcionários",
      icon: <StaffIcon />,
      targetType: "staff" as RatingTargetType,
      description: "Os funcionários mais atenciosos",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="ranking tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              minHeight: 72,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.targetType}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((tab, index) => (
        <TabPanel key={tab.targetType} value={value} index={index}>
          <Box mb={2}>
            <Typography variant="h5" gutterBottom>
              {tab.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tab.description}
            </Typography>
          </Box>

          <RankingList targetType={tab.targetType} />
        </TabPanel>
      ))}
    </Box>
  );
};

export default RankingTabs;
