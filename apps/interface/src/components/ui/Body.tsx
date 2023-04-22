import { appStyle } from "../../styles";
import { ReactChildrenPropsType } from "../../types";

const Body = (Props: ReactChildrenPropsType) => {
  return <div style={appStyle.body}>{Props.children}</div>;
};

export default Body;
