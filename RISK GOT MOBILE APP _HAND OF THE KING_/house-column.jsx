/* =====================================================================
   HOUSE COLUMN — the table-view card for each house.
   This component is rendered inside a rotated container (180°), so it
   reads correctly from across the table.
   ===================================================================== */

function HouseColumn({ house, status, reinforce, isReinforcePhase, showFormula, onSelect }) {
  const isActive = status === 'active';
  const isDefender = status === 'defender';

  // Flash a stat briefly when its number changes
  const prev = React.useRef({ territories: house.territories, castles: house.castles, ports: house.ports, vps: house.vps });
  const [flashing, setFlashing] = React.useState({});
  React.useEffect(() => {
    const f = {};
    ['territories','castles','ports','vps'].forEach(k => {
      if (prev.current[k] !== house[k]) f[k] = true;
    });
    if (Object.keys(f).length) {
      setFlashing(f);
      const t = setTimeout(() => setFlashing({}), 550);
      prev.current = { territories: house.territories, castles: house.castles, ports: house.ports, vps: house.vps };
      return () => clearTimeout(t);
    }
    prev.current = { territories: house.territories, castles: house.castles, ports: house.ports, vps: house.vps };
  }, [house.territories, house.castles, house.ports, house.vps]);

  return (
    <div className="house-col"
         data-status={status}
         onClick={onSelect}
         style={{ '--house-color': house.color, '--house-tint': house.tint }}>
      {isActive && <div className="battle-tag atk">Turn</div>}
      {isDefender && <div className="battle-tag def">Defender</div>}

      <div className="house-head">
        <div className="house-sigil">
          <Sigil id={house.id} size={48} />
        </div>
        <div>
          <div className="house-name">{house.name}</div>
          <div className="house-words">{house.words}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <div className="lbl"><IconTerritory size={11}/>Terr.</div>
          <div className={"num " + (flashing.territories ? "flash" : "")}>{house.territories}</div>
        </div>
        <div className="stat">
          <div className="lbl"><IconCastle size={11}/>Castles</div>
          <div className={"num " + (flashing.castles ? "flash" : "")}>{house.castles}</div>
        </div>
        <div className="stat">
          <div className="lbl"><IconPort size={11}/>Ports</div>
          <div className={"num " + (flashing.ports ? "flash" : "")}>{house.ports}</div>
        </div>
        <div className="stat vp">
          <div className="lbl"><IconVP size={11}/>VP</div>
          <div className={"num " + (flashing.vps ? "flash" : "")}>{house.vps}</div>
        </div>
        {(house.bonusArmies > 0 || house.bonusGold > 0) && (
          <div className="stat full">
            <div className="lbl">Region Bonus</div>
            <div className="bonus-pill">
              {house.bonusArmies > 0 && <span>+{house.bonusArmies} <IconArmy size={9}/></span>}
              {house.bonusArmies > 0 && house.bonusGold > 0 && <span>·</span>}
              {house.bonusGold > 0 && <span>+{house.bonusGold} <IconGold size={9}/></span>}
            </div>
          </div>
        )}
      </div>

      {/* Footer mini formula */}
      {showFormula && (
        <div style={{
          fontFamily: 'IM Fell English, serif',
          fontStyle: 'italic',
          fontSize: 10,
          color: 'var(--ink-faint)',
          textAlign: 'center',
          paddingTop: 3,
          borderTop: '1px dotted var(--rule)',
          position: 'relative',
          zIndex: 1,
          letterSpacing: '0.02em',
        }}>
          ⌊({house.territories}+{house.castles})/3⌋
          {house.bonusArmies ? ` +${house.bonusArmies}` : ''}
          {' = '}
          <span style={{color:'var(--ink)',fontWeight:600}}>{reinforce.armies} ⚔</span>
        </div>
      )}
    </div>
  );
}

window.HouseColumn = HouseColumn;

/* =====================================================================
   HOUSE MIRROR — compact horizontal card facing The Hand.
   Same numbers as the rotated column above; right-side up so the Hand
   can always read every house's counts as they change.
   ===================================================================== */

function HouseMirror({ house, status, onSelect }) {
  const isActive = status === 'active';
  const isDefender = status === 'defender';

  const prev = React.useRef({ territories: house.territories, castles: house.castles, ports: house.ports, vps: house.vps });
  const [flashing, setFlashing] = React.useState({});
  React.useEffect(() => {
    const f = {};
    ['territories','castles','ports','vps'].forEach(k => {
      if (prev.current[k] !== house[k]) f[k] = true;
    });
    if (Object.keys(f).length) {
      setFlashing(f);
      const t = setTimeout(() => setFlashing({}), 550);
      prev.current = { territories: house.territories, castles: house.castles, ports: house.ports, vps: house.vps };
      return () => clearTimeout(t);
    }
    prev.current = { territories: house.territories, castles: house.castles, ports: house.ports, vps: house.vps };
  }, [house.territories, house.castles, house.ports, house.vps]);

  return (
    <div className="house-mirror"
         data-status={status}
         onClick={onSelect}
         style={{ '--house-color': house.color, '--house-tint': house.tint }}>
      <div className="mhead">
        <div className="msigil"><Sigil id={house.id} size={16}/></div>
        <div className="mname">{house.name}</div>
        {isActive && <div className="mtag atk">Turn</div>}
        {isDefender && <div className="mtag def">Def</div>}
      </div>
      <div className="mstats">
        <div className="mstat" title="Territories">
          <div className="ml">T</div>
          <div className={"mv " + (flashing.territories ? "flash" : "")}>{house.territories}</div>
        </div>
        <div className="mstat" title="Castles">
          <div className="ml">C</div>
          <div className={"mv " + (flashing.castles ? "flash" : "")}>{house.castles}</div>
        </div>
        <div className="mstat" title="Ports">
          <div className="ml">P</div>
          <div className={"mv " + (flashing.ports ? "flash" : "")}>{house.ports}</div>
        </div>
        <div className="mstat vp" title="Victory Points">
          <div className="ml">VP</div>
          <div className={"mv " + (flashing.vps ? "flash" : "")}>{house.vps}</div>
        </div>
      </div>
    </div>
  );
}

window.HouseMirror = HouseMirror;
