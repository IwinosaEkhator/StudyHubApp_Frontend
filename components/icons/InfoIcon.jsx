import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const InfoIcon = (props) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12 17V11"
      stroke="#000"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <Circle
      cx="1"
      cy="1"
      r="1"
      transform="matrix(1 0 0 -1 11 9)"
      fill="#000"
    />
    <Path
      d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
      stroke="#000"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </Svg>
);

export default InfoIcon;
