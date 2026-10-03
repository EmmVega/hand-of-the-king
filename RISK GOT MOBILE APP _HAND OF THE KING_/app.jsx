/* =====================================================================
   APP — Hand of the King companion for RISK GOT (iPad MVP)
   ===================================================================== */

const HOUSES = [
  { id: 'stark',     name: 'Stark',     words: 'Winter is Coming',    color: '#6e7a85', tint: 'rgba(110,122,133,0.18)' },
  { id: 'lannister', name: 'Lannister', words: 'Hear Me Roar',        color: '#b8860b', tint: 'rgba(184,134,11,0.18)'  },
  { id: 'targaryen', name: 'Targaryen', words: 'Fire and Blood',      color: '#a01818', tint: 'rgba(160,24,24,0.18)'   },
  { id: 'baratheon', name: 'Baratheon', words: 'Ours is the Fury',    color: '#1f1a14', tint: 'rgba(31,26,20,0.20)'    },
  { id: 'tyrell',    name: 'Tyrell',    words: 'Growing Strong',      color: '#3f6b2b', tint: 'rgba(63,107,43,0.18)'   },
  { id: 'martell',   name: 'Martell',   words: 'Unbowed Unbent',      color: '#b85219', tint: 'rgba(184,82,25,0.18)'   },
  { id: 'ghiscari',  name: 'Ghiscari',  words: 'From the Ashes',      color: '#1e3a72', tint: 'rgba(30,58,114,0.18)'   },
];

/* Which houses play, and in what turn order, for each player count.
   Driven by the RISK GOT rulebook. */
const HOUSE_SETS = {
  2: ['targaryen', 'ghiscari'],
  3: ['stark', 'baratheon', 'lannister'],
  4: ['stark', 'baratheon', 'lannister', 'tyrell'],
  5: ['stark', 'baratheon', 'lannister', 'tyrell', 'martell'],
  6: ['stark', 'targaryen', 'baratheon', 'lannister', 'ghiscari', 'tyrell'],
  7: ['stark', 'targaryen', 'baratheon', 'lannister', 'ghiscari', 'tyrell', 'martell'],
};

const PHASES = ['reinforce', 'invade', 'objectives'];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "parchment",
  "density": "spacious",
  "showFormula": true,
  "playerCount": 7
}/*EDITMODE-END*/;

/* ---------- State ---------- */
function makeHouse(meta) {
  // Demo starting numbers, varied so the prototype feels alive.
  const seed = {
    stark:     { territories: 10, castles: 3, ports: 1, vps: 2, bonusArmies: 2, bonusGold: 0 },
    lannister: { territories: 12, castles: 4, ports: 1, vps: 3, bonusArmies: 0, bonusGold: 100 },
    targaryen: { territories: 4,  castles: 1, ports: 2, vps: 1, bonusArmies: 0, bonusGold: 0 },
    baratheon: { territories: 7,  castles: 2, ports: 2, vps: 1, bonusArmies: 1, bonusGold: 0 },
    tyrell:    { territories: 9,  castles: 2, ports: 1, vps: 2, bonusArmies: 2, bonusGold: 50 },
    martell:   { territories: 6,  castles: 2, ports: 1, vps: 0, bonusArmies: 1, bonusGold: 0 },
    ghiscari:  { territories: 5,  castles: 1, ports: 1, vps: 0, bonusArmies: 0, bonusGold: 0 },
  }[meta.id] || { territories: 5, castles: 1, ports: 1, vps: 0, bonusArmies: 0, bonusGold: 0 };
  return { ...meta, ...seed };
}

const INITIAL_STATE = {
  houses: HOUSES.map(makeHouse),
  activeHouseId: 'stark',
  defenderHouseId: null,
  phase: 'reinforce',
  turn: 1,
  log: [],              // newest first
  redoStack: [],
  toast: null,
};

/* ---------- Formulas ---------- */
function computeReinforce(h) {
  const tc = h.territories + h.castles;
  const raw = Math.floor(tc / 3);
  const baseArmies = Math.max(3, Math.min(13, raw));
  const armies = baseArmies + (h.bonusArmies || 0);
  const gold = (armies + h.ports) * 100 + (h.bonusGold || 0);
  return { baseArmies, armies, gold };
}

/* ---------- Reducer ---------- */
let _idCtr = 1;
const nid = () => `e${_idCtr++}`;

function reducer(state, action) {
  switch (action.type) {

    case 'set-active':
    case 'select-turn': {
      if (state.activeHouseId === action.houseId) return state;
      const newHouse = state.houses.find(h => h.id === action.houseId);
      const order = action.order || state.houses.map(h => h.id);
      const oldIdx = order.indexOf(state.activeHouseId);
      const newIdx = order.indexOf(action.houseId);
      // Detect new round: if the new active comes before the old one in the
      // turn order, bump the turn counter. Only valid if both are in order.
      const wraps = oldIdx !== -1 && newIdx !== -1 && newIdx <= oldIdx;
      const turn = wraps && !action.silent ? state.turn + 1 : state.turn;
      // Phase resets to reinforce when a new house takes the turn (unless silent).
      const phase = action.silent ? state.phase : 'reinforce';
      const log = action.silent ? state.log : [{
        id: nid(),
        turn: state.turn,
        phase: 'turn',
        label: `${newHouse.name} takes the turn`,
        detail: `← ${state.houses.find(h => h.id === state.activeHouseId).name}${wraps ? ` · round ${turn}` : ''}`,
        delta: 0,
        snapshot: { activeHouseId: state.activeHouseId, defenderHouseId: state.defenderHouseId, phase: state.phase, turn: state.turn },
      }, ...state.log];
      return {
        ...state,
        activeHouseId: action.houseId,
        defenderHouseId: null,
        phase,
        turn,
        log,
        toast: { msg: `${newHouse.name}'s turn`, t: Date.now() },
      };
    }

    case 'set-phase': {
      return { ...state, phase: action.phase };
    }

    case 'set-defender': {
      return { ...state, defenderHouseId: action.houseId };
    }

    case 'adjust': {
      // Adjust a stat on one house. Used for bonus inputs, VP +/-.
      const { field, houseId, delta } = action;
      const houses = state.houses.map(h => {
        if (h.id !== houseId) return h;
        let next = (h[field] || 0) + delta;
        if (field === 'vps' || field === 'bonusGold') next = Math.max(0, next);
        else if (field === 'bonusArmies') next = Math.max(0, Math.min(20, next));
        else next = Math.max(0, next);
        return { ...h, [field]: next };
      });
      const house = houses.find(h => h.id === houseId);
      const oldHouse = state.houses.find(h => h.id === houseId);
      if (house[field] === oldHouse[field]) return state;
      const fieldLabels = {
        vps: 'VP', bonusArmies: 'Bonus armies', bonusGold: 'Bonus gold',
        territories: 'Territory', castles: 'Castle', ports: 'Port',
      };
      const log = [{
        id: nid(),
        turn: state.turn,
        phase: state.phase,
        label: `${house.name} · ${fieldLabels[field]}`,
        detail: `${oldHouse[field]} → ${house[field]}`,
        delta,
        snapshot: { houses: state.houses },
      }, ...state.log];
      return { ...state, houses, log };
    }

    case 'transfer': {
      // Move one unit of `field` between two houses.
      const { field, from, to, delta } = action;
      if (!from || !to || from === to) return state;
      const fromHouse = state.houses.find(h => h.id === from);
      if (fromHouse[field] - delta < 0) {
        return { ...state, toast: { msg: `${fromHouse.name} has no ${field} left`, t: Date.now() } };
      }
      const houses = state.houses.map(h => {
        if (h.id === from) return { ...h, [field]: h[field] - delta };
        if (h.id === to)   return { ...h, [field]: h[field] + delta };
        return h;
      });
      const fromN = state.houses.find(h => h.id === from);
      const toN = state.houses.find(h => h.id === to);
      const fieldLabel = { territories: 'territory', castles: 'castle', ports: 'port' }[field];
      const log = [{
        id: nid(),
        turn: state.turn,
        phase: 'invade',
        label: `${toN.name} takes ${fieldLabel} from ${fromN.name}`,
        detail: null,
        delta,
        snapshot: { houses: state.houses },
      }, ...state.log];
      return { ...state, houses, log };
    }

    case 'restart': {
      const seedFn = action.seedFn;
      return {
        ...INITIAL_STATE,
        houses: state.houses.map((h, i) => {
          // Keep meta (id, name, words, color, tint); reset numeric fields.
          const meta = HOUSES[i];
          const reset = seedFn ? seedFn(h.id) : { territories: 0, castles: 0, ports: 0, vps: 0, bonusArmies: 0, bonusGold: 0 };
          return { ...meta, ...reset };
        }),
        activeHouseId: action.firstId || state.houses[0].id,
        toast: { msg: 'New game — board cleared.', t: Date.now() },
      };
    }

    case 'set-count': {
      const { field, houseId, value } = action;
      const houses = state.houses.map(h => {
        if (h.id !== houseId) return h;
        const next = Math.max(0, Number.isFinite(value) ? value : 0);
        return { ...h, [field]: next };
      });
      return { ...state, houses };
    }

    case 'undo': {
      if (state.log.length === 0) return state;
      const [last, ...rest] = state.log;
      let next = { ...state, log: rest };
      if (last.snapshot.houses) next.houses = last.snapshot.houses;
      if (last.snapshot.activeHouseId !== undefined) {
        next.activeHouseId = last.snapshot.activeHouseId;
        next.defenderHouseId = last.snapshot.defenderHouseId;
        next.phase = last.snapshot.phase;
        next.turn = last.snapshot.turn;
      }
      next.toast = { msg: 'Undone: ' + last.label, t: Date.now() };
      return next;
    }

    case 'clear-toast':
      return { ...state, toast: null };

    default:
      return state;
  }
}

/* ---------- App ---------- */
function App() {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [overlay, setOverlay] = React.useState(null); // 'log' | 'leaderboard' | null
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme/density to root attributes
  React.useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  // Toast auto-dismiss
  React.useEffect(() => {
    if (state.toast) {
      const id = setTimeout(() => dispatch({ type: 'clear-toast' }), 2000);
      return () => clearTimeout(id);
    }
  }, [state.toast]);

  // Keyboard: Cmd/Ctrl+Z = undo, Esc = close overlay, ←/→ cycle house
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); dispatch({ type: 'undo' }); }
      else if (e.key === 'Escape') setOverlay(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // iPad screen scaling so the 1366×1024 canvas fits any viewport
  React.useEffect(() => {
    const screen = document.getElementById('ipad-screen');
    if (!screen) return;
    const fit = () => {
      const sx = window.innerWidth  / 1366;
      const sy = window.innerHeight / 1024;
      const s = Math.min(1, Math.min(sx, sy) * 0.98);
      screen.style.setProperty('--scale', s);
      screen.style.transform = `scale(${s})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Subset houses by the rulebook's set for this player count.
  const visibleOrder = HOUSE_SETS[t.playerCount] || HOUSE_SETS[7];
  const visibleHouses = visibleOrder
    .map(id => state.houses.find(h => h.id === id))
    .filter(Boolean);
  const visibleIds = new Set(visibleHouses.map(h => h.id));
  // If the recorded active house isn't in this set (after a player-count change),
  // present the first visible house as active to children for THIS render — the
  // effect below will then officially dispatch select-turn to persist the change.
  const effectiveActiveId = visibleIds.has(state.activeHouseId)
    ? state.activeHouseId
    : (visibleHouses[0] && visibleHouses[0].id);
  const activeHouse = state.houses.find(h => h.id === effectiveActiveId) || visibleHouses[0];
  // If active house got hidden by count change, snap to first visible
  React.useEffect(() => {
    if (!visibleIds.has(state.activeHouseId)) {
      const first = visibleHouses[0];
      if (first) dispatch({ type: 'select-turn', houseId: first.id, silent: true });
    }
  }, [t.playerCount]);

  // Precompute reinforce numbers per house
  const computed = {
    reinforceByHouse: Object.fromEntries(state.houses.map(h => [h.id, computeReinforce(h)])),
  };

  // Status per column (use effective IDs so a mid-render mismatch can't break highlights)
  const effectiveDefenderId = visibleIds.has(state.defenderHouseId) ? state.defenderHouseId : null;
  const statusFor = (h) => {
    if (h.id === effectiveActiveId) return 'active';
    if (h.id === effectiveDefenderId) return 'defender';
    return 'idle';
  };

  return (
    <div className="app" style={{ '--active-color': activeHouse.color, '--active-tint': activeHouse.tint }}>
      {/* TABLE VIEW (rotated 180° for players across the table) */}
      <div className="table-view">
        <div className="table-banner">
          <div className="app-title"><IconCrown size={14}/> Hand of the King · RISK · A Game of Thrones</div>
          <div className="center-phase">
            <span className="dot"/>
            {capitalize(state.phase)} Phase
            <span style={{borderLeft:'1px solid var(--rule)',height:14}}/>
            <span style={{color:'var(--ink-soft)'}}>{activeHouse.name}</span>
          </div>
          <div className="turn-counter">Round <b>{state.turn}</b></div>
        </div>
        <div className="houses-row" style={{ gridTemplateColumns: `repeat(${visibleHouses.length}, 1fr)` }}>
          {visibleHouses.map(h => (
            <HouseColumn
              key={h.id}
              house={h}
              status={statusFor(h)}
              reinforce={computed.reinforceByHouse[h.id]}
              isReinforcePhase={state.phase === 'reinforce'}
              showFormula={t.showFormula}
              onSelect={() => h.id !== effectiveActiveId && dispatch({ type: 'select-turn', houseId: h.id, order: visibleOrder })}
            />
          ))}
        </div>

        <StandingsStrip houses={visibleHouses}/>
      </div>

      {/* HAND-FACING MIRROR ROW — same numbers, right-side up.
          The table-view above is rotated 180°, which visually reverses
          column order. We reverse the mirror order so each mirror card
          sits directly below its corresponding rotated column. */}
      <div className="mirror-row" style={{ gridTemplateColumns: `repeat(${visibleHouses.length}, 1fr)` }}>
        {[...visibleHouses].reverse().map(h => (
          <HouseMirror
            key={h.id}
            house={h}
            status={statusFor(h)}
            onSelect={() => h.id !== effectiveActiveId && dispatch({ type: 'select-turn', houseId: h.id, order: visibleOrder })}
          />
        ))}
      </div>

      {/* HAND PANEL (right-side up to The Hand) */}
      <HandPanel
        state={{ ...state, houses: visibleHouses, activeHouseId: effectiveActiveId, defenderHouseId: visibleIds.has(state.defenderHouseId) ? state.defenderHouseId : null }}
        dispatch={dispatch}
        computed={computed}
        openLog={() => setOverlay('log')}
        openLeaderboard={() => setOverlay('leaderboard')}
        openSettings={() => setOverlay('settings')}
      />

      {/* Overlays */}
      {overlay === 'log' && (
        <LogOverlay state={{ ...state, houses: visibleHouses }} onClose={() => setOverlay(null)}
                    onUndo={() => dispatch({ type: 'undo' })}/>
      )}
      {overlay === 'leaderboard' && (
        <LeaderboardOverlay state={{ ...state, houses: visibleHouses }} onClose={() => setOverlay(null)}/>
      )}
      {overlay === 'settings' && (
        <SettingsOverlay state={state}
                         dispatch={dispatch}
                         playerCount={t.playerCount}
                         order={visibleOrder}
                         setPlayerCount={(n) => setTweak('playerCount', n)}
                         onClose={() => setOverlay(null)}/>
      )}

      {/* Toast */}
      {state.toast && <div className="toast" key={state.toast.t}>{state.toast.msg}</div>}

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakRadio label="Theme" value={t.theme}
            onChange={(v) => setTweak('theme', v)}
            options={[
              { value: 'parchment', label: 'Parchment' },
              { value: 'dark', label: 'Map Room' },
            ]}/>
          <TweakRadio label="Density" value={t.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'spacious', label: 'Spacious' },
              { value: 'compact', label: 'Compact' },
            ]}/>
        </TweakSection>
        <TweakSection label="Game">
          <TweakSlider label="Players" min={2} max={7} step={1} value={t.playerCount} onChange={(v) => setTweak('playerCount', v)} unit=" houses"/>
          <TweakToggle label="Show formula" value={t.showFormula} onChange={(v) => setTweak('showFormula', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function romanize(n) { return ['','I','II','III','IV','V'][n] || n; }

/* ---------- Inline standings strip (always visible) ---------- */
function StandingsStrip({ houses }) {
  const ranked = [...houses]
    .map(h => ({ ...h, total: h.territories + h.castles + h.ports }))
    .sort((a, b) => b.total - a.total || b.vps - a.vps);
  const max = Math.max(...ranked.map(h => h.total), 1);
  return (
    <div className="standings-strip">
      <div className="meta">
        <b>Realm at a glance</b>
        Holdings = territories + castles + ports
      </div>
      <div className="standings-list">
        {ranked.map((h, i) => (
          <div key={h.id} className={"stand-row " + (i === 0 ? 'r1 first' : '')}>
            <div className="rk">{i === 0 ? '★' : (i+1)}</div>
            <div className="si"><Sigil id={h.id} size={16}/></div>
            <div className="nm">
              <div className="nl">
                <span>{h.name}</span>
                <span>
                  <b>{h.total}</b>
                  <b className="vp">{h.vps}vp</b>
                </span>
              </div>
              <div className="bar"><span style={{ width: (h.total / max * 100) + '%' }}/></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
