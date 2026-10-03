import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { House } from '../types/game';
import { IconShield, Sigil } from './Sigils';
import { T } from '../lib/typography';
import { useStrings } from '../lib/LanguageContext';

interface HouseMirrorProps {
  house: House;
  status: 'active' | 'defender' | 'idle';
  onSelect: () => void;
}

const COLORS = {
  parchment:       '#ede0c2',
  parchment2:      '#e3d3ad',
  parchmentShadow: '#b29a64',
  ink:             '#2a1d0f',
  inkFaint:        '#8a7150',
  rule:            '#b29a6488',
  waxRed:          '#8a1818',
  waxGold:         '#b08433',
};

export const HouseMirror: React.FC<HouseMirrorProps> = ({ house, status, onSelect }) => {
  const s = useStrings();
  const flashAnim = useRef(new Animated.Value(0)).current;
  const prevRef = useRef({
    territories: house.territories,
    castles: house.castles,
    ports: house.ports,
    vps: house.vps,
  });
  const [flashing, setFlashing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const f: Record<string, boolean> = {};
    ['territories', 'castles', 'ports', 'vps'].forEach(k => {
      if (prevRef.current[k as keyof typeof prevRef.current] !== house[k as keyof House]) {
        f[k] = true;
      }
    });

    if (Object.keys(f).length > 0) {
      setFlashing(f);
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 450, useNativeDriver: false }),
      ]).start();
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

  return (
    <TouchableOpacity
      style={[
        styles.mirror,
        {
          borderColor,
          borderWidth,
          borderStyle: borderStyle as any,
          backgroundColor: isActive ? house.tint : 'rgba(255,250,232,.55)',
          shadowColor: isActive ? house.color : isDefender ? house.color : 'transparent',
          shadowOpacity: isActive ? 0.4 : isDefender ? 0.3 : 0,
          shadowRadius: isActive ? 9 : isDefender ? 7 : 0,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.mhead}>
        <View style={styles.msigil}>
          <Sigil id={house.id} size={16} color={house.color} />
        </View>
        <Text style={styles.mname}>{house.name}</Text>
        {/* {isActive && <Text style={[styles.mtag, { backgroundColor: house.color }]}>{s.statusTurn}</Text>} */}
      </View>

      <View style={styles.mstats}>
        <View style={styles.mstat}>
          <Text style={styles.ml}>{s.abbTerr}</Text>
          <Text style={[styles.mv, flashing.territories && styles.mvFlashing]}>{house.territories}</Text>
        </View>
        <View style={styles.mstat}>
          <Text style={styles.ml}>{s.abbCastle}</Text>
          <Text style={[styles.mv, flashing.castles && styles.mvFlashing]}>{house.castles}</Text>
        </View>
        <View style={styles.mstat}>
          <Text style={styles.ml}>{s.abbPort}</Text>
          <Text style={[styles.mv, flashing.ports && styles.mvFlashing]}>{house.ports}</Text>
        </View>
        <View style={styles.mstat}>
          <Text style={styles.ml}>{s.abbVP}</Text>
          <Text style={[styles.mvVP, flashing.vps && styles.mvFlashing]}>{house.vps}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mirror: {
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 8,
    gap: 6,
    marginVertical: 4,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  mhead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 24,
  },
  msigil: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,248,224,.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.parchmentShadow,
  },
  mname: {
    flex: 1,
    ...T.mirrorHouseName,
    color: COLORS.ink,
    textTransform: 'uppercase',
  },
  mtag: {
    ...T.statusBadge,
    color: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  mstats: {
    flexDirection: 'row',
    gap: 4,
  },
  mstat: {
    flex: 1,
    backgroundColor: 'rgba(255,250,235,.5)',
    borderWidth: 1,
    borderColor: COLORS.rule,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  ml: {
    ...T.mirrorStatLabel,
    color: COLORS.inkFaint,
    textTransform: 'uppercase',
  },
  mv: {
    ...T.mirrorStatNum,
    color: COLORS.ink,
    marginTop: 2,
  },
  mvVP: {
    ...T.mirrorStatNum,
    color: COLORS.waxRed,
    marginTop: 2,
  },
  mvFlashing: {
    backgroundColor: 'rgba(176,132,51,.2)',
    borderRadius: 4,
    paddingHorizontal: 2,
  },
});
