import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GameState, GameAction, ReinforceOutput } from '../types/game';
import {
  Sigil,
  IconUndo, IconScroll, IconChart, IconCog, IconCrown,
  IconTerritory, IconCastle, IconPort, IconGold, IconArmy,
} from './Sigils';
import { T } from '../lib/typography';
import { useStrings } from '../lib/LanguageContext';

interface HandPanelProps {
  state: GameState;
  dispatch: (action: GameAction) => void;
  computed: { reinforceByHouse: Record<string, ReinforceOutput> };
  openLog: () => void;
  openLeaderboard: () => void;
  openSettings: () => void;
  openRules: () => void;
}

const C = {
  parchment:       '#ede0c2',
  parchment2:      '#e3d3ad',
  parchmentShadow: '#b29a64',
  ink:             '#2a1d0f',
  inkSoft:         '#4b3520',
  inkFaint:        '#8a7150',
  rule:            '#b29a6488',
  waxRed:          '#8a1818',
  waxGold:         '#b08433',
};

export const HandPanel: React.FC<HandPanelProps> = ({
  state, dispatch, computed, openLog, openLeaderboard, openSettings, openRules,
}) => {
  const s = useStrings();
  const { houses, activeHouseId, defenderHouseId, phase, log } = state;
  const active   = houses.find(h => h.id === activeHouseId);
  const defender = houses.find(h => h.id === defenderHouseId);
  const activeReinforce = computed.reinforceByHouse[activeHouseId];

  if (!active || !activeReinforce) return null;

  const phaseList = [
    { id: 'reinforce',  label: s.phaseReinforce  },
    { id: 'invade',     label: s.phaseInvade     },
    { id: 'objectives', label: s.phaseObjectives },
  ] as const;

  const houseColor = active.color;
  const houseTint  = active.tint;

  return (
    <View style={styles.handPanel}>

      <View style={[styles.handTitle, { backgroundColor: houseColor }]}>
        <Text style={styles.handTitleText}>{s.theHand}</Text>
      </View>

      {/* ── LEFT: House in Turn ─────────────────────────────────── */}
      <View style={styles.handLeft}>
        <Text style={styles.sectionLabel}>{s.houseInTurn}</Text>
        <View style={[styles.activeDisplay, { borderColor: houseColor, backgroundColor: houseTint }]}>
          <Image
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            source={require('../../assets/sigils/the hand.jpg')}
            style={styles.handPin}
            resizeMode="cover"
          />
          <Text style={styles.activeName} numberOfLines={1}>{active.name}</Text>
          <Sigil id={active.id} size={60} color={houseColor} />
          <Text style={styles.activeWords}>{active.words}</Text>
        </View>
      </View>

      {/* ── CENTER: Phase ribbon + content ──────────────────────── */}
      <View style={styles.handCenter}>

        <View style={styles.phaseRibbon}>
          {phaseList.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.phasePill,
                phase === p.id && { backgroundColor: houseColor, borderColor: houseColor },
              ]}
              onPress={() => dispatch({ type: 'set-phase', phase: p.id })}
            >
              <Text style={[styles.phasePillText, phase === p.id && styles.phasePillTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.phaseStage}>

          {/* ── REINFORCE ──────────────────────────────────────── */}
          {phase === 'reinforce' && (
            <View style={styles.reinforceCard}>
              <View style={styles.reinforceFormula}>
                <StepRow label={s.reinforceFormLine1}
                  right={`${active.territories} + ${active.castles} = ${active.territories + active.castles}`} />
                <StepRow label={s.reinforceFormLine2}
                  right={`${activeReinforce.baseArmies} ⚔`} borderTop />
                <StepRowAdjust label={s.reinforceFormBonus}
                  value={active.bonusArmies} borderTop
                  onMinus={() => dispatch({ type: 'adjust', field: 'bonusArmies', houseId: active.id, delta: -1 })}
                  onPlus={()  => dispatch({ type: 'adjust', field: 'bonusArmies', houseId: active.id, delta: +1 })} />
                <StepRow label={`Ports × 100 (+ ${activeReinforce.armies} armies × 100)`}
                  right={`${active.ports} ⚓ · ${activeReinforce.armies} ⚔`} borderTop />
              </View>
              <View style={styles.reinforceOutput}>
                <OutCard
                  icon={<IconArmy size={14} color={C.inkSoft} />}
                  label={s.reinforceArmies}
                  value={activeReinforce.armies}
                  unit="⚔"
                />
                <OutCard
                  icon={<IconGold size={14} color={C.inkSoft} />}
                  label={s.reinforceGold}
                  value={activeReinforce.gold}
                  unit="gp"
                />
              </View>
            </View>
          )}

          {/* ── INVADE ──────────────────────────────────────────── */}
          {phase === 'invade' && (
            <View style={styles.invadeCard}>
              <View style={styles.defenderStrip}>
                <Text style={styles.defenderPre}>{s.defender}</Text>
                <View style={styles.defenderChips}>
                  {[...houses].reverse().map(h => (
                    <TouchableOpacity
                      key={h.id}
                      style={[
                        styles.defChip,
                        defenderHouseId === h.id && styles.defChipActive,
                        h.id === activeHouseId && styles.defChipDisabled,
                      ]}
                      onPress={() =>
                        h.id !== activeHouseId &&
                        dispatch({ type: 'set-defender', houseId: defenderHouseId === h.id ? null : h.id })
                      }
                    >
                      <Sigil id={h.id} size={20} color={h.color} />
                      {defenderHouseId === h.id && (
                        <View style={styles.defChipX}>
                          <Text style={styles.defChipXText}>⚔</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                {defender && (
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => dispatch({ type: 'set-defender', houseId: null })}
                  >
                    <Text style={styles.clearBtnText}>{s.clear}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.entityRow}>
                <InvadeButton label={s.invadeTerritory} icon={<IconTerritory size={20} color={C.waxGold} />}
                  disabled={!defender}
                  onPlus={()  => dispatch({ type: 'transfer', field: 'territories', from: defenderHouseId!, to: activeHouseId, delta: 1 })}
                  onMinus={() => dispatch({ type: 'transfer', field: 'territories', from: activeHouseId, to: defenderHouseId!, delta: 1 })} />
                <InvadeButton label={s.invadeCastle} icon={<IconCastle size={20} color={C.waxGold} />}
                  disabled={!defender}
                  onPlus={()  => dispatch({ type: 'transfer', field: 'castles', from: defenderHouseId!, to: activeHouseId, delta: 1 })}
                  onMinus={() => dispatch({ type: 'transfer', field: 'castles', from: activeHouseId, to: defenderHouseId!, delta: 1 })} />
                <InvadeButton label={s.invadePort} icon={<IconPort size={20} color={C.waxGold} />}
                  disabled={!defender}
                  onPlus={()  => dispatch({ type: 'transfer', field: 'ports', from: defenderHouseId!, to: activeHouseId, delta: 1 })}
                  onMinus={() => dispatch({ type: 'transfer', field: 'ports', from: activeHouseId, to: defenderHouseId!, delta: 1 })} />
              </View>
            </View>
          )}

          {/* ── OBJECTIVES ──────────────────────────────────────── */}
          {phase === 'objectives' && (
            <View style={styles.vpCard}>
              <View style={styles.vpRow}>
                <View style={styles.vpInfo}>
                  <Text style={styles.vpLabel}>Victory Points · {active.name}</Text>
                  <Text style={styles.vpHint}>Score completed objectives &amp; end-of-turn awards</Text>
                </View>
                <Text style={styles.vpCurrent}>{active.vps}</Text>
                <View style={styles.pmBig}>
                  <TouchableOpacity style={styles.pmBigBtn}
                    onPress={() => dispatch({ type: 'adjust', field: 'vps', houseId: active.id, delta: -1 })}>
                    <Text style={styles.pmBigBtnText}>−</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pmBigBtn}
                    onPress={() => dispatch({ type: 'adjust', field: 'vps', houseId: active.id, delta: +1 })}>
                    <Text style={styles.pmBigBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.vpFooter}>{s.vpFooter}</Text>
            </View>
          )}

        </View>
      </View>

      {/* ── RIGHT: Action buttons ────────────────────────────────── */}
      <View style={styles.handRight}>
        <ActionBtn
          icon={<IconUndo size={16} color={C.inkSoft} />}
          label={s.btnUndo}
          hint={log[0]?.label || s.btnUndoHint}
          disabled={log.length === 0}
          onPress={() => dispatch({ type: 'undo' })}
        />
        <ActionBtn
          icon={<IconScroll size={16} color={C.inkSoft} />}
          label={s.btnLog}
          hint={`${log.length} ${s.btnLogHint}`}
          onPress={openLog}
        />
        <ActionBtn
          icon={<IconChart size={16} color={C.inkSoft} />}
          label={s.btnStandings}
          hint={s.btnStandingsHint}
          onPress={openLeaderboard}
        />
        <ActionBtn
          icon={<IconCog size={16} color={C.inkSoft} />}
          label={s.btnSetup}
          hint={s.btnSetupHint}
          onPress={openSettings}
        />
        <ActionBtn
          icon={<IconCrown size={16} color={C.inkSoft} />}
          label={s.btnRules}
          hint={s.btnRulesHint}
          onPress={openRules}
        />
      </View>

    </View>
  );
};

/* ── Reinforce sub-components ──────────────────────────────────── */

const StepRow: React.FC<{ label: string; right: string; borderTop?: boolean }> = ({ label, right, borderTop }) => (
  <View style={[styles.step, borderTop && styles.stepBorderTop]}>
    <Text style={styles.stepLabel}>{label}</Text>
    <Text style={styles.stepRight}>{right}</Text>
  </View>
);

const StepRowAdjust: React.FC<{
  label: string; value: number; step?: number; borderTop?: boolean;
  onMinus: () => void; onPlus: () => void;
}> = ({ label, value, borderTop, onMinus, onPlus }) => (
  <View style={[styles.step, borderTop && styles.stepBorderTop]}>
    <Text style={styles.stepLabel}>{label}</Text>
    <View style={styles.adjustRow}>
      <TouchableOpacity style={styles.microBtn} onPress={onMinus}>
        <Text style={styles.microBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.adjustVal}>{value}</Text>
      <TouchableOpacity style={styles.microBtn} onPress={onPlus}>
        <Text style={styles.microBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const OutCard: React.FC<{ icon: React.ReactNode; label: string; value: number; unit: string }> = ({
  icon, label, value, unit,
}) => (
  <View style={styles.outCard}>
    <View style={styles.outCardLeft}>
      {icon}
      <Text style={styles.outCardLabel}>{label}</Text>
    </View>
    <Text style={styles.outCardVal}>
      {value}<Text style={styles.outCardUnit}>{unit}</Text>
    </Text>
  </View>
);

/* ── Invade sub-components ─────────────────────────────────────── */

const InvadeButton: React.FC<{
  label: string; icon: React.ReactNode; disabled: boolean;
  onPlus: () => void; onMinus: () => void;
}> = ({ label, icon, disabled, onPlus, onMinus }) => (
  <View style={[styles.entityBtn, disabled && styles.entityBtnDisabled]}>
    <View style={styles.entityHeader}>
      <View style={styles.entityIco}>{icon}</View>
      <Text style={styles.entityLbl}>{label}</Text>
    </View>
    <View style={styles.entityPM}>
      <TouchableOpacity style={styles.pmSeize} onPress={onPlus} disabled={disabled} activeOpacity={0.75}>
        <Text style={styles.pmSeizeNum}>+1</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pmYield} onPress={onMinus} disabled={disabled} activeOpacity={0.75}>
        <Text style={styles.pmYieldNum}>−1</Text>
      </TouchableOpacity>
    </View>
  </View>
);

/* ── Action button ─────────────────────────────────────────────── */

const ActionBtn: React.FC<{
  icon: React.ReactNode; label: string; hint: string;
  disabled?: boolean; onPress: () => void;
}> = ({ icon, label, hint, disabled, onPress }) => (
  <TouchableOpacity
    style={[styles.actionBtn, disabled && styles.actionBtnDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.actionBtnIco}>{icon}</View>
    <View style={styles.actionBtnBody}>
      <Text style={styles.actionBtnLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
);

/* ── Styles ──────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  handPanel: {
    flexDirection: 'row',
    backgroundColor: '#e3d3ad',
    borderTopWidth: 1,
    borderTopColor: C.parchmentShadow,
    height: 230,
    position: 'relative',
  },
  handTitle: {
    position: 'absolute',
    top: -1,
    left: 22,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 20,
  },
  handTitleText: { ...T.handTitle, color: '#f3e2b8', textTransform: 'uppercase' },

  handLeft: {
    width: 200,
    paddingTop: 28,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: C.rule,
    borderStyle: 'dashed',
    gap: 10,
    justifyContent: 'space-between',
  },
  sectionLabel: { ...T.sectionLabel, color: C.inkFaint, textTransform: 'uppercase' },
  activeDisplay: {
    flexDirection: 'column',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  activeName:  { ...T.activeHouseName,  color: C.ink, textTransform: 'uppercase', justifyContent: 'center' },
  activeWords: { ...T.activeHouseWords, color: C.inkFaint, marginTop: 2 },
  handPin: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: C.waxGold,
    overflow: 'hidden',
  },

  handCenter: {
    flex: 1,
    paddingTop: 28,
    paddingBottom: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  phaseRibbon:      { flexDirection: 'row', gap: 8 },
  phasePill: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,250,235,.35)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.rule,
    alignItems: 'center',
  },
  phasePillText:       { ...T.phasePill, color: C.inkFaint, textTransform: 'uppercase' },
  phasePillTextActive: { color: '#ede0c2' },
  phaseStage:          { flex: 1 },

  reinforceCard:    { flexDirection: 'row', gap: 14, flex: 1 },
  reinforceFormula: {
    flex: 1,
    backgroundColor: 'rgba(255,250,235,.55)',
    borderWidth: 1,
    borderColor: C.rule,
    borderRadius: 10,
    padding: 10,
  },
  step:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 5 },
  stepBorderTop: { borderTopWidth: 1, borderTopColor: C.rule, borderStyle: 'dotted' },
  stepLabel:     { ...T.stepLabel,  flex: 1, color: C.inkSoft },
  stepRight:     { ...T.stepValue,  color: C.ink },
  adjustRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  microBtn: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 1, borderColor: C.rule,
    backgroundColor: 'rgba(255,250,235,.7)',
    justifyContent: 'center', alignItems: 'center',
  },
  microBtnText: { ...T.microBtnText, color: C.ink },
  adjustVal:    { ...T.adjustVal, color: C.ink, minWidth: 26, textAlign: 'center' },

  reinforceOutput: { flex: 1, gap: 8 },
  outCard: {
    flex: 1,
    borderWidth: 1, borderColor: C.waxGold, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: 'rgba(176,132,51,.10)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  outCardLeft:  { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  outCardLabel: { ...T.outCardLabel, color: C.inkSoft, textTransform: 'uppercase' },
  outCardVal:   { ...T.outCardValue, color: C.ink },
  outCardUnit:  { ...T.outCardUnit,  color: C.inkFaint, marginLeft: 4 },

  invadeCard:   { flex: 1, gap: 8 },
  defenderStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,250,235,.35)',
    borderWidth: 1, borderColor: C.rule, borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8,
  },
  defenderPre:  { ...T.defenderLabel, color: C.inkFaint, textTransform: 'uppercase', paddingHorizontal: 6 },
  defenderChips: { flex: 1, flexDirection: 'row', gap: 4 },
  defChip: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: C.rule,
    backgroundColor: C.parchment2,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  defChipActive:   { borderColor: C.waxRed, shadowColor: C.waxRed, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 0 } },
  defChipDisabled: { opacity: 0.35 },
  defChipX: {
    position: 'absolute', top: -4, right: -4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: C.waxRed, justifyContent: 'center', alignItems: 'center',
  },
  defChipXText:  { color: '#fff', fontSize: 8, lineHeight: 10 },
  clearBtn: {
    paddingHorizontal: 8, paddingVertical: 5,
    borderWidth: 1, borderColor: C.rule, borderRadius: 6,
    backgroundColor: 'rgba(255,250,235,.6)',
  },
  clearBtnText: { fontSize: 10, fontWeight: '600', color: C.ink },

  entityRow: { flex: 1, flexDirection: 'row', gap: 8 },
  entityBtn: {
    flex: 1, flexDirection: 'column', gap: 8,
    backgroundColor: 'rgba(255,250,235,.6)',
    borderWidth: 1.5, borderColor: C.parchmentShadow,
    borderRadius: 12, padding: 10,
  },
  entityBtnDisabled: { opacity: 0.4 },
  entityHeader:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  entityIco: {
    width: 32, height: 32,
    backgroundColor: 'rgba(176,132,51,.13)',
    borderRadius: 16, borderWidth: 1.5, borderColor: C.waxGold,
    justifyContent: 'center', alignItems: 'center',
  },
  entityLbl: { ...T.entityLabel, flex: 1, color: C.ink, textTransform: 'uppercase' },
  entityPM:  { flexDirection: 'row', gap: 6, flex: 1 },
  pmSeize: {
    flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.waxGold, borderRadius: 7, paddingVertical: 6,
  },
  pmSeizeNum: { ...T.pmBtnText, color: '#fff' },
  pmYield: {
    flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(138,24,24,.07)',
    borderWidth: 1, borderColor: 'rgba(138,24,24,.3)',
    borderRadius: 7, paddingVertical: 6,
  },
  pmYieldNum: { ...T.pmBtnText, color: C.waxRed },

  vpCard:    { flex: 1, gap: 10 },
  vpRow: {
    flexDirection: 'row', gap: 10, alignItems: 'center',
    backgroundColor: 'rgba(255,250,235,.55)',
    borderWidth: 1, borderColor: C.rule, borderRadius: 10, padding: 12,
  },
  vpInfo:    { flex: 1 },
  vpLabel:   { ...T.vpLabel,   color: C.inkSoft, textTransform: 'uppercase', marginBottom: 3 },
  vpHint:    { ...T.vpHint,    color: C.inkFaint },
  vpCurrent: { ...T.vpCurrent, color: C.waxRed, minWidth: 44, textAlign: 'center' },
  pmBig:     { flexDirection: 'row', gap: 6 },
  pmBigBtn: {
    width: 44, height: 44,
    borderWidth: 1, borderColor: C.rule, borderRadius: 10,
    backgroundColor: 'rgba(255,250,235,.8)',
    justifyContent: 'center', alignItems: 'center',
  },
  pmBigBtnText: { ...T.vpBigBtn, color: C.ink },
  vpFooter:     { ...T.vpFooter, color: C.inkFaint, textAlign: 'center' },

  handRight: {
    width: 220,
    paddingTop: 28,
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderLeftWidth: 1,
    borderLeftColor: C.rule,
    borderStyle: 'dashed',
    gap: 3,
    justifyContent: 'space-around',
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,250,235,.5)',
    borderWidth: 1, borderColor: C.rule, borderRadius: 10,
    paddingVertical: 5, paddingHorizontal: 12,
  },
  actionBtnDisabled: { opacity: 0.35 },
  actionBtnIco:      { width: 22, height: 22, justifyContent: 'center', alignItems: 'center' },
  actionBtnBody:     { flex: 1 },
  actionBtnLabel:    { ...T.actionBtnLabel, color: C.ink, textTransform: 'uppercase' },
  actionBtnHint:     { ...T.actionBtnHint,  color: C.inkFaint, marginTop: 1 },
});
