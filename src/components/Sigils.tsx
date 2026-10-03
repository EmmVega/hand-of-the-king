import React from 'react';
import { Image, ImageStyle } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { HouseId } from '../types/game';

const INK = '#2a1d0f';

const SIGIL_SOURCES: Record<HouseId, ReturnType<typeof require>> = {
  stark:      require('../../assets/sigils/stark.png'),
  lannister:  require('../../assets/sigils/lannister.png'),
  targaryen:  require('../../assets/sigils/targaryen.png'),
  baratheon:  require('../../assets/sigils/baratheon.png'),
  tyrell:     require('../../assets/sigils/tyrell.png'),
  martell:    require('../../assets/sigils/martell.png'),
  ghiscari:   require('../../assets/sigils/ghiscari.png'),
};

export const Sigil: React.FC<{ id: HouseId; size?: number; color?: string }> = ({
  id,
  size = 38,
}) => (
  <Image
    source={SIGIL_SOURCES[id] ?? SIGIL_SOURCES.stark}
    style={{ width: size, height: size } as ImageStyle}
    resizeMode="contain"
  />
);

/* =====================================================================
   UI ICONS
   All props (stroke, fill, strokeLinecap) are on individual elements —
   react-native-svg doesn't inherit these from the <Svg> root.
   ===================================================================== */

const RC = 'round' as const;

export const IconTerritory: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
    <Line x1="9" y1="4" x2="9" y2="17" stroke={color} strokeWidth="2" />
    <Line x1="15" y1="7" x2="15" y2="20" stroke={color} strokeWidth="2" />
  </Svg>
);

export const IconCastle: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 21V8l3 1V6l3 2V6l3 2V6l3 2V6l3 3v12z" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
    <Path d="M10 21v-5h4v5" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
  </Svg>
);

export const IconPort: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="6" r="2" fill="none" stroke={color} strokeWidth="2" />
    <Path d="M12 8v12" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M5 14a7 7 0 0 0 14 0" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M8 11h8" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
  </Svg>
);

export const IconVP: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
  </Svg>
);

export const IconArmy: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3l3 4-3 1-3-1z" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
    <Path d="M12 8v12" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M8 12h8" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M7 20h10" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
  </Svg>
);

export const IconGold: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="2" />
    <Path d="M12 7v10" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M9 10h5a2 2 0 0 1 0 4H9" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
  </Svg>
);

export const IconHand: React.FC<{ size?: number; color?: string }> = ({
  size = 14, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2l1 4h4l-3 3 1 4-3-2-3 2 1-4-3-3h4z" fill={color} />
  </Svg>
);

export const IconUndo: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M9 14l-4-4 4-4" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
    <Path d="M5 10h9a5 5 0 0 1 0 10h-3" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
  </Svg>
);

export const IconScroll: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 6a2 2 0 0 1 2-2h11l3 3v13a2 2 0 0 1-2 2H6" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
    <Path d="M4 6v12a2 2 0 0 0 4 0V6" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} strokeLinejoin={RC} />
    <Path d="M10 9h7" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M10 13h7" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M10 17h4" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
  </Svg>
);

export const IconCrown: React.FC<{ size?: number; color?: string }> = ({
  size = 14, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 18L5 7l4 4 3-7 3 7 4-4 2 11z" fill={color} />
  </Svg>
);

export const IconChart: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 20h16" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M6 16v-5" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M10 16v-9" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M14 16v-3" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
    <Path d="M18 16v-7" fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC} />
  </Svg>
);

export const IconShield: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3L4 7v6c0 5.5 3.5 10.3 8 11.9C16.5 23.3 20 18.5 20 13V7L12 3z" fill={color} />
  </Svg>
);

export const IconCog: React.FC<{ size?: number; color?: string }> = ({
  size = 16, color = INK,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
    <Path
      d="M12 2v3M12 19v3M5 12H2M22 12h-3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
      fill="none" stroke={color} strokeWidth="2" strokeLinecap={RC}
    />
  </Svg>
);
