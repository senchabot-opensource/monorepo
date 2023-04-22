import { useState, useEffect } from "react";
import { configMenuStyle } from "../styles";
import { useModeContext } from "../contexts/ModeContext";
import { Mode } from "../enums";

const CONFIG_MENU_TITLE = "CONFIGURATION MENU\n\n";

const menuArray = [
  // TODO: "Remove All Browser Data"
  "Switch to Voice Input",
  "Switch to Text Input",
  "Exit Config Menu",
  // TODO:
  // <Link key={4} href="/xyz">
  //   Back to xyz
  // </Link>
];

export const ConfigMenu = () => {
  const { mode, setMode } = useModeContext();

  const [texts, setTexts] = useState(CONFIG_MENU_TITLE);
  const [button, setButton] = useState(0);

  useEffect(() => {
    let menuButton = 0;
    document.addEventListener("keydown", e => {
      const keyCode = e.code;
      if (keyCode === "ArrowUp" && menuButton > 0) {
        menuButton = --menuButton;
      } else if (keyCode === "ArrowDown" && menuButton < menuArray.length - 1) {
        menuButton = ++menuButton;
      }

      setButton(menuButton);

      if (keyCode === "Enter") {
        handleMenuButton(menuButton);
      }
    });
  }, []);

  useEffect(() => {
    if (!mode) return;
    // FIXME: Timeout duration is broken when useEffect dependencies are changed a second time
    const timeout = setTimeout(() => {
      setTexts(CONFIG_MENU_TITLE);
      clearTimeout(timeout);
    }, 4000);
  }, [texts]);

  const handleMenuButton = (menuButton: number) => {
    switch (menuButton) {
      case 0:
        setTexts("Switching to Voice Input Mode\n\n");
        break;
      case 1:
        setTexts("Switching to Text Input Mode\n\n");
        break;
      case 2:
        setTexts("Exit Command Executed\n\n");
        const timeout = setTimeout(() => {
          setMode(Mode.MAIN);
          clearTimeout(timeout);
        }, 1000);
        break;
    }
    menuButton = 0;
  };

  const handleMouseHover = (buttonIndex: number) => {
    setButton(buttonIndex);
  };
  const handleMouseDown = (buttonIndex: number) =>
    handleMenuButton(buttonIndex);

  return (
    <div style={configMenuStyle.container}>
      <div style={configMenuStyle.text}>
        {texts}
        <div style={{ maxWidth: "800px" }}>
          {menuArray.map((menu, index) => (
            <div
              className="configMenu"
              key={index}
              onMouseEnter={() => handleMouseHover(index)}
              onMouseDown={() => handleMouseDown(index)}
              style={{
                ...configMenuStyle.button,
                ...(button === index && configMenuStyle.buttonHover),
              }}>
              {menu}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
