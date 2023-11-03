import { Stack, Typography } from "@mui/material";
import type { FC } from "react";

interface FeaturesCardProps {
  title: string;
  description: string;
  imageURL: string;
  imageAlt: string;
  reverse?: boolean;
  bgColor?: string;
}

const FeaturesCard: FC<FeaturesCardProps> = ({
  title,
  description,
  imageURL,
  imageAlt,
  reverse,
}) => {
  return (
    <Stack
      p={2}
      direction={{ xs: "column", md: reverse ? "row-reverse" : "row" }}
      alignItems="center"
      maxWidth="1440px"
      width="100%">
      <Stack width="50%" color="#0B0E15">
        <Typography fontSize="50px" fontWeight={500} lineHeight="55px">
          {title}
        </Typography>
        <Typography
          mt="30px"
          fontSize="25px"
          fontWeight={300}
          lineHeight="27.5px">
          {description}
        </Typography>
      </Stack>
      <Stack width="50%" justifyContent="center" alignItems="center">
        <img height={389} width={400} src={imageURL} alt={imageAlt} />
      </Stack>
    </Stack>
  );
};

export default FeaturesCard;
