import React from "react";

import Image from "next/image";

import LogoSvg from "../public/sigua-logo-horizontal.svg";

const Logo = (props) => (
  <Image src="/sigua-logo-horizontal.svg" alt="me" {...props} />
);
{
  /* <SvgIcon {...props} component={LogoSvg}></SvgIcon>; */
}

export default Logo;
