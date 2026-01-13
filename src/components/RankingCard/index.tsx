/**
 * Componente RankingCard
 * Exibe um item do ranking com posição, nome, avaliação e badge Top 10
 */

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  CardActionArea,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Fastfood as ProductIcon,
} from "@mui/icons-material";
import { RatingStars } from "../RatingStars";
import { RankingItem, RatingTargetType } from "@/types";

interface RankingCardProps {
  item: RankingItem;
  position: number;
  targetType: RatingTargetType;
  onClick?: () => void;
}

export const RankingCard: React.FC<RankingCardProps> = ({
  item,
  position,
  targetType,
  onClick,
}) => {
  const getPositionColor = (pos: number) => {
    if (pos === 1) return "#FFD700"; // Ouro
    if (pos === 2) return "#C0C0C0"; // Prata
    if (pos === 3) return "#CD7F32"; // Bronze
    return "#666";
  };

  const getTypeIcon = () => {
    switch (targetType) {
      case "kiosk":
        return <RestaurantIcon />;
      case "product":
        return <ProductIcon />;
      case "staff":
        return <PersonIcon />;
      default:
        return <RestaurantIcon />;
    }
  };

  const getTypeLabel = () => {
    switch (targetType) {
      case "kiosk":
        return "Quiosque";
      case "product":
        return "Produto";
      case "staff":
        return "Funcionário";
      default:
        return "";
    }
  };

  const cardContent = (
    <CardContent
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Badge Top 10 */}
      {position <= 10 && (
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <Chip
            icon={<TrophyIcon sx={{ fontSize: "0.875rem" }} />}
            label="Top 10"
            size="small"
            color="primary"
            variant="filled"
          />
        </Box>
      )}

      {/* Posição e Avatar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: getPositionColor(position),
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1rem",
            mr: 2,
          }}
        >
          {position}
        </Box>

        <Avatar
          src={item.imageUrl || undefined}
          sx={{
            width: 48,
            height: 48,
            bgcolor: "primary.light",
          }}
        >
          {getTypeIcon()}
        </Avatar>
      </Box>

      {/* Nome e Tipo */}
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          lineHeight: 1.2,
          mb: 1,
        }}
      >
        {item.name}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {getTypeLabel()}
      </Typography>

      {/* Descrição (se disponível) */}
      {item.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            flexGrow: 1,
          }}
        >
          {item.description}
        </Typography>
      )}

      {/* Avaliação */}
      <Box sx={{ mt: "auto" }}>
        <RatingStars
          value={item.averageRating}
          readOnly
          size="small"
          showValue
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block" }}
        >
          {item.totalRatings} avaliações
        </Typography>
      </Box>
    </CardContent>
  );

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        "&:hover": onClick ? { transform: "translateY(-2px)" } : {},
        transition: "transform 0.2s ease-in-out",
      }}
    >
      {onClick ? (
        <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
    </Card>
  );
};

export default RankingCard;
