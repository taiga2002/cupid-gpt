import React from 'react';
import { createIcon } from '@chakra-ui/icons';
import Logo from '../../../public/img/logo.png';

export const CupidGPTLogo = ({ width = '146px', height = '20px' }) => {
  return (
    <img
      src={Logo.src} // Access the src property here
      alt="Cupid-GPT Logo"
      width={width}
      height={height}
    />
  );
};

export const RoundedChart = createIcon({});
