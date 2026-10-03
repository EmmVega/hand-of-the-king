/* =====================================================================
   OVERLAYS — Maester's Log + Leaderboard (Standings)
   ===================================================================== */

function LogOverlay({ state, onClose, onUndo }) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-panel" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-head">
          <h2>Maester's Log <small>— every move, in order of the Realm</small></h2>
          <button className="overlay-close" onClick={onClose}>✕</button>
        </div>
        <div className="overlay-body">
          {state.log.length === 0 ? (
            <div className="log-empty">No moves recorded yet. The Realm is still.</div>
          ) : (
            <div className="log-list">
              {state.log.map((e, i) => (
                <div key={e.id} className="log-entry">
                  <div className="when">Turn {e.turn} · #{state.log.length - i}</div>
                  <div className={"phase " + e.phase}>{e.phase}</div>
                  <div className="what">
                    <b>{e.label}</b>
                    {e.detail && <span style={{color:'var(--ink-faint)', marginLeft: 8, fontStyle: 'italic'}}>· {e.detail}</span>}
                  </div>
                  <div className={"delta " + (e.delta > 0 ? 'pos' : e.delta < 0 ? 'neg' : '')}>
                    {e.delta > 0 ? '+' : ''}{e.delta || ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="overlay-foot">
          {state.log.length > 0 && (
            <button className="action-btn" style={{display:'inline-grid', marginRight:8}} onClick={onUndo}>
              <span className="ico"><IconUndo size={14}/></span>
              <span>Undo Last</span>
              <span className="kbd">⌘Z</span>
            </button>
          )}
          <span>{state.log.length} {state.log.length === 1 ? 'entry' : 'entries'}</span>
        </div>
      </div>
    </div>
  );
}

function LeaderboardOverlay({ state, onClose }) {
  const ranked = [...state.houses]
    .map(h => ({
      ...h,
      total: h.territories + h.castles + h.ports,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return b.vps - a.vps;
    });

  const maxTotal = Math.max(...ranked.map(h => h.total), 1);

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-panel" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-head">
          <h2>Standings <small>— territory + castle + port</small></h2>
          <button className="overlay-close" onClick={onClose}>✕</button>
        </div>
        <div className="overlay-body">
          <div className="leaderboard">
            {ranked.map((h, i) => (
              <div key={h.id} className={"lb-row " + (i === 0 ? 'first' : '')}>
                <div className={"lb-rank r" + (i+1)}>
                  {i === 0 ? <IconCrown size={22} color="var(--wax-gold)"/> : (i+1)}
                </div>
                <div className="sigil-w"><Sigil id={h.id} size={30}/></div>
                <div className="name">
                  {h.name}
                  <small>{h.words}</small>
                </div>
                <div className="score">
                  {h.total}
                  <small>holdings</small>
                </div>
                <div>
                  <div className="lb-bar"><span style={{ width: (h.total / maxTotal * 100) + '%' }}/></div>
                  <div className="lb-breakdown">
                    <span><b>{h.territories}</b> T</span>
                    <span><b>{h.castles}</b> C</span>
                    <span><b>{h.ports}</b> P</span>
                    <span style={{marginLeft:'auto', color:'var(--wax-red)'}}><b>{h.vps}</b> VP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overlay-foot">If <i>Valar Morghulis</i> were drawn now, the leader takes the realm.</div>
      </div>
    </div>
  );
}

window.LogOverlay = LogOverlay;
window.LeaderboardOverlay = LeaderboardOverlay;

/* =====================================================================
   SETTINGS OVERLAY — Setup & restart.
   Edit player count, per-house entity counts, restart the game.
   ===================================================================== */

function SettingsOverlay({ state, dispatch, playerCount, order, setPlayerCount, onClose }) {
  const [confirming, setConfirming] = React.useState(false);

  const STATS = [
    { id: 'territories', label: 'Terr.',  step: 1   },
    { id: 'castles',     label: 'Castles', step: 1  },
    { id: 'ports',       label: 'Ports',   step: 1  },
    { id: 'vps',         label: 'VP',      step: 1  },
    { id: 'bonusArmies', label: 'Bonus ⚔', step: 1  },
    { id: 'bonusGold',   label: 'Bonus gp', step: 50 },
  ];

  const playingHouses = (order || []).map(id => state.houses.find(h => h.id === id)).filter(Boolean);

  const adjust = (houseId, field, delta) =>
    dispatch({ type: 'adjust', field, houseId, delta });

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-panel settings" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-head">
          <h2>Setup <small>— configure the realm before, or correct mid-game</small></h2>
          <button className="overlay-close" onClick={onClose}>✕</button>
        </div>

        <div className="overlay-body">
          {/* Global */}
          <div className="settings-row">
            <div className="settings-label">Houses at the table</div>
            <div className="player-count">
              {[2,3,4,5,6,7].map(n => (
                <button key={n}
                        className="pc-chip"
                        data-active={playerCount === n}
                        onClick={() => setPlayerCount(n)}>{n}</button>
              ))}
            </div>
          </div>

          {/* Per-house editor */}
          <div className="settings-row" style={{ alignItems: 'flex-start', marginTop: 18 }}>
            <div className="settings-label">Starting counts</div>
            <div className="settings-table">
              <div className="st-head">
                <div></div>
                {STATS.map(s => <div key={s.id} className="st-h">{s.label}</div>)}
              </div>
              {playingHouses.map((h, i) => (
                <div key={h.id} className="st-row" style={{ '--house-color': h.color, '--house-tint': h.tint }}>
                  <div className="st-house">
                    <span className="st-dot"/>
                    <div className="st-sigil"><Sigil id={h.id} size={20}/></div>
                    <span className="st-name">{h.name}</span>
                    <span className="st-order">{i + 1}</span>
                  </div>
                  {STATS.map(s => (
                    <div key={s.id} className="st-cell">
                      <button onClick={() => adjust(h.id, s.id, -s.step)}>−</button>
                      <span className="st-val">{h[s.id]}</span>
                      <button onClick={() => adjust(h.id, s.id, +s.step)}>+</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overlay-foot settings-foot">
          {confirming ? (
            <div style={{display:'flex', gap:10, alignItems:'center', justifyContent:'flex-end'}}>
              <span style={{color:'var(--ink)', fontFamily:'IM Fell English', fontStyle:'italic'}}>
                Restart the realm — clear all counts, log, and the turn marker?
              </span>
              <button className="ghost-btn" onClick={() => setConfirming(false)}>Cancel</button>
              <button className="danger-btn" onClick={() => { dispatch({ type: 'restart', firstId: (order && order[0]) }); setConfirming(false); onClose(); }}>
                Yes, new game
              </button>
            </div>
          ) : (
            <div style={{display:'flex', gap:10, alignItems:'center', justifyContent:'space-between', width:'100%'}}>
              <span style={{fontStyle:'italic', fontFamily:'IM Fell English'}}>
                Edits apply live. The log records each adjustment so any change can be undone.
              </span>
              <button className="danger-btn" onClick={() => setConfirming(true)}>
                New Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.SettingsOverlay = SettingsOverlay;
