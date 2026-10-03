import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { House, ReinforceOutput } from '../types/game';
import { Sigil, IconTerritory, IconCastle, IconPort, IconVP, IconShield } from './Sigils';
import { T } from '../lib/typography';
import { useStrings } from '../lib/LanguageContext';
import { computeTotal } from '../lib/formulas';

interface HouseColumnProps {
  house: House;
  allHouses: House[];
  status: 'active' | 'defender' | 'idle';
  reinforce: ReinforceOutput;
  isReinforcePhase: boolean;
  showFormula: boolean;
  onSelect: () => void;
}

const COLORS = {
  parchment:       '#ede0c2',
  parchmentShadow: '#b29a64',
  ink:             '#2a1d0f',
  inkFaint:        '#8a7150',
  rule:            '#b29a6488',
  waxRed:          '#8a1818',
  waxGold:         '#b08433',
};

export const HouseColumn: React.FC<HouseColumnProps> = ({
  house, allHouses, status, reinforce, showFormula, onSelect,
}) => {
  const s = useStrings();
  const prevRef = useRef({
    territories: house.territories,
    castles: house.castles,
    ports: house.ports,
    vps: house.vps,
  });
  const [flashing, setFlashing] = useState<Record<string, boolean>>({});
  const [cellWidth, setCellWidth] = useState(0);

  useEffect(() => {
    const f: Record<string, boolean> = {};
    (['territories', 'castles', 'ports', 'vps'] as const).forEach(k => {
      if (prevRef.current[k] !== house[k]) f[k] = true;
    });
    if (Object.keys(f).length > 0) {
      setFlashing(f);
      const timer = setTimeout(() => setFlashing({}), 550);
      prevRef.current = {
        territories: house.territories,
        castles: house.castles,
        ports: house.ports,
        vps: house.vps,
      };
      return () => clearTimeout(timer);
    }
    prevRef.current = {
      territories: house.territories,
      castles: house.castles,
      ports: house.ports,
      vps: house.vps,
    };
  }, [house.territories, house.castles, house.ports, house.vps]);

  const isActive   = status === 'active';
  const isDefender = status === 'defender';
  const borderColor = isActive || isDefender ? house.color : COLORS.rule;
  const borderWidth = isDefender ? 2 : 1;
  const borderStyle = isDefender ? 'dashed' : 'solid';
  const bg = isActive ? house.tint : 'rgba(255,250,232,.55)';

  return (
    <TouchableOpacity
      style={[
        styles.column,
        {
          borderColor,
          borderWidth,
          borderStyle: borderStyle as any,
          backgroundColor: bg,
          shadowColor: isActive || isDefender ? house.color : 'transparent',
          shadowOpacity: isActive ? 0.45 : isDefender ? 0.4 : 0,
          shadowRadius: isActive ? 16 : isDefender ? 12 : 0,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      {isActive   && <Text style={[styles.statusBadge, { backgroundColor: house.color }]}>{s.statusTurn}</Text>}
      {isDefender && (
        <View style={[styles.defenderBadge, { borderColor: house.color }]}>
          <IconShield size={12} color={house.color} />
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.houseName} numberOfLines={1}>{house.name}</Text>
        <Text style={styles.houseWords} numberOfLines={1}>{house.words}</Text>
      </View>

      <View
        style={styles.statsGrid}
        onLayout={e => {
          const w = e.nativeEvent.layout.width;
          setCellWidth(Math.floor((w - 5) / 2));
        }}
      >
        {cellWidth > 0 && (
          <>
            <View style={styles.statsRow}>
              <StatCell label={s.statTerr}    icon={<IconTerritory size={9} color={COLORS.inkFaint} />} value={house.territories} flash={flashing.territories} width={cellWidth} />
              <StatCell label={s.statCastles} icon={<IconCastle    size={9} color={COLORS.inkFaint} />} value={house.castles}     flash={flashing.castles}     width={cellWidth} />
            </View>
            <View style={styles.statsRow}>
              <StatCell label={s.statPorts}   icon={<IconPort      size={9} color={COLORS.inkFaint} />} value={house.ports}       flash={flashing.ports}       width={cellWidth} />
              <StatCell label={s.statVP}      icon={<IconVP        size={9} color={COLORS.waxRed}   />} value={house.vps}         flash={flashing.vps}         width={cellWidth} isVP />
            </View>
          </>
        )}
      </View>

      {house.bonusArmies > 0 && (
        <View style={styles.bonusPill}>
          <Text style={styles.bonusLabel}>{s.statBonus}</Text>
          <View style={styles.bonusItems}>
            <View style={styles.bonusChip}>
              <Text style={styles.bonusChipText}>+{house.bonusArmies}</Text>
              <Text style={styles.bonusChipText}>Armies</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.bottomSection}>
        <StandingsStrip allHouses={allHouses} currentId={house.id} />
        <View style={styles.sigilFooter}>
          <Sigil id={house.id} size={70} color={house.color} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ── StatCell ─────────────────────────────────────────────────── */

const StatCell: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  width: number;
  flash?: boolean;
  isVP?: boolean;
}> = ({ label, icon, value, width, flash, isVP }) => (
  <View style={[styles.stat, { width }, flash && styles.statFlashing]}>
    <View style={styles.statLabel}>
      {icon}
      <Text style={styles.statLabelText}>{label}</Text>
    </View>
    <Text style={[styles.statNum, isVP && styles.statNumVP]}>{value}</Text>
  </View>
);

/* ── StandingsStrip ───────────────────────────────────────────── */

const StandingsStrip: React.FC<{ allHouses: House[]; currentId: string }> = ({
  allHouses, currentId,
}) => {
  const s = useStrings();
  const ranked = [...allHouses].sort((a, b) => {
    const diff = computeTotal(b) - computeTotal(a);
    return diff !== 0 ? diff : b.vps - a.vps;
  });
  const maxTotal = Math.max(...ranked.map(computeTotal), 1);
  const rank = ranked.findIndex(h => h.id === currentId);
  const house = ranked[rank];
  if (!house) return null;
  const total = computeTotal(house);
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  const ordinal = s.ordinals[rank] ?? `${rank + 1}.`;

  return (
    <View style={styles.standStrip}>
      <View style={styles.standMeta}>
        <Text style={[styles.standRankChip, rank === 0 && styles.standRankChipFirst]}>
          {ordinal}
        </Text>
        <Text style={styles.standMetaTotal}>{total} {s.holdings}</Text>
      </View>
      <View style={styles.standBarTrack}>
        <View style={[styles.standBarFill, { width: `${pct}%` as any, backgroundColor: house.color }]} />
      </View>
    </View>
  );
};

/* ── Styles ───────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  column: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 4,
    elevation: 2,
    gap: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    ...T.statusBadge,
    color: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    textTransform: 'uppercase',
    zIndex: 1,
    overflow: 'hidden',
  },
  defenderBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: { gap: 2 },
  houseName: { ...T.houseName,  color: COLORS.ink    },
  houseWords: { ...T.houseWords, color: COLORS.inkFaint },

  bottomSection: { marginTop: 'auto', gap: 8 },
  sigilFooter:   { alignItems: 'center' },

  statsGrid: { gap: 5 },
  statsRow:  { flexDirection: 'row', gap: 5 },
  stat: {
    minHeight: 72,
    backgroundColor: 'rgba(255,250,235,.5)',
    borderWidth: 1,
    borderColor: COLORS.rule,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statFlashing:  { backgroundColor: 'rgba(176,132,51,.25)' },
  statLabel:     { flexDirection: 'row', gap: 2, alignItems: 'center', marginBottom: 2 },
  statLabelText: { ...T.statLabelText, color: COLORS.inkFaint, textTransform: 'uppercase' },
  statNum:       { ...T.statNum,  color: COLORS.ink   },
  statNumVP:     { color: COLORS.waxRed },

  bonusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(176,132,51,.10)',
    borderWidth: 1,
    borderColor: COLORS.waxGold,
    borderStyle: 'dashed',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  bonusLabel:    { ...T.bonusLabel,    color: COLORS.waxGold, textTransform: 'uppercase' },
  bonusItems:    { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  bonusChip:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  bonusChipText: { ...T.bonusChipText, color: COLORS.waxGold },

  standStrip: {
    borderTopWidth: 1,
    borderTopColor: COLORS.rule,
    borderStyle: 'dotted',
    paddingTop: 10,
    marginTop: 2,
    gap: 5,
  },
  standMeta:          { flexDirection: 'row', alignItems: 'center', gap: 5 },
  standRankChip:      { ...T.standingsRank,  color: COLORS.inkFaint, textTransform: 'uppercase' },
  standRankChipFirst: { color: COLORS.waxGold },
  standMetaTotal:     { ...T.standingsTotal, flex: 1, color: COLORS.ink, textAlign: 'right' },
  standBarTrack: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,.07)',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.rule,
  },
  standBarFill: { height: '100%', borderRadius: 999 },
});
