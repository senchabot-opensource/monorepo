import { infoBoxContainerStyle, infoBoxStyle } from "../../styles";
import { useInfoBoxContext } from "../../contexts/InfoBoxContext";
import Typewriter from "typewriter-effect";
import { useTheme } from "@mui/material";

export const InfoBox = () => {
  const theme = useTheme();
  const background = theme.palette.background.default;
  const foreground = theme.palette.primary.main;
  const { infoBox } = useInfoBoxContext();
  const isTransparentBackground = infoBox.infoBoxType !== 3;
  const textColor = isTransparentBackground ? foreground : background;
  return (
    <div
      style={infoBoxContainerStyle(
        isTransparentBackground,
        infoBox,
        foreground,
      )}>
      {infoBox.infoBoxType === 0 ? (
        <div
          style={{
            ...infoBoxStyle.infoTextStyle,
            color: textColor,
          }}>
          <Typewriter
            options={{
              strings: infoBox.infoBoxText,
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            ...infoBoxStyle.timerTextStyle,
            color: textColor,
          }}>
          {infoBox.infoBoxText}
        </div>
      )}
    </div>
  );
};
