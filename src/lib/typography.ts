import { F } from './fonts';

/* =====================================================================
   SIZE SCALE
   Change a value here and every text that uses it updates app-wide.
   ===================================================================== */
export const SIZE = {
  micro:  11,   // stat-cell labels, tiny badges
  xxs:    12,   // meta text, house words, timestamps
  xs:     12,  // section labels, small button labels
  sm:     11,  // helper body, action hints
  base:   12,  // default body, phase pills
  md:     13,  // standard labels, house names, log labels
  lg:     14,  // formula unit labels, active-house words
  xl:     16,  // active-house name, delta badge text
  stat:   34,  // big stat numbers (territories / armies / gold)
} as const;

/* =====================================================================
   TEXT PRESETS  (T.*)
   Spread into StyleSheet.create() entries alongside layout/color.
   Only text-styling keys are included so spreading is always safe.

   ⚠️  Special sizes NOT in the scale (edit here to tune):
       formula row text ........ 15
       mirror stat numbers ..... 17
       large VP +/− buttons .... 18
       VP counter .............. 28
   ===================================================================== */
export const T = {

  // ── Overlay chrome ──────────────────────────────────────────────────
  panelTitle:       { fontSize: SIZE.xs,   fontFamily: F.cinzelBold,  letterSpacing: 0.5  },
  panelSubtitle:    { fontSize: SIZE.base, fontFamily: F.fellItalic                        },
  closeBtn:         { fontSize: 20,        fontWeight: '600' as const                      },

  // ── Section / column labels ──────────────────────────────────────────
  sectionLabel:     { fontSize: SIZE.xxs,  fontFamily: F.cinzelSemi,  letterSpacing: 3.2  },
  settingsLabel:    { fontSize: SIZE.base, fontFamily: F.cinzelSemi                        },
  tableHeaderText:  { fontSize: SIZE.xs,   fontFamily: F.cinzelSemi                        },

  // ── House column ─────────────────────────────────────────────────────
  houseName:        { fontSize: SIZE.md,   fontFamily: F.cinzelBold                        },
  houseWords:       { fontSize: SIZE.xxs,  fontFamily: F.fellItalic                        },
  statNum:          { fontSize: SIZE.stat, fontFamily: F.cinzelBold,  lineHeight: 38       },
  statLabelText:    { fontSize: SIZE.micro,fontFamily: F.cinzelSemi                        },
  statusBadge:      { fontSize: SIZE.micro,fontFamily: F.cinzelSemi,  letterSpacing: 2     },
  bonusLabel:       { fontSize: SIZE.micro,fontFamily: F.cinzelSemi,  letterSpacing: 1.5   },
  bonusChipText:    { fontSize: SIZE.xs,   fontFamily: F.cinzelSemi                        },
  standingsRank:    { fontSize: SIZE.xs,   fontFamily: F.cinzelBold,  letterSpacing: 0.5   },
  standingsTotal:   { fontSize: SIZE.xxs,  fontFamily: F.cinzelSemi                        },
  standingsOf:      { fontSize: SIZE.xxs,  fontFamily: F.cinzel                            },

  // ── Mirror row ───────────────────────────────────────────────────────
  mirrorRowLabel:   { fontSize: SIZE.micro,fontFamily: F.cinzelSemi,  letterSpacing: 2     },
  mirrorHouseName:  { fontSize: SIZE.sm,   fontFamily: F.cinzelBold,  letterSpacing: 0.4   },
  mirrorStatLabel:  { fontSize: SIZE.micro,fontFamily: F.cinzelSemi,  letterSpacing: 0.3   },
  mirrorStatNum:    { fontSize: 17,        fontFamily: F.cinzelBold                        },

  // ── Hand panel chrome ────────────────────────────────────────────────
  handTitle:        { fontSize: SIZE.sm,   fontFamily: F.cinzelBold,  letterSpacing: 3.5   },
  houseInTurn:      { fontSize: SIZE.xxs,  fontFamily: F.cinzelSemi,  letterSpacing: 3.2   },
  activeHouseName:  { fontSize: SIZE.xl,   fontFamily: F.cinzelBold,  letterSpacing: 1.2   },
  activeHouseWords: { fontSize: SIZE.lg,   fontFamily: F.fellItalic                        },
  phasePill:        { fontSize: SIZE.base, fontFamily: F.cinzelSemi,  letterSpacing: 2.4   },

  // ── Reinforce formula ────────────────────────────────────────────────
  stepLabel:        { fontSize: 15,        fontFamily: F.fellItalic,  lineHeight: 16       },
  stepValue:        { fontSize: 15,        fontFamily: F.cinzelBold                        },
  microBtnText:     { fontSize: SIZE.md,   fontWeight: '700' as const                      },
  adjustVal:        { fontSize: SIZE.lg,   fontWeight: '700' as const                      },

  // ── Output cards ─────────────────────────────────────────────────────
  outCardLabel:     { fontSize: SIZE.sm,   fontFamily: F.cinzelSemi,  letterSpacing: 2.2   },
  outCardValue:     { fontSize: SIZE.stat, fontFamily: F.cinzelBold,  lineHeight: 38       },
  outCardUnit:      { fontSize: SIZE.lg,   fontFamily: F.cinzel,      letterSpacing: 1     },

  // ── Invade ───────────────────────────────────────────────────────────
  defenderLabel:    { fontSize: SIZE.xs,   fontFamily: F.cinzelSemi,  letterSpacing: 2.2   },
  entityLabel:      { fontSize: SIZE.base, fontFamily: F.cinzelBold,  letterSpacing: 2     },
  pmBtnText:        { fontSize: 15,        fontFamily: F.cinzelBold,  lineHeight: 18       },

  // ── Objectives ───────────────────────────────────────────────────────
  vpLabel:          { fontSize: SIZE.base, fontFamily: F.cinzelSemi,  letterSpacing: 2.2   },
  vpHint:           { fontSize: SIZE.sm,   fontFamily: F.fellItalic                        },
  vpCurrent:        { fontSize: 28,        fontFamily: F.cinzelBold                        },
  vpBigBtn:         { fontSize: 18,        fontWeight: '700' as const                      },
  vpFooter:         { fontSize: SIZE.sm,   fontStyle: 'italic' as const                    },

  // ── Action buttons (right column) ────────────────────────────────────
  actionBtnLabel:   { fontSize: SIZE.sm,   fontFamily: F.cinzelSemi,  letterSpacing: 2.2   },
  actionBtnHint:    { fontSize: SIZE.xs,   fontFamily: F.fellItalic                        },

  // ── Log entries ──────────────────────────────────────────────────────
  logPhase:         { fontSize: SIZE.xxs,  fontFamily: F.cinzelSemi,  letterSpacing: 1.5   },
  logWhen:          { fontSize: SIZE.xxs,  fontFamily: F.cinzel,      letterSpacing: 0.5   },
  logLabel:         { fontSize: SIZE.md,   fontFamily: F.cinzelBold,  lineHeight: 18       },
  logDetail:        { fontSize: SIZE.sm,   fontFamily: F.fellItalic                        },
  logDelta:         { fontSize: SIZE.xl,   fontFamily: F.cinzelBold                        },
  logEmpty:         { fontSize: SIZE.lg,   fontFamily: F.fellItalic                        },

  // ── Leaderboard ──────────────────────────────────────────────────────
  lbName:           { fontSize: SIZE.md,   fontFamily: F.cinzelBold                        },
  lbWords:          { fontSize: SIZE.xs,   fontFamily: F.fellItalic                        },
  lbScore:          { fontSize: SIZE.xl,   fontFamily: F.cinzelBold                        },
  lbScoreLabel:     { fontSize: SIZE.xxs,  fontFamily: F.cinzel                            },
  lbBreakdown:      { fontSize: SIZE.xxs,  fontFamily: F.cinzel                            },

  // ── Settings ─────────────────────────────────────────────────────────
  pcChip:           { fontSize: SIZE.sm,   fontFamily: F.cinzelBold                        },
  stHeader:         { fontSize: SIZE.xs,   fontFamily: F.cinzelSemi                        },
  stName:           { fontSize: SIZE.sm,   fontFamily: F.cinzelSemi                        },
  stOrder:          { fontSize: SIZE.xxs,  fontFamily: F.cinzelSemi                        },
  stVal:            { fontSize: SIZE.xs,   fontFamily: F.cinzelBold                        },

  // ── Custom Rules ─────────────────────────────────────────────────────
  crSectionTitle:   { fontSize: SIZE.xs,   fontFamily: F.cinzelBold,  letterSpacing: 2.5   },
  crBody:           { fontSize: SIZE.md,   fontFamily: F.fellItalic,  lineHeight: 19       },
  crBold:           { fontSize: SIZE.base, fontFamily: F.cinzelBold                        },
  crRoleTitle:      { fontSize: SIZE.base, fontFamily: F.cinzelBold                        },
  crRoleTitleSug:   { fontSize: SIZE.base, fontFamily: F.cinzelSemi                        },
  crRoleNum:        { fontSize: SIZE.xs,   fontFamily: F.cinzelBold                        },
  crRoleDesc:       { fontSize: SIZE.sm,   fontFamily: F.fellItalic,  lineHeight: 16       },
  crSuggestedLabel: { fontSize: SIZE.xxs,  fontFamily: F.cinzelSemi,  letterSpacing: 2     },

  // ── Footer / buttons ─────────────────────────────────────────────────
  footerText:       { fontSize: SIZE.base, fontFamily: F.fellItalic                        },
  confirmText:      { fontSize: SIZE.base, fontFamily: F.fellItalic                        },
  dangerBtnText:    { fontSize: SIZE.sm,   fontFamily: F.cinzelSemi                        },
  cancelBtnText:    { fontSize: SIZE.sm,   fontFamily: F.cinzelSemi                        },
  actionBtnText:    { fontSize: SIZE.base, fontFamily: F.cinzelSemi                        },

  // ── Toast ────────────────────────────────────────────────────────────
  toast:            { fontSize: SIZE.base, fontFamily: F.cinzelBold,  letterSpacing: 2.2   },

  // ── App-level labels ─────────────────────────────────────────────────
  mirrorRowBanner:  { fontSize: SIZE.micro,fontFamily: F.cinzelSemi,  letterSpacing: 2     },

} as const;
