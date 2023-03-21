import React from "react";
import { trpc } from "../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  TextField,
  InputLabel,
  Button,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { SenchaConfigInputValidation } from "../validation/senchaconfig";
import AppSnackbar from "../components/app/AppSnackbar";

/*export interface SnackbarState extends SnackbarOrigin {
  open: boolean;
}*/

const SenchaDisplayForm = () => {
  const [snackbarOpen, setSnackBarOpen] = React.useState(false);
  const { data: config } = trpc.sencha.get.useQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SenchaConfigInputValidation),
    defaultValues: {
      bootScene: (config?.bootScene && config?.bootScene.toString()) || "0",
      background: config?.background,
      foreground: config?.foreground,
    },
  });

  const configsMutate = trpc.sencha.mutateConfig.useMutation({
    onSuccess() {
      setSnackBarOpen(true);
      //handleSnackBarOpen({ vertical: "top", horizontal: "left" });
    },
  });

  const onSubmit = (data: any) => configsMutate.mutate(data);

  const handleError = (errorMsg: any) => {
    if (errorMsg) {
      return <React.Fragment>{errorMsg.message}</React.Fragment>;
    }
  };

  //const [bootScene, setBootScene] = React.useState("");

  /*const handleSnackBarOpen = (newState: SnackbarOrigin) => () => {
    setSnackbarState({ open: true, ...newState });
  };*/

  /*const handleSelectChange = (event: SelectChangeEvent) => {
    setBootScene(event.target.value);
  };*/

  return (
    <>
      <AppSnackbar
        isSnackbarOpen={snackbarOpen}
        snackbarMessage="Sencha UI configurations successfully saved."
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            "& > :not(style)": {
              m: 1,
            },
          }}
        >
          <InputLabel>Sencha Boot Scene</InputLabel>
          <Controller
            name="bootScene"
            control={control}
            render={({ field }) => (
              <FormControl
                sx={{ m: 2 }}
                size="small"
                fullWidth
                error={!!errors.bootScene}
              >
                <InputLabel id="select-bootscene">Boot Scene</InputLabel>

                <Select
                  {...field}
                  labelId="select-bootscene"
                  id="select-bootscene"
                  label="Boot Scene"
                >
                  <MenuItem value="0">Console</MenuItem>
                  <MenuItem value="1">Vertical Line</MenuItem>
                </Select>
                <FormHelperText>{handleError(errors.bootScene)}</FormHelperText>
              </FormControl>
            )}
          />

          <InputLabel>Sencha Theme Colors</InputLabel>

          <Controller
            name="background"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.background}
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
                error={!!errors.foreground}
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
    </>
  );
};

export default SenchaDisplayForm;
