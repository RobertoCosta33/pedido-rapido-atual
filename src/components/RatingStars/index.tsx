/**
 * Componente RatingStars
 * Exibe e permite interação com avaliações por estrelas
 */

import React from "react";
import { Box, Rating, Typography } from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";

interface RatingStarsProps {
  value: number;
  count?: number;
  size?: "small" | "medium" | "large";
  readOnly?: boolean;
  showCount?: boolean;
  showValue?: boolean;
  onChange?: (value: number | null) => void;
  precision?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  count,
  size = "medium",
  readOnly = true,
  showCount = true,
  showValue = false,
  onChange,
  precision = 0.1,
}) => {
  const sizeMap = {
    small: { fontSize: "1rem" },
    medium: { fontSize: "1.25rem" },
    large: { fontSize: "1.5rem" },
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Rating
        value={value}
        onChange={(_, newValue) => onChange?.(newValue)}
        readOnly={readOnly}
        precision={precision}
        icon={<StarIcon sx={sizeMap[size]} />}
        emptyIcon={<StarIcon sx={{ ...sizeMap[size], opacity: 0.3 }} />}
      />

      {showValue && (
        <Typography variant="body2" color="text.secondary">
          {value.toFixed(1)}
        </Typography>
      )}

      {showCount && count !== undefined && (
        <Typography variant="body2" color="text.secondary">
          ({count} {count === 1 ? "avaliação" : "avaliações"})
        </Typography>
      )}
    </Box>
  );
};

export default RatingStars;
