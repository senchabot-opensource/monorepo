import React from "react";
import { trpc } from "../utils/trpc";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField, InputLabel, Button } from "@mui/material";
import { TwitchConfigInputValidation } from "../validation/color";
import AppSnackbar from "../components/app/AppSnackbar";
import LoadingBox from "../components/loading/LoadingBox";

const TwitchDisplayForm = (): JSX.Element => {
  const [isLoading, setIsLoading] = React.useState(true);
  /* const [colors, setColors] = React.useState({
    background: "",
    foreground: "",
  });*/
  const [snackbarOpen, setSnackBarOpen] = React.useState(false);
  const twitchColors = trpc.twitch.get.useQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(TwitchConfigInputValidation),
    defaultValues: {
      background: !twitchColors.isLoading && twitchColors.data?.background,
      foreground: !twitchColors.isLoading && twitchColors.data?.foreground,
    },
  });

  //const { append, insert } = useFieldArray({control, background: "#000000", foreground: "#FFFFFF"})

  React.useEffect(() => {
    if (!twitchColors.isLoading) {
      /*setColors({
        background: twitchColors.data?.background || "#000000",
        foreground: twitchColors.data?.foreground || "#FFFFFF",
      });*/
      setValue("background", twitchColors.data?.background);
      setValue("foreground", twitchColors.data?.foreground);

      setIsLoading(false);
    }
  }, [twitchColors.isLoading]); // dont use twitchColors directly.

  const configsMutate = trpc.twitch.mutateConfig.useMutation({
    onSuccess() {
      setSnackBarOpen(!snackbarOpen);
    },
  });

  const onSubmit = (data: any) => configsMutate.mutate(data);

  const handleError = (errorMsg: any) => {
    if (errorMsg) {
      return <React.Fragment>{errorMsg.message}</React.Fragment>;
    }
  };
  return (
    <>
      <AppSnackbar
        isSnackbarOpen={snackbarOpen}
        snackbarMessage="Twitch UI configurations successfully saved."
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              "& > :not(style)": {
                m: 1,
              },
            }}
          >
            <InputLabel>Change Twitch Chat Colors</InputLabel>
            <Controller
              name="background"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={errors.background && true}
                  fullWidth
                  label="Background Color"
                  variant="outlined"
                  size="small"
                  helperText={handleError(errors.background)}
                />
              )}
            />
            <Controller
              name="foreground"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={errors.foreground && true}
                  fullWidth
                  label="Foreground Color"
                  variant="outlined"
                  size="small"
                  helperText={handleError(errors.foreground)}
                />
              )}
            />

            <Button fullWidth variant="outlined" sx={{ m: 1 }} type="submit">
              Save
            </Button>
          </Box>
        </form>
      )}
    </>
  );
};

export default TwitchDisplayForm;
