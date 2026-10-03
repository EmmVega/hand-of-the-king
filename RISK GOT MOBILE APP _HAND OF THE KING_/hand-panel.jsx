/* =====================================================================
   HAND PANEL — the bottom strip, right-side up to The Hand.
   Phase-aware controls. Reinforce shows formula + output. Invade shows
   defender picker + entity transfer buttons. Maneuver is informational.
   Objectives shows VP +/- buttons.
   ===================================================================== */

function HandPanel({ state, dispatch, computed, openLog, openLeaderboard, openSettings }) {
  const { houses, activeHouseId, defenderHouseId, phase, log } = state;
  const active = houses.find(h => h.id === activeHouseId);
  const defender = houses.find(h => h.id === defenderHouseId);
  const activeReinforce = computed.reinforceByHouse[activeHouseId];

  const phaseList = [
    { id: 'reinforce',  label: 'Reinforce' },
    { id: 'invade',     label: 'Invade' },
    { id: 'objectives', label: 'Objectives' },
  ];

  return (
    <div className="hand-panel">
      <div className="hand-title"><IconHand size={11} color="#f3e2b8" />The Hand</div>

      {/* LEFT: active house */}
      <div className="hand-active">
        <div className="hand-section-label">House in Turn</div>
        <div className="hand-active-display">
          <div className="sigil"><Sigil id={active.id} size={36}/></div>
          <div>
            <div className="name">{active.name}</div>
            <div className="sub">{active.words}</div>
          </div>
        </div>
        <div className="hand-hint">
          <IconHand size={12}/> Tap any house — banner above or mini-card — to hand it the turn.
        </div>
      </div>

      {/* CENTER: phase ribbon + phase-specific stage */}
      <div className="hand-center">
        <div className="phase-ribbon">
          {phaseList.map(p => (
            <div key={p.id}
                 className="phase-pill"
                 data-active={phase === p.id}
                 onClick={() => dispatch({ type: 'set-phase', phase: p.id })}>
              {p.label}
            </div>
          ))}
        </div>

        <div className="phase-stage">
          {/* REINFORCE */}
          <div className="phase-card reinforce-card" data-on={phase === 'reinforce'}>
            <div className="reinforce-formula">
              <div className="step">
                <span>Territories + Castles</span>
                <span><b>{active.territories}</b> + <b>{active.castles}</b> = {active.territories + active.castles}</span>
              </div>
              <div className="step">
                <span>÷ 3 (rounded down, min 3, max 13)</span>
                <span><b>{activeReinforce.baseArmies}</b> ⚔</span>
              </div>
              <div className="step">
                <span>Region bonus armies</span>
                <span>
                  <button className="micro-btn" onClick={() => dispatch({ type: 'adjust', field: 'bonusArmies', houseId: active.id, delta: -1 })}>−</button>
                  <b style={{margin:'0 8px'}}>{active.bonusArmies}</b>
                  <button className="micro-btn" onClick={() => dispatch({ type: 'adjust', field: 'bonusArmies', houseId: active.id, delta: +1 })}>+</button>
                </span>
              </div>
              <div className="step">
                <span>Ports × 100 (+ active armies × 100)</span>
                <span><b>{active.ports}</b> ⚓ · <b>{activeReinforce.armies}</b> ⚔</span>
              </div>
              <div className="step">
                <span>Region bonus gold</span>
                <span>
                  <button className="micro-btn" onClick={() => dispatch({ type: 'adjust', field: 'bonusGold', houseId: active.id, delta: -50 })}>−</button>
                  <b style={{margin:'0 8px'}}>{active.bonusGold}</b>
                  <button className="micro-btn" onClick={() => dispatch({ type: 'adjust', field: 'bonusGold', houseId: active.id, delta: +50 })}>+</button>
                </span>
              </div>
            </div>
            <div className="reinforce-output">
              <div className="out-card">
                <span className="lbl"><IconArmy size={14}/> Armies to place</span>
                <span className="val">{activeReinforce.armies}<small>⚔</small></span>
              </div>
              <div className="out-card">
                <span className="lbl"><IconGold size={14}/> Gold income</span>
                <span className="val">{activeReinforce.gold}<small>gp</small></span>
              </div>
            </div>
          </div>

          {/* INVADE */}
          <div className="phase-card" data-on={phase === 'invade'} style={{ gridTemplateRows: 'auto 1fr' }}>
            <div className="defender-strip">
              <span className="pre">Defender</span>
              <div className="defender-chips">
                {houses.map(h => (
                  <div key={h.id}
                       className="def-chip"
                       data-active={defenderHouseId === h.id}
                       data-disabled={h.id === activeHouseId}
                       onClick={() => h.id !== activeHouseId && dispatch({ type: 'set-defender', houseId: defenderHouseId === h.id ? null : h.id })}
                       title={h.id === activeHouseId ? 'Attacker' : h.name}>
                    <Sigil id={h.id} size={22}/>
                    {defenderHouseId === h.id && <div className="x-mini">⚔</div>}
                  </div>
                ))}
              </div>
              {defender && (
                <button className="micro-btn" onClick={() => dispatch({ type: 'set-defender', houseId: null })}>
                  Clear
                </button>
              )}
            </div>

            <div className="entity-row">
              <InvadeButton entity="territories" label="Territory" icon={<IconTerritory size={16}/>}
                            disabled={!defender}
                            onPlus={() => dispatch({ type: 'transfer', field: 'territories', from: defenderHouseId, to: activeHouseId, delta: 1 })}
                            onMinus={() => dispatch({ type: 'transfer', field: 'territories', from: activeHouseId, to: defenderHouseId, delta: 1 })}/>
              <InvadeButton entity="castles" label="Castle" icon={<IconCastle size={16}/>}
                            disabled={!defender}
                            onPlus={() => dispatch({ type: 'transfer', field: 'castles', from: defenderHouseId, to: activeHouseId, delta: 1 })}
                            onMinus={() => dispatch({ type: 'transfer', field: 'castles', from: activeHouseId, to: defenderHouseId, delta: 1 })}/>
              <InvadeButton entity="ports" label="Port" icon={<IconPort size={16}/>}
                            disabled={!defender}
                            onPlus={() => dispatch({ type: 'transfer', field: 'ports', from: defenderHouseId, to: activeHouseId, delta: 1 })}
                            onMinus={() => dispatch({ type: 'transfer', field: 'ports', from: activeHouseId, to: defenderHouseId, delta: 1 })}/>
              <div className="entity-btn" style={{cursor:'default', background:'rgba(255,250,235,.25)'}}>
                <div className="ico"><IconHand size={16}/></div>
                <div className="lbl">Tip<br/><span style={{fontFamily:'IM Fell English',fontStyle:'italic',letterSpacing:0,textTransform:'none',color:'var(--ink-faint)'}}>+ adds to attacker</span></div>
              </div>
            </div>
          </div>

          {/* OBJECTIVES */}
          <div className="phase-card" data-on={phase === 'objectives'}>
            <div className="vp-row">
              <div>
                <div className="lbl">Victory Points · {active.name}</div>
                <div style={{fontFamily:'IM Fell English',fontStyle:'italic',fontSize:12,color:'var(--ink-faint)'}}>Score completed objectives & end-of-turn awards</div>
              </div>
              <div className="current">{active.vps}</div>
              <div className="pm-big">
                <button onClick={() => dispatch({ type: 'adjust', field: 'vps', houseId: active.id, delta: -1 })}>−</button>
                <button onClick={() => dispatch({ type: 'adjust', field: 'vps', houseId: active.id, delta: +1 })}>+</button>
              </div>
            </div>
            <div style={{
              fontFamily: 'IM Fell English, serif',
              fontStyle: 'italic',
              fontSize: 12,
              color: 'var(--ink-faint)',
              textAlign: 'center',
              marginTop: 4,
            }}>
              When the <b>Valar Morghulis</b> card is drawn, open the leaderboard to compare standings.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: actions */}
      <div className="hand-actions">
        <button className="action-btn" disabled={log.length === 0} onClick={() => dispatch({ type: 'undo' })}>
          <span className="ico"><IconUndo size={16}/></span>
          <span>Undo<br/><span style={{fontFamily:'IM Fell English',fontStyle:'italic',letterSpacing:0,textTransform:'none',fontSize:10,color:'var(--ink-faint)'}}>{log[0]?.label || 'no action yet'}</span></span>
          <span className="kbd">⌘Z</span>
        </button>
        <button className="action-btn" onClick={openLog}>
          <span className="ico"><IconScroll size={16}/></span>
          <span>Maester's Log<br/><span style={{fontFamily:'IM Fell English',fontStyle:'italic',letterSpacing:0,textTransform:'none',fontSize:10,color:'var(--ink-faint)'}}>{log.length} events</span></span>
          <span className="kbd">›</span>
        </button>
        <button className="action-btn" onClick={openLeaderboard}>
          <span className="ico"><IconChart size={16}/></span>
          <span>Full Standings<br/><span style={{fontFamily:'IM Fell English',fontStyle:'italic',letterSpacing:0,textTransform:'none',fontSize:10,color:'var(--ink-faint)'}}>detailed breakdown</span></span>
          <span className="kbd">›</span>
        </button>
        <button className="action-btn" onClick={openSettings}>
          <span className="ico"><IconCog size={16}/></span>
          <span>Setup<br/><span style={{fontFamily:'IM Fell English',fontStyle:'italic',letterSpacing:0,textTransform:'none',fontSize:10,color:'var(--ink-faint)'}}>players · counts · new game</span></span>
          <span className="kbd">›</span>
        </button>
        <div className="hand-foot">
          <span style={{fontFamily:'IM Fell English',fontStyle:'italic',fontSize:11,color:'var(--ink-faint)',textAlign:'center',display:'block'}}>
            ⌘Z undoes · Esc closes overlays
          </span>
        </div>
      </div>

      {/* Inline micro button style (used in formula card) */}
      <style>{`
        .micro-btn {
          width: 22px; height: 22px;
          border-radius: 4px;
          border: 1px solid var(--rule);
          background: rgba(255,250,235,.7);
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 12px;
          color: var(--ink);
          cursor: pointer;
          line-height: 1;
        }
        .micro-btn:hover { border-color: var(--wax-gold); background: rgba(176,132,51,.18); }
        .micro-btn:active { transform: scale(.92); }
      `}</style>
    </div>
  );
}

function InvadeButton({ entity, label, icon, disabled, onPlus, onMinus }) {
  return (
    <div className="entity-btn" style={{ opacity: disabled ? 0.45 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div className="ico">{icon}</div>
      <div className="lbl">{label}</div>
      <div className="pm">
        <button className="plus" onClick={onPlus}>+1</button>
        <button className="minus" onClick={onMinus}>−1</button>
      </div>
    </div>
  );
}

window.HandPanel = HandPanel;
