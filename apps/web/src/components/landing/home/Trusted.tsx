import { Box, Stack, Typography } from "@mui/material";
import SectionLayout from "../layout/SectionLayout";
import { array } from "zod";

const Trusted = () => {
  const data = new Array(6).fill(0);
  return (
    <SectionLayout>
      <Stack
        direction="row"
        alignItems="center"
        bgcolor="#003B43"
        height="152px"
        width="100%"
        mt="90px"
        justifyContent="center">
        <Stack
          direction={{ xs: "column", md: "row" }}
          width="100%"
          maxWidth="1440px"
          justifyContent="space-between">
          <Typography
            width="345px"
            color="#ECFFFA"
            fontSize="42px"
            fontWeight={500}
            lineHeight="46.2px">
            Trusted and used by the best
          </Typography>
          <Stack direction="row" spacing={3}>
            {data.map(item => {
              return (
                <Box
                  height={60}
                  width={60}
                  bgcolor="#ECFFFA"
                  borderRadius="100%"></Box>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </SectionLayout>
  );
};

export default Trusted;
