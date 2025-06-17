import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const SaveIcon = (props) => (
  <Svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M20 13V17.5C20 20.5577 16 20.5 12 20.5C8 20.5 4 20.5577 4 17.5V13M12 3L12 15M12 3L16 7M12 3L8 7"
      stroke="#000000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default SaveIcon;
