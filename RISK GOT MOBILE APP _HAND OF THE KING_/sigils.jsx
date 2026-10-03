/* =====================================================================
   SIGILS — Original abstract heraldic glyphs.
   Not the licensed HBO/book sigils. Geometric ink-stamp style.
   ===================================================================== */
const SigilStark = ({ size = 38, color = '#2a1d0f' }) => (
  <svg className="sigil-svg" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="32" r="22" />
    {/* 8-point compass star — winter motif */}
    <path d="M32 8 L34 30 L56 32 L34 34 L32 56 L30 34 L8 32 L30 30 Z" fill={color} fillOpacity=".88" stroke="none"/>
    <path d="M16 16 L26 26 M48 16 L38 26 M48 48 L38 38 M16 48 L26 38"/>
  </svg>
);

const SigilLannister = ({ size = 38, color = '#2a1d0f' }) => (
  <svg className="sigil-svg" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Stylized crown with three points + chevron mane */}
    <path d="M10 44 L14 22 L22 32 L32 14 L42 32 L50 22 L54 44 Z" fill={color} fillOpacity=".85"/>
    <line x1="10" y1="50" x2="54" y2="50" strokeWidth="3"/>
    <circle cx="14" cy="22" r="2.4" fill={color} stroke="none"/>
    <circle cx="32" cy="14" r="2.6" fill={color} stroke="none"/>
    <circle cx="50" cy="22" r="2.4" fill={color} stroke="none"/>
  </svg>
);

const SigilTargaryen = ({ size = 38, color = '#2a1d0f' }) => (
  <svg className="sigil-svg" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Three-spoke spiral */}
    <circle cx="32" cy="32" r="5" fill={color} stroke="none"/>
    <path d="M32 12 C 38 18, 38 24, 32 26 C 26 24, 26 18, 32 12 Z" fill={color} fillOpacity=".7"/>
    <path d="M50 42 C 44 42, 40 38, 42 32 C 48 32, 52 36, 50 42 Z" fill={color} fillOpacity=".7"/>
    <path d="M14 42 C 16 36, 20 32, 26 34 C 26 40, 22 44, 14 42 Z" fill={color} fillOpacity=".7"/>
  </svg>
);

const SigilBaratheon = ({ size = 38, color = '#2a1d0f' }) => (
  <svg className="sigil-svg" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Crown + stylized antler arches */}
    <path d="M32 12 L26 28 L18 18 L20 36 L14 32 L18 46 L46 46 L50 32 L44 36 L46 18 L38 28 Z" fill={color} fillOpacity=".82"/>
    <path d="M22 50 L42 50" strokeWidth="3"/>
    <circle cx="32" cy="20" r="2" fill={color} stroke="none"/>
  </svg>
);

const SigilTyrell = ({ size = 38, color = '#2a1d0f' }) => (
  <svg className="sigil-svg" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Geometric rose / hex flower */}
    <circle cx="32" cy="32" r="6" fill={color} stroke="none"/>
    {[0,60,120,180,240,300].map(a => {
      const r = a * Math.PI/180;
      const x1 = 32 + Math.cos(r)*8, y1 = 32 + Math.sin(r)*8;
      const x2 = 32 + Math.cos(r)*22, y2 = 32 + Math.sin(r)*22;
      const xp = 32 + Math.cos(r+0.5)*16, yp = 32 + Math.sin(r+0.5)*16;
      return <path key={a} d={`M ${x1} ${y1} Q ${xp} ${yp} ${x2} ${y2} Q ${32+Math.cos(r-0.5)*16} ${32+Math.sin(r-0.5)*16} ${x1} ${y1} Z`} fill={color} fillOpacity=".55"/>;
    })}
    <circle cx="32" cy="32" r="3" fill={color === '#2a1d0f' ? '#fff' : '#000'} stroke="none"/>
  </svg>
);

const SigilMartell = ({ size = 38, color = '#2a1d0f' }) => (
  <svg className="sigil-svg" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Sun with rays + spear */}
    <circle cx="32" cy="32" r="9" fill={color} fillOpacity=".9" stroke="none"/>
    {Array.from({length: 12}).map((_, i) => {
      const a = (i * 30) * Math.PI/180;
      const x1 = 32 + Math.cos(a) * 12;
      const y1 = 32 + Math.sin(a) * 12;
      const x2 = 32 + Math.cos(a) * 22;
      const y2 = 32 + Math.sin(a) * 22;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2.4"/>;
    })}
    {/* spear */}
    <line x1="14" y1="14" x2="50" y2="50" strokeWidth="2"/>
    <polygon points="48,46 54,50 50,54" fill={color} stroke="none"/>
  </svg>
);

const SigilGhiscari = ({ size = 38, color = '#2a1d0f' }) => (
  <svg className="sigil-svg" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Winged figure abstract — harpy silhouette */}
    <path d="M32 14 L36 20 L36 30 L48 22 L52 30 L42 38 L46 50 L32 44 L18 50 L22 38 L12 30 L16 22 L28 30 L28 20 Z" fill={color} fillOpacity=".82"/>
    <circle cx="32" cy="16" r="3" fill={color} stroke="none"/>
  </svg>
);

const SigilMap = {
  stark: SigilStark,
  lannister: SigilLannister,
  targaryen: SigilTargaryen,
  baratheon: SigilBaratheon,
  tyrell: SigilTyrell,
  martell: SigilMartell,
  ghiscari: SigilGhiscari,
};

const Sigil = ({ id, size = 38, color }) => {
  const C = SigilMap[id] || SigilStark;
  return <C size={size} color={color} />;
};

/* ---------- Small icons for entities & UI ---------- */
const IconTerritory = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/>
    <path d="M9 4v13M15 7v13"/>
  </svg>
);
const IconCastle = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21V8l3 1V6l3 2V6l3 2V6l3 2V6l3 3v12z"/>
    <path d="M10 21v-5h4v5"/>
  </svg>
);
const IconPort = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="6" r="2"/>
    <path d="M12 8v12M5 14a7 7 0 0 0 14 0"/>
    <path d="M8 11h8"/>
  </svg>
);
const IconVP = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill={color === 'currentColor' ? 'none' : color}/>
  </svg>
);
const IconArmy = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l3 4-3 1-3-1zM12 8v12M8 12h8M7 20h10"/>
  </svg>
);
const IconGold = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v10M9 10h5a2 2 0 0 1 0 4H9"/>
  </svg>
);
const IconHand = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M12 2l1 4h4l-3 3 1 4-3-2-3 2 1-4-3-3h4z"/>
  </svg>
);
const IconUndo = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 14l-4-4 4-4"/>
    <path d="M5 10h9a5 5 0 0 1 0 10h-3"/>
  </svg>
);
const IconScroll = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6a2 2 0 0 1 2-2h11l3 3v13a2 2 0 0 1-2 2H6"/>
    <path d="M4 6v12a2 2 0 0 0 4 0V6"/>
    <path d="M10 9h7M10 13h7M10 17h4"/>
  </svg>
);
const IconCrown = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M3 18L5 7l4 4 3-7 3 7 4-4 2 11z"/>
  </svg>
);
const IconChart = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16M6 16v-5M10 16v-9M14 16v-3M18 16v-7"/>
  </svg>
);

const IconCog = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M5 12H2M22 12h-3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
  </svg>
);

Object.assign(window, {
  Sigil, SigilMap,
  IconTerritory, IconCastle, IconPort, IconVP, IconArmy, IconGold,
  IconHand, IconUndo, IconScroll, IconCrown, IconChart, IconCog,
});
