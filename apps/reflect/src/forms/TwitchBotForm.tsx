import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { Controller, FieldError, useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Select from "@mui/material/Select";
import CustomAlert from "../components/CustomAlert";
import AppSnackbar from "../components/app/AppSnackbar";
import { SneacbarSeverity } from "../enums";
import { ITwitchBotFormSubmitData } from "src/types";

const TwitchBotForm = () => {
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>(false);

  const { data: botActivityEnabledConfig, isLoading } =
    trpc.twitchBot.getConfig.useQuery({
      configName: "bot_activity_enabled",
    });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      botActivityEnabled: botActivityEnabledConfig?.configValue ?? "0",
    },
  });

  useEffect(() => {
    if (!isLoading) {
      if (!botActivityEnabledConfig) return;
      setValue("botActivityEnabled", botActivityEnabledConfig.configValue);
    }
  }, [isLoading]);

  const configsMutate = trpc.twitchBot.setConfig.useMutation({
    onSuccess() {
      setSnackbarIsOpen(true);
    },
    onError() {
      setAlertIsOpen(true);
    },
  });

  const onSubmit = (data: ITwitchBotFormSubmitData) => {
    configsMutate.mutate({
      configName: "bot_activity_enabled",
      configValue: data.botActivityEnabled,
    });
  };

  const handleError = (error: FieldError | undefined) => {
    if (error) {
      return <React.Fragment>{error.message}</React.Fragment>;
    }
    return null;
  };

  return (
    <>
      <AppSnackbar
        severity={SneacbarSeverity.Success}
        isSnackbarOpen={snackbarIsOpen}
        snackbarClose={() => setSnackbarIsOpen(!snackbarIsOpen)}
        snackbarMessage="Twitch Bot configurations successfully saved."
      />
      <CustomAlert
        isOpen={alertIsOpen}
        closeHandler={() => setAlertIsOpen(!alertIsOpen)}
        content="Something went wrong. Please try again later."
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            "& > :not(style)": {
              m: 1,
            },
          }}>
          <InputLabel>Twitch Bot Activities</InputLabel>
          <Controller
            name="botActivityEnabled"
            control={control}
            render={({ field }) => (
              <FormControl
                sx={{ m: 2 }}
                size="small"
                fullWidth
                error={!!errors.botActivityEnabled}>
                <InputLabel id="select-botActivityEnabled">
                  Twitch Bot Activities
                </InputLabel>

                <Select
                  {...field}
                  labelId="select-botActivityEnabled"
                  id="select-botActivityEnabled"
                  label="Twitch Bot Activities">
                  <MenuItem value="0">Disabled</MenuItem>
                  <MenuItem value="1">Enabled</MenuItem>
                </Select>
                <FormHelperText>
                  {handleError(errors.botActivityEnabled)}
                </FormHelperText>
              </FormControl>
            )}
          />
          <Button fullWidth variant="outlined" sx={{ m: 1 }} type="submit">
            Save
          </Button>
        </Box>
      </form>
    </>
  );
};

export default TwitchBotForm;
