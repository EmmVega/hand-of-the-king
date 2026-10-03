import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { GameState, GameAction, HouseId } from '../types/game';
import { Language } from '../lib/strings';
import { Sigil, IconUndo, IconCrown } from './Sigils';
import { computeTotal } from '../lib/formulas';
import { T } from '../lib/typography';
import { useStrings, useLanguage } from '../lib/LanguageContext';

const COLORS = {
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

/* =====================================================================
   LOG OVERLAY
   ===================================================================== */

export const LogOverlay: React.FC<{
  state: GameState;
  onClose: () => void;
  onUndo: () => void;
}> = ({ state, onClose, onUndo }) => {
  const s = useStrings();
  const count = state.log.length;
  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.panel} activeOpacity={1} onPress={() => {}}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>{s.logTitle}</Text>
              <Text style={styles.panelSubtitle}>{s.logSubtitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.panelBody}>
            {count === 0 ? (
              <Text style={styles.emptyMsg}>{s.logEmpty}</Text>
            ) : (
              state.log.map((entry, i) => (
                <View key={entry.id} style={styles.logEntry}>
                  <View style={[
                    styles.logAccent,
                    entry.delta > 0 ? styles.logAccentPos : entry.delta < 0 ? styles.logAccentNeg : styles.logAccentNeutral,
                  ]} />
                  <View style={styles.logBody}>
                    <View style={styles.logMeta}>
                      <Text style={styles.logPhase}>{entry.phase.toUpperCase()}</Text>
                      <Text style={styles.logWhen}>Turn {entry.turn} · #{count - i}</Text>
                    </View>
                    <View style={styles.logContent}>
                      <View style={styles.logWhat}>
                        <Text style={styles.logLabel}>{entry.label}</Text>
                        {entry.detail && <Text style={styles.logDetail}>{entry.detail}</Text>}
                      </View>
                      {entry.delta !== 0 && (
                        <View style={[
                          styles.logDeltaBadge,
                          entry.delta > 0 ? styles.logDeltaBadgePos : styles.logDeltaBadgeNeg,
                        ]}>
                          <Text style={[
                            styles.logDeltaText,
                            { color: entry.delta > 0 ? COLORS.waxGold : COLORS.waxRed },
                          ]}>
                            {entry.delta > 0 ? '+' : ''}{entry.delta}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.panelFooter}>
            {count > 0 && (
              <TouchableOpacity style={styles.actionBtn} onPress={onUndo}>
                <IconUndo size={14} color={COLORS.ink} />
                <Text style={styles.actionBtnText}>{s.logUndoLast}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.footerText}>
              {count} {count === 1 ? s.logEntry : s.logEntries}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/* =====================================================================
   LEADERBOARD OVERLAY
   ===================================================================== */

export const LeaderboardOverlay: React.FC<{
  houses: GameState['houses'];
  onClose: () => void;
}> = ({ houses, onClose }) => {
  const s = useStrings();
  const ranked = [...houses]
    .map(h => ({ ...h, total: computeTotal(h) }))
    .sort((a, b) => b.total !== a.total ? b.total - a.total : b.vps - a.vps);
  const maxTotal = Math.max(...ranked.map(h => h.total), 1);

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.panel} activeOpacity={1} onPress={() => {}}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>{s.lbTitle}</Text>
              <Text style={styles.panelSubtitle}>{s.lbSubtitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.panelBody}>
            {ranked.map((h, i) => (
              <View key={h.id} style={[styles.lbRow, i === 0 && styles.lbRowFirst]}>
                <View style={styles.lbRank}>
                  {i === 0 ? <IconCrown size={22} color={COLORS.waxGold} /> : <Text>{i + 1}</Text>}
                </View>
                <View style={styles.lbSigil}>
                  <Sigil id={h.id} size={30} color={h.color} />
                </View>
                <View style={styles.lbInfo}>
                  <Text style={styles.lbName}>{h.name}</Text>
                  <Text style={styles.lbWords}>{h.words}</Text>
                </View>
                <View style={styles.lbScore}>
                  <Text style={styles.lbScoreNum}>{h.total}</Text>
                  <Text style={styles.lbScoreLabel}>{s.lbHoldings}</Text>
                </View>
                <View style={styles.lbBarContainer}>
                  <View style={styles.lbBar}>
                    <View style={[styles.lbBarFill, { width: `${(h.total / maxTotal) * 100}%`, backgroundColor: h.color }]} />
                  </View>
                  <View style={styles.lbBreakdown}>
                    <Text style={styles.lbBreakdownItem}><Text style={{ fontWeight: '700' }}>{h.territories}</Text> T</Text>
                    <Text style={styles.lbBreakdownItem}><Text style={{ fontWeight: '700' }}>{h.castles}</Text> C</Text>
                    <Text style={styles.lbBreakdownItem}><Text style={{ fontWeight: '700' }}>{h.ports}</Text> P</Text>
                    <Text style={[styles.lbBreakdownItem, { color: COLORS.waxRed }]}>
                      <Text style={{ fontWeight: '700' }}>{h.vps}</Text> VP
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.panelFooter}>
            <Text style={styles.footerText}>{s.lbFooter}</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/* =====================================================================
   SETTINGS OVERLAY
   ===================================================================== */

export const SettingsOverlay: React.FC<{
  state: GameState;
  dispatch: (action: GameAction) => void;
  playerCount: 2 | 3 | 4 | 5 | 6 | 7;
  visibleOrder: HouseId[];
  setPlayerCount: (count: 2 | 3 | 4 | 5 | 6 | 7) => void;
  setLanguage: (lang: Language) => void;
  onClose: () => void;
}> = ({ state, dispatch, playerCount, visibleOrder, setPlayerCount, setLanguage, onClose }) => {
  const s = useStrings();
  const currentLang = useLanguage();
  const [confirming, setConfirming] = useState(false);

  const STATS = [
    { id: 'territories', label: s.setupColTerr,    step: 1 },
    { id: 'castles',     label: s.setupColCastles, step: 1 },
    { id: 'ports',       label: s.setupColPorts,   step: 1 },
    { id: 'vps',         label: s.setupColVP,      step: 1 },
    { id: 'bonusArmies', label: s.setupColBonus,   step: 1 },
  ];

  const playingHouses = (visibleOrder || [])
    .map(id => state.houses.find(h => h.id === id))
    .filter(Boolean) as GameState['houses'];

  const adjust = (houseId: HouseId, field: string, delta: number) => {
    dispatch({ type: 'adjust', field, houseId, delta });
  };

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.panel} activeOpacity={1} onPress={() => {}}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>{s.setupTitle}</Text>
              <Text style={styles.panelSubtitle}>{s.setupSubtitle}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.langToggle}>
                {(['en', 'es'] as Language[]).map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.langChip, currentLang === lang && styles.langChipActive]}
                    onPress={() => setLanguage(lang)}
                  >
                    <Text style={[styles.langChipText, currentLang === lang && styles.langChipTextActive]}>
                      {lang === 'en' ? 'EN' : 'ES'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.panelBody}>
            {/* Player Count */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>{s.setupHousesLabel}</Text>
              <View style={styles.playerCountRow}>
                {[2, 3, 4, 5, 6, 7].map((n: any) => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.pcChip, playerCount === n && styles.pcChipActive]}
                    onPress={() => setPlayerCount(n)}
                  >
                    <Text style={[styles.pcChipText, playerCount === n && styles.pcChipTextActive]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Per-house editor */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>{s.setupCountsLabel}</Text>
              <View style={styles.settingsTable}>
                <View style={styles.stHead}>
                  <View style={styles.stHeaderCell} />
                  {STATS.map(col => (
                    <View key={col.id} style={styles.stHeaderCell}>
                      <Text style={styles.stHeaderText}>{col.label}</Text>
                    </View>
                  ))}
                </View>
                {playingHouses.map((h, i) => (
                  <View key={h.id} style={[styles.stRow, { backgroundColor: `${h.color}22` }]}>
                    <View style={styles.stHouse}>
                      <View style={[styles.stDot, { backgroundColor: h.color }]} />
                      <View style={styles.stSigil}>
                        <Sigil id={h.id} size={16} color={h.color} />
                      </View>
                      <Text style={styles.stName}>{h.name}</Text>
                      <Text style={styles.stOrder}>{i + 1}</Text>
                    </View>
                    {STATS.map(col => (
                      <View key={col.id} style={styles.stCell}>
                        <TouchableOpacity onPress={() => adjust(h.id, col.id, -col.step)} style={styles.stBtn}>
                          <Text>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.stVal}>{h[col.id as keyof typeof h]}</Text>
                        <TouchableOpacity onPress={() => adjust(h.id, col.id, +col.step)} style={styles.stBtn}>
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.panelFooter}>
            {confirming ? (
              <View style={styles.confirmRow}>
                <Text style={styles.confirmText}>{s.setupConfirm}</Text>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirming(false)}>
                  <Text style={styles.cancelBtnText}>{s.setupCancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dangerBtn}
                  onPress={() => {
                    const order = visibleOrder || [];
                    const seedFn = (id: HouseId) => {
                      const idx = order.indexOf(id);
                      let territories = 0;
                      if (playerCount === 2) territories = 12;
                      else if (playerCount === 3) territories = 16;
                      else if (playerCount === 4) territories = 12;
                      else if (playerCount === 5) territories = idx <= 2 ? 10 : 9;
                      return { territories, castles: 0, ports: 0, vps: 0, bonusArmies: 0 };
                    };
                    dispatch({ type: 'restart', seedFn, firstId: order[0] });
                    setConfirming(false);
                    onClose();
                  }}
                >
                  <Text style={styles.dangerBtnText}>{s.setupYes}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.normalFooter}>
                <Text style={styles.footerText}>{s.setupEditsLive}</Text>
                <TouchableOpacity style={styles.dangerBtn} onPress={() => setConfirming(true)}>
                  <Text style={styles.dangerBtnText}>{s.setupNewGame}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/* =====================================================================
   CUSTOM RULES OVERLAY
   ===================================================================== */

export const CustomRulesOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const s = useStrings();

  const ROLES = [
    { title: s.role1Title, desc: s.role1Desc },
    { title: s.role2Title, desc: s.role2Desc },
    { title: s.role3Title, desc: s.role3Desc },
    { title: s.role4Title, desc: s.role4Desc },
    { title: s.role5Title, desc: s.role5Desc },
    { title: s.role6Title, desc: s.role6Desc },
    { title: s.role7Title, desc: s.role7Desc },
  ];

  const SUGGESTED = [
    { title: s.role7aTitle, desc: s.role7aDesc },
    { title: s.role7bTitle, desc: s.role7bDesc },
    { title: s.role7cTitle, desc: s.role7cDesc },
  ];

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.panel} activeOpacity={1} onPress={() => {}}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>{s.rulesTitle}</Text>
              <Text style={styles.panelSubtitle}>{s.rulesSubtitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.panelBody}>

            {/* <View style={styles.crSection}>
              <Text style={styles.crSectionTitle}>{s.rulesAboutTitle}</Text>
              <View style={styles.crCard}>
                <Text style={styles.crCardBody}>{s.rulesAboutBody}</Text>
              </View>
            </View> */}

            <View style={styles.crSection}>
              <Text style={styles.crSectionTitle}>{s.rulesTableTitle}</Text>
              <View style={[styles.crCard, styles.crRuleCard]}>
                <View style={styles.crRuleDot} />
                <Text style={styles.crCardBody}>{s.rulesMaesterCard}</Text>
              </View>
            </View>

            <View style={styles.crSection}>
              <Text style={styles.crSectionTitle}>{s.rulesRolesTitle}</Text>
              {ROLES.map((r, i) => (
                <View key={r.title} style={styles.crRoleRow}>
                  <View style={styles.crRoleNum}>
                    <Text style={styles.crRoleNumText}>{i + 1}</Text>
                  </View>
                  <View style={styles.crRoleBody}>
                    <Text style={styles.crRoleTitle}>{r.title}</Text>
                    <Text style={styles.crRoleDesc}>{r.desc}</Text>
                  </View>
                </View>
              ))}

              {/* <Text style={styles.crSuggestedLabel}>{s.rulesSuggested7th}</Text>
              {SUGGESTED.map(r => (
                <View key={r.title} style={[styles.crRoleRow, styles.crRoleRowSuggested]}>
                  <View style={[styles.crRoleNum, styles.crRoleNumSuggested]}>
                    <Text style={[styles.crRoleNumText, styles.crRoleNumTextSuggested]}>?</Text>
                  </View>
                  <View style={styles.crRoleBody}>
                    <Text style={[styles.crRoleTitle, styles.crRoleTitleSuggested]}>{r.title}</Text>
                    <Text style={styles.crRoleDesc}>{r.desc}</Text>
                  </View>
                </View>
              ))} */}
            </View>

          </ScrollView>

          <View style={styles.panelFooter}>
            <Text style={styles.footerText}>{s.rulesFooter}</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/* =====================================================================
   STYLES
   ===================================================================== */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    backgroundColor: COLORS.parchment,
    borderRadius: 12,
    width: '85%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rule,
  },
  panelTitle:    { ...T.panelTitle,    color: COLORS.ink },
  panelSubtitle: { ...T.panelSubtitle, color: COLORS.inkFaint, marginTop: 2 },
  closeBtn:      { ...T.closeBtn,      color: COLORS.ink },
  panelBody:     { padding: 16 },

  emptyMsg: { ...T.logEmpty, color: COLORS.inkFaint, textAlign: 'center' },

  // Log
  logEntry: {
    flexDirection: 'row', marginBottom: 8, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.rule,
    backgroundColor: 'rgba(255,252,242,0.6)', overflow: 'hidden',
  },
  logAccent:        { width: 4 },
  logAccentPos:     { backgroundColor: COLORS.waxGold },
  logAccentNeg:     { backgroundColor: COLORS.waxRed },
  logAccentNeutral: { backgroundColor: COLORS.rule },
  logBody:    { flex: 1, padding: 10, gap: 6 },
  logMeta:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logPhase: {
    ...T.logPhase,
    color: COLORS.waxGold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    backgroundColor: 'rgba(176,132,51,.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  logWhen:    { ...T.logWhen,   color: COLORS.inkFaint },
  logContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logWhat:    { flex: 1 },
  logLabel:   { ...T.logLabel,  color: COLORS.ink },
  logDetail:  { ...T.logDetail, color: COLORS.inkFaint, marginTop: 2 },
  logDeltaBadge: {
    minWidth: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, paddingHorizontal: 4,
  },
  logDeltaBadgePos: { borderColor: COLORS.waxGold, backgroundColor: 'rgba(176,132,51,.1)' },
  logDeltaBadgeNeg: { borderColor: COLORS.waxRed,  backgroundColor: 'rgba(138,24,24,.08)' },
  logDeltaText: { ...T.logDelta },

  // Footer
  panelFooter: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.rule,
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row', gap: 6, alignItems: 'center',
    paddingVertical: 6, paddingHorizontal: 12,
    backgroundColor: 'rgba(255,250,235,.5)',
    borderRadius: 6, borderWidth: 1, borderColor: COLORS.rule,
  },
  actionBtnText: { ...T.actionBtnText, color: COLORS.ink },
  footerText:    { ...T.footerText,    flex: 1, color: COLORS.inkFaint },

  // Leaderboard
  lbRow: {
    flexDirection: 'row', gap: 10, alignItems: 'center',
    marginBottom: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.rule,
  },
  lbRowFirst: {
    backgroundColor: 'rgba(176,132,51,.08)',
    paddingHorizontal: 8, paddingVertical: 8,
    borderRadius: 8, marginBottom: 12,
  },
  lbRank:    { width: 28, justifyContent: 'center', alignItems: 'center' },
  lbSigil: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,248,224,.8)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.parchmentShadow,
  },
  lbInfo:       { flex: 1, minWidth: 0 },
  lbName:       { ...T.lbName,       color: COLORS.ink },
  lbWords:      { ...T.lbWords,      color: COLORS.inkFaint, marginTop: 2 },
  lbScore:      { alignItems: 'center', gap: 2 },
  lbScoreNum:   { ...T.lbScore,      color: COLORS.ink },
  lbScoreLabel: { ...T.lbScoreLabel, color: COLORS.inkFaint },
  lbBarContainer: { flex: 2, gap: 4, minWidth: 0 },
  lbBar: {
    height: 8,
    backgroundColor: 'rgba(255,250,235,.5)',
    borderRadius: 4, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.rule,
  },
  lbBarFill:       { height: '100%' },
  lbBreakdown:     { flexDirection: 'row', gap: 4 },
  lbBreakdownItem: { ...T.lbBreakdown, color: COLORS.inkFaint },

  // Header right cluster
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langToggle: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.rule,
    overflow: 'hidden',
  },
  langChip: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(255,250,235,.4)',
  },
  langChipActive: {
    backgroundColor: COLORS.waxGold,
  },
  langChipText:       { ...T.pcChip, color: COLORS.inkFaint },
  langChipTextActive: { ...T.pcChip, color: '#fff' },

  // Settings
  settingsRow:    { marginBottom: 20 },
  settingsLabel:  { ...T.settingsLabel, color: COLORS.ink, marginBottom: 8 },
  playerCountRow: { flexDirection: 'row', gap: 6 },
  pcChip: {
    flex: 1, paddingVertical: 8, paddingHorizontal: 6,
    backgroundColor: 'rgba(255,250,235,.5)',
    borderRadius: 6, borderWidth: 1, borderColor: COLORS.rule,
  },
  pcChipActive:     { backgroundColor: COLORS.waxGold, borderColor: COLORS.waxGold },
  pcChipText:       { ...T.pcChip, color: COLORS.ink, textAlign: 'center' },
  pcChipTextActive: { color: '#fff' },
  settingsTable: {
    backgroundColor: 'rgba(255,250,235,.3)',
    borderRadius: 8, overflow: 'hidden',
  },
  stHead: {
    flexDirection: 'row',
    backgroundColor: 'rgba(176,132,51,.1)',
    paddingHorizontal: 8, paddingVertical: 6,
  },
  stHeaderCell: { flex: 1, alignItems: 'center' },
  stHeaderText: { ...T.stHeader, color: COLORS.inkFaint },
  stRow: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: COLORS.rule,
    paddingHorizontal: 8, paddingVertical: 8,
  },
  stHouse: { flex: 1.2, flexDirection: 'row', gap: 6, alignItems: 'center' },
  stDot:   { width: 6, height: 6, borderRadius: 3 },
  stSigil: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: 'rgba(255,248,224,.8)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.parchmentShadow,
  },
  stName:  { ...T.stName,  flex: 1, color: COLORS.ink },
  stOrder: { ...T.stOrder, color: COLORS.inkFaint },
  stCell:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  stBtn: {
    width: 18, height: 18, borderRadius: 3,
    backgroundColor: 'rgba(176,132,51,.2)',
    borderWidth: 1, borderColor: COLORS.rule,
    justifyContent: 'center', alignItems: 'center',
  },
  stVal: { ...T.stVal, color: COLORS.ink, minWidth: 18, textAlign: 'center' },
  confirmRow:    { gap: 8, alignItems: 'center', flexDirection: 'row' },
  confirmText:   { ...T.confirmText, flex: 1, color: COLORS.ink },
  cancelBtn:     { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255,250,235,.5)', borderRadius: 6, borderWidth: 1, borderColor: COLORS.rule },
  cancelBtnText: { ...T.cancelBtnText, color: COLORS.ink },
  dangerBtn:     { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: COLORS.waxRed, borderRadius: 6 },
  dangerBtnText: { ...T.dangerBtnText, color: '#fff' },
  normalFooter:  { flexDirection: 'row', gap: 12, alignItems: 'center' },

  // Custom Rules
  crSection:      { marginBottom: 20 },
  crSectionTitle: { ...T.crSectionTitle, color: COLORS.inkFaint, textTransform: 'uppercase', marginBottom: 8 },
  crCard: {
    backgroundColor: 'rgba(255,250,235,.5)',
    borderWidth: 1, borderColor: COLORS.rule, borderRadius: 8, padding: 12,
  },
  crRuleCard:  { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  crRuleDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.waxGold, marginTop: 5 },
  crCardBody:  { ...T.crBody, flex: 1, color: COLORS.inkSoft },
  crRoleRow: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: 'rgba(255,250,235,.4)',
    borderWidth: 1, borderColor: COLORS.rule, borderRadius: 8, padding: 10,
  },
  crRoleRowSuggested: { borderStyle: 'dashed', backgroundColor: 'rgba(176,132,51,.04)' },
  crRoleNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.waxGold,
    justifyContent: 'center', alignItems: 'center', marginTop: 1,
  },
  crRoleNumSuggested:     { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.waxGold },
  crRoleNumText:          { ...T.crRoleNum, color: '#fff' },
  crRoleNumTextSuggested: { color: COLORS.waxGold },
  crRoleBody:             { flex: 1, gap: 2 },
  crRoleTitle:            { ...T.crRoleTitle, color: COLORS.ink },
  crRoleTitleSuggested:   { ...T.crRoleTitleSug, color: COLORS.inkSoft },
  crRoleDesc:             { ...T.crRoleDesc, color: COLORS.inkFaint, fontSize: 14 },
  crSuggestedLabel:       { ...T.crSuggestedLabel, color: COLORS.waxGold, textTransform: 'uppercase', marginTop: 8, marginBottom: 6 },
});
