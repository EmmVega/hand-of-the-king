import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Cinzel_400Regular, Cinzel_600SemiBold, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { IMFellEnglish_400Regular, IMFellEnglish_400Regular_Italic } from '@expo-google-fonts/im-fell-english';
import { useGameState, useTweaks } from './src/hooks/useGameState';
import { T } from './src/lib/typography';
import { LanguageProvider } from './src/lib/LanguageContext';
import { HOUSE_SETS } from './src/lib/gameState';
import { computeReinforce } from './src/lib/formulas';
import { HouseColumn } from './src/components/HouseColumn';
import { HouseMirror } from './src/components/HouseMirror';
import { HandPanel } from './src/components/HandPanel';
import { LogOverlay, LeaderboardOverlay, SettingsOverlay, CustomRulesOverlay } from './src/components/Overlays';
import { GameState } from './src/types/game';

ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(err =>
  console.warn('Failed to lock orientation:', err)
);

const COLORS = {
  dark: '#1a1410',
  parchment: '#ede0c2',
  rule: '#b29a6488',
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Cinzel-Regular':  Cinzel_400Regular,
    'Cinzel-SemiBold': Cinzel_600SemiBold,
    'Cinzel-Bold':     Cinzel_700Bold,
    'IMFellEnglish':        IMFellEnglish_400Regular,
    'IMFellEnglish-Italic': IMFellEnglish_400Regular_Italic,
  });

  const { state, dispatch, isHydrated } = useGameState();
  const [tweaks, setTweak, tweaksHydrated] = useTweaks();
  const [overlay, setOverlay] = useState<'log' | 'leaderboard' | 'settings' | 'rules' | null>(null);

  const visibleOrder = HOUSE_SETS[tweaks.playerCount] || HOUSE_SETS[7];
  const visibleHouses = visibleOrder
    .map(id => state.houses.find(h => h.id === id))
    .filter(Boolean) as GameState['houses'];
  const visibleIds = new Set(visibleHouses.map(h => h.id));

  const effectiveActiveId = visibleIds.has(state.activeHouseId)
    ? state.activeHouseId
    : visibleHouses[0]?.id || 'stark';
  const activeHouse = state.houses.find(h => h.id === effectiveActiveId) || visibleHouses[0];

  useEffect(() => {
    if (!visibleIds.has(state.activeHouseId) && visibleHouses[0]) {
      dispatch({ type: 'select-turn', houseId: visibleHouses[0].id, silent: true });
    }
  }, [tweaks.playerCount]);

  const reinforceByHouse: Record<string, any> = {};
  state.houses.forEach(h => { reinforceByHouse[h.id] = computeReinforce(h); });
  const computed = { reinforceByHouse };

  const effectiveDefenderId = state.defenderHouseId && visibleIds.has(state.defenderHouseId) ? state.defenderHouseId : null;
  const statusFor = (h: any) => {
    if (h.id === effectiveActiveId) return 'active' as const;
    if (h.id === effectiveDefenderId) return 'defender' as const;
    return 'idle' as const;
  };


  if (!isHydrated || !tweaksHydrated || !fontsLoaded) {
    return <SafeAreaView style={styles.loadingContainer} />;
  }

  const adjustedState: GameState = {
    ...state,
    houses: visibleHouses,
    activeHouseId: effectiveActiveId,
    defenderHouseId: effectiveDefenderId,
  };

  // Mirror row border tracks active house color (from prototype)
  const activeColor = activeHouse?.color || COLORS.rule;

  return (
    <LanguageProvider language={tweaks.language ?? 'en'}>
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" hidden={Platform.OS === 'web'} />

      {/* TABLE VIEW (rotated 180° for players across the table) */}
      <View style={styles.tableView}>
        <View style={[styles.tableRow, { transform: [{ rotate: '180deg' }] as any }]}>
          {visibleHouses.map(h => (
            <View key={h.id} style={{ flex: 1, minHeight: 180 }}>
              <HouseColumn
                house={h}
                allHouses={visibleHouses}
                status={statusFor(h)}
                reinforce={reinforceByHouse[h.id]}
                isReinforcePhase={state.phase === 'reinforce'}
                showFormula={tweaks.showFormula}
                onSelect={() =>
                  h.id !== effectiveActiveId &&
                  dispatch({ type: 'select-turn', houseId: h.id, order: visibleOrder })
                }
              />
            </View>
          ))}
        </View>
      </View>

      {/* MIRROR ROW — "Hand's View · same numbers, right-side up" */}
      {/* Border tracks active house color, matching prototype's --active-color border */}
      <View style={[styles.mirrorRow, { borderTopColor: activeColor, borderBottomColor: activeColor }]}>
        {/* Floating label mimicking the prototype's ::before pseudo-element */}
        <View style={styles.mirrorLabel}>
          <Text style={styles.mirrorLabelText}>Hand's View · same numbers, right-side up</Text>
        </View>
        <View style={styles.mirrorContent}>
          {[...visibleHouses].reverse().map(h => (
            <View key={h.id} style={{ flex: 1 }}>
              <HouseMirror
                house={h}
                status={statusFor(h)}
                onSelect={() =>
                  h.id !== effectiveActiveId &&
                  dispatch({ type: 'select-turn', houseId: h.id, order: visibleOrder })
                }
              />
            </View>
          ))}
        </View>
      </View>

      {/* HAND PANEL */}
      <HandPanel
        state={adjustedState}
        dispatch={dispatch}
        computed={computed}
        openLog={() => setOverlay('log')}
        openLeaderboard={() => setOverlay('leaderboard')}
        openSettings={() => setOverlay('settings')}
        openRules={() => setOverlay('rules')}
      />

      {/* Toast */}
      {state.toast && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{state.toast.msg}</Text>
        </View>
      )}

      {/* Overlays */}
      {overlay === 'log' && (
        <LogOverlay
          state={adjustedState}
          onClose={() => setOverlay(null)}
          onUndo={() => dispatch({ type: 'undo' })}
        />
      )}
      {overlay === 'leaderboard' && (
        <LeaderboardOverlay
          houses={adjustedState.houses}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === 'settings' && (
        <SettingsOverlay
          state={adjustedState}
          dispatch={dispatch}
          playerCount={tweaks.playerCount}
          visibleOrder={visibleOrder}
          setPlayerCount={(n: any) => setTweak('playerCount', n)}
          setLanguage={(lang) => setTweak('language', lang)}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === 'rules' && (
        <CustomRulesOverlay onClose={() => setOverlay(null)} />
      )}
    </SafeAreaView>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  tableView: {
    flex: 1,
    // Parchment-like warm background matching the prototype's #root gradient
    backgroundColor: '#ede0c2',
  },
  tableRow: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
  },
  // Mirror row: prototype overlays rgba(60,40,20,.04-.10) on a parchment body bg.
  // In RN the container is dark so we need an opaque parchment base here.
  // rgb(#ede0c2 + rgba(60,40,20,.07) blend) ≈ #e0d3b6
  mirrorRow: {
    height: 128,
    backgroundColor: '#e0d3b6',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    position: 'relative',
  },
  mirrorLabel: {
    position: 'absolute',
    top: -9,
    left: 22,
    backgroundColor: '#e0d3b6',
    paddingHorizontal: 8,
    zIndex: 10,
  },
  mirrorLabelText: {
    ...T.mirrorRowBanner,
    textTransform: 'uppercase',
    color: '#8a7150',
  },
  mirrorContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 10,
  },
  toast: {
    position: 'absolute',
    bottom: '30%',
    alignSelf: 'center',
    backgroundColor: '#2a1d0f',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
  },
  toastText: {
    ...T.toast,
    color: '#ede0c2',
    textTransform: 'uppercase',
  },
});
