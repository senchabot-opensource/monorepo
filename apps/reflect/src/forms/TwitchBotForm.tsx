import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { Controller, FieldError, useForm } from "react-hook-form";
import {
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
import { ITwitchBotConfig, ITwitchBotFormSubmitData } from "src/types";

type configBooleanState = {
  key: string;
  value: string;
};

// config values for boolean state and using it on select
const configBooleanState: configBooleanState[] = [
  { key: "0", value: "Disabled" },
  { key: "1", value: "Enabled" },
];

const TwitchBotForm = () => {
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>(false);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);

  const { data: configs, isLoading } = trpc.twitchBot.getAllConfigs.useQuery();

  const configsMutate = trpc.twitchBot.setConfig.useMutation({
    onSuccess() {
      setSnackbarIsOpen(true);
    },
    onError() {
      setAlertIsOpen(true);
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bot_activity_enabled: "0",
      mods_manage_cmds_enabled: "0",
    },
  });

  useEffect(() => {
    if (!isLoading) {
      if (!configs) return;

      configs.forEach((config: ITwitchBotConfig) =>
        setValue(config.key, config.value),
      );
    }
  }, [isLoading, configs]);

  const handleError = (error: FieldError | undefined) => {
    if (error) {
      return <React.Fragment>{error.message}</React.Fragment>;
    }
    return null;
  };

  const onSubmit = React.useCallback((data: ITwitchBotFormSubmitData) => {
    setButtonEnabled(false);
    configsMutate.mutate({
      configs: [
        {
          key: "bot_activity_enabled",
          value: data.bot_activity_enabled,
        },
        {
          key: "mods_manage_cmds_enabled",
          value: data.mods_manage_cmds_enabled,
        },
      ],
    });
  }, []);

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
        <InputLabel>Twitch Bot Configuration</InputLabel>
        <Controller
          name="bot_activity_enabled"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
              sx={{ mt: 2 }}
              size="small"
              fullWidth
              error={!!errors.bot_activity_enabled}>
              <InputLabel id="select-bot_activity_enabled">
                Twitch Bot Activities
              </InputLabel>

              <Select
                onChange={field => {
                  onChange(field.target.value);
                  setButtonEnabled(true);
                }}
                value={value}
                labelId="select-bot_activity_enabled"
                id="select-bot_activity_enabled"
                label="Twitch Bot Activities">
                {configBooleanState.map(
                  (status: configBooleanState, index: number) => (
                    <MenuItem key={index} value={status.key}>
                      {status.value}
                    </MenuItem>
                  ),
                )}
              </Select>
              <FormHelperText>{handleError(error)}</FormHelperText>
            </FormControl>
          )}
        />

        <InputLabel
          sx={{
            mt: 2,
          }}>
          Mods can create/update/delete custom commands
        </InputLabel>
        <Controller
          name="mods_manage_cmds_enabled"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
              sx={{ mt: 2 }}
              size="small"
              fullWidth
              error={!!errors.mods_manage_cmds_enabled}>
              <InputLabel id="select-mods_manage_cmds_enabled">
                Mods can create/update/delete commands
              </InputLabel>

              <Select
                onChange={field => {
                  onChange(field.target.value);
                  setButtonEnabled(true);
                }}
                value={value}
                labelId="select-mods_manage_cmds_enabled"
                id="select-mods_manage_cmds_enabled"
                label="Mods can create/update/delete commands">
                {configBooleanState.map(
                  (status: configBooleanState, index: number) => (
                    <MenuItem key={index} value={status.key}>
                      {status.value}
                    </MenuItem>
                  ),
                )}
              </Select>
              <FormHelperText>{handleError(error)}</FormHelperText>
            </FormControl>
          )}
        />
        <Button
          disabled={!buttonEnabled}
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

export default TwitchBotForm;
