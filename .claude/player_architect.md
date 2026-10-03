# Hand of the King — Player & Game Architecture

## What the app is
A mobile score-tracker for a custom Game of Thrones–themed RISK variant ("Hand of the King"). Players manage territories, castles, ports, VPs, and bonus armies for up to 7 Great Houses. The app is built in Expo / React Native (TypeScript), locked to landscape orientation.

---

## Project layout

```
App.tsx                          Root: font loading, state wiring, layout
src/
  types/game.ts                  All shared types (House, GameState, GameAction…)
  lib/
    gameState.ts                 HOUSES constant, HOUSE_SETS, INITIAL_STATE, reducer
    formulas.ts                  computeReinforce(), computeTotal()
    storage.ts                   AsyncStorage persist/load for state + tweaks
    fonts.ts                     F.cinzel / F.cinzelSemi / F.cinzelBold / F.fellItalic
  hooks/
    useGameState.ts              useGameState() + useTweaks() — hydration + auto-save
  components/
    HouseColumn.tsx              Per-house card shown in the "table view" (rotated 180°)
    HouseMirror.tsx              Compact mirror strip (right-side up, Hand's View)
    HandPanel.tsx                Bottom control panel: active house, phases, actions
    Overlays.tsx                 LogOverlay, LeaderboardOverlay, SettingsOverlay
    Sigils.tsx                   SVG sigil + icon components
```

---

## Houses & player sets

Defined in `src/lib/gameState.ts`:

| Count | Houses (in turn order) |
|-------|------------------------|
| 2     | Targaryen, Ghiscari |
| 3     | Stark, Baratheon, Lannister |
| 4     | Stark, Baratheon, Lannister, Tyrell |
| 5     | Stark, Baratheon, Lannister, Tyrell, Martell |
| 6     | Stark, Targaryen, Baratheon, Lannister, Ghiscari, Tyrell |
| 7     | Stark, Targaryen, Baratheon, Lannister, Ghiscari, Tyrell, Martell |

The `playerCount` setting lives in `TweakSettings` (persisted in AsyncStorage).

---

## Starting territories by player count (New Game)

When "New Game" is confirmed in SettingsOverlay, the `restart` action uses a `seedFn` to set initial values. Rules:

| Players | Territories per player |
|---------|------------------------|
| 2       | 12 each |
| 3       | 16 each |
| 4       | 12 each |
| 5       | 10 (1st–3rd), 9 (4th–5th) |
| 6–7     | 0 (manually set after physical setup) |

**Castles and ports are always seeded to 0** — updated manually via the Setup controls after the physical board is set up.

VPs and bonusArmies also reset to 0.

---

## State shape

```ts
GameState {
  houses: House[]              // all 7 houses; only visibleOrder subset is shown
  activeHouseId: HouseId
  defenderHouseId: HouseId | null
  phase: 'reinforce' | 'invade' | 'objectives'
  turn: number
  log: LogEntry[]
  redoStack: LogEntry[]        // unused in current UI
  toast: { msg, t } | null
}

House {
  id, name, words, color, tint
  territories, castles, ports   // holdings
  vps                           // victory points
  bonusArmies                   // added to reinforce calc
}
```

---

## Key game actions (`GameAction`)

| Action type | Effect |
|-------------|--------|
| `select-turn` | Advances active house; increments turn when it wraps |
| `set-phase` | Switch reinforce / invade / objectives |
| `set-defender` | Mark a house as the invasion target |
| `adjust` | +/− one stat on a house (logged, undoable) |
| `transfer` | Move territory/castle/port from one house to another |
| `restart` | Reset state; accepts `seedFn(HouseId) => Partial<House>` for initial values |
| `set-count` | Hard-set a stat value (used in Setup controls) |
| `undo` | Revert last logged action |

---

## Reinforce formula

```
base = clamp(floor((territories + castles) / 3), 3, 13)
armies = base + bonusArmies
gold = (armies + ports) × 100
```

---

## Phases

1. **Reinforce** — shows armies-to-place & gold income for the active house
2. **Invade** — select a defender, then +/− territories/castles/ports between houses
3. **Objectives** — track VP awards for the active house

---

## Persistence

- `@hand_of_the_king:game_state` — full `GameState` via AsyncStorage (500 ms debounce)
- `@hand_of_the_king:tweaks` — `TweakSettings` (theme, density, showFormula, playerCount)

---

## Design language

- **Fonts**: Cinzel (headings/numbers), IM Fell English (italic body text)
- **Colors**: parchment `#ede0c2`, ink `#2a1d0f`, wax-red `#8a1818`, wax-gold `#b08433`
- **Prototype**: `RISK GOT MOBILE APP _HAND OF THE KING_/` — original browser-based JSX that this app faithfully ports to React Native

---

## Known planned improvements (from `src/improvingplan.md`)

- Icons / icon system
- Predefined starting holdings on new game ✓ (implemented)
- Remove "Seize" / "Yield" button labels
- Spanish language mode
- Custom rules section
- The Hand icon
