import { House, GameState, GameAction, HouseId, Phase, ReinforceOutput } from '../types/game';

/* =====================================================================
   HOUSES & SETS — exact copy from prototype
   ===================================================================== */

export const HOUSES: Omit<House, 'territories' | 'castles' | 'ports' | 'vps' | 'bonusArmies'>[] = [
  { id: 'stark', name: 'Stark', words: 'Winter is Coming', color: '#6e7a85', tint: 'rgba(110,122,133,0.18)' },
  { id: 'lannister', name: 'Lannister', words: 'Hear Me Roar', color: '#b8860b', tint: 'rgba(184,134,11,0.18)' },
  { id: 'targaryen', name: 'Targaryen', words: 'Fire and Blood', color: '#a01818', tint: 'rgba(160,24,24,0.18)' },
  { id: 'baratheon', name: 'Baratheon', words: 'Ours is the Fury', color: '#1f1a14', tint: 'rgba(31,26,20,0.20)' },
  { id: 'tyrell', name: 'Tyrell', words: 'Growing Strong', color: '#3f6b2b', tint: 'rgba(63,107,43,0.18)' },
  { id: 'martell', name: 'Martell', words: 'Unbowed Unbent', color: '#b85219', tint: 'rgba(184,82,25,0.18)' },
  { id: 'ghiscari', name: 'Ghiscari', words: 'From the Ashes', color: '#1e3a72', tint: 'rgba(30,58,114,0.18)' },
];

export const HOUSE_SETS: Record<2 | 3 | 4 | 5 | 6 | 7, HouseId[]> = {
  2: ['targaryen', 'ghiscari'],
  3: ['stark', 'baratheon', 'lannister'],
  4: ['stark', 'baratheon', 'lannister', 'tyrell'],
  5: ['stark', 'baratheon', 'lannister', 'tyrell', 'martell'],
  6: ['stark', 'targaryen', 'baratheon', 'lannister', 'ghiscari', 'tyrell'],
  7: ['stark', 'targaryen', 'baratheon', 'lannister', 'ghiscari', 'tyrell', 'martell'],
};

export const PHASES: Phase[] = ['reinforce', 'invade', 'objectives'];

/* =====================================================================
   SEED DATA — demo starting counts
   ===================================================================== */

function makeHouse(meta: (typeof HOUSES)[number]): House {
  const seed: Record<HouseId, Partial<House>> = {
    stark: { territories: 10, castles: 3, ports: 1, vps: 2, bonusArmies: 2 },
    lannister: { territories: 12, castles: 4, ports: 1, vps: 3, bonusArmies: 0 },
    targaryen: { territories: 4, castles: 1, ports: 2, vps: 1, bonusArmies: 0 },
    baratheon: { territories: 7, castles: 2, ports: 2, vps: 1, bonusArmies: 1 },
    tyrell: { territories: 9, castles: 2, ports: 1, vps: 2, bonusArmies: 2 },
    martell: { territories: 6, castles: 2, ports: 1, vps: 0, bonusArmies: 1 },
    ghiscari: { territories: 5, castles: 1, ports: 1, vps: 0, bonusArmies: 0 },
  };
  const counts = seed[meta.id] || { territories: 5, castles: 1, ports: 1, vps: 0, bonusArmies: 0 };
  return { ...meta, ...counts } as House;
}

export const INITIAL_STATE: GameState = {
  houses: HOUSES.map(makeHouse),
  activeHouseId: 'stark',
  defenderHouseId: null,
  phase: 'reinforce',
  turn: 1,
  log: [],
  redoStack: [],
  toast: null,
};

/* =====================================================================
   ID COUNTER & ACTION ID GENERATOR
   ===================================================================== */

const nid = () => `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* =====================================================================
   REDUCER — exact logic from prototype
   ===================================================================== */

export function gameStateReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'set-active':
    case 'select-turn': {
      if (state.activeHouseId === action.houseId) return state;
      const newHouse = state.houses.find(h => h.id === action.houseId);
      if (!newHouse) return state;

      const order = action.order || state.houses.map(h => h.id);
      const oldIdx = order.indexOf(state.activeHouseId);
      const newIdx = order.indexOf(action.houseId);
      
      const wraps = oldIdx !== -1 && newIdx !== -1 && newIdx <= oldIdx;
      const turn = wraps && !action.silent ? state.turn + 1 : state.turn;
      const phase = action.silent ? state.phase : 'reinforce';
      
      const oldHouse = state.houses.find(h => h.id === state.activeHouseId)!;
      const log = action.silent
        ? state.log
        : [
            {
              id: nid(),
              turn: state.turn,
              phase: 'turn',
              label: `${newHouse.name} takes the turn`,
              detail: `← ${oldHouse.name}${wraps ? ` · round ${turn}` : ''}`,
              delta: 0,
              snapshot: {
                activeHouseId: state.activeHouseId,
                defenderHouseId: state.defenderHouseId,
                phase: state.phase,
                turn: state.turn,
              },
            },
            ...state.log,
          ];

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
      const { field, houseId, delta } = action;
      const houses = state.houses.map(h => {
        if (h.id !== houseId) return h;
        let next = (h[field as keyof House] as number || 0) + delta;
        
        if (field === 'vps') next = Math.max(0, next);
        else if (field === 'bonusArmies') next = Math.max(0, Math.min(20, next));
        else next = Math.max(0, next);
        
        return { ...h, [field]: next };
      });

      const house = houses.find(h => h.id === houseId)!;
      const oldHouse = state.houses.find(h => h.id === houseId)!;
      
      if (house[field as keyof House] === oldHouse[field as keyof House]) return state;

      const fieldLabels: Record<string, string> = {
        vps: 'VP',
        bonusArmies: 'Bonus armies',
        territories: 'Territory',
        castles: 'Castle',
        ports: 'Port',
      };

      const log = [
        {
          id: nid(),
          turn: state.turn,
          phase: state.phase,
          label: `${house.name} · ${fieldLabels[field]}`,
          detail: `${oldHouse[field as keyof House]} → ${house[field as keyof House]}`,
          delta,
          snapshot: { houses: state.houses },
        },
        ...state.log,
      ];

      return { ...state, houses, log };
    }

    case 'transfer': {
      const { field, from, to, delta } = action;
      if (!from || !to || from === to) return state;

      const fromHouse = state.houses.find(h => h.id === from)!;
      if ((fromHouse[field as keyof House] as number) - delta < 0) {
        return {
          ...state,
          toast: { msg: `${fromHouse.name} has no ${field} left`, t: Date.now() },
        };
      }

      const houses = state.houses.map(h => {
        if (h.id === from) return { ...h, [field]: (h[field as keyof House] as number) - delta };
        if (h.id === to) return { ...h, [field]: (h[field as keyof House] as number) + delta };
        return h;
      });

      const toN = state.houses.find(h => h.id === to)!;
      const fieldLabel = { territories: 'territory', castles: 'castle', ports: 'port' }[field] || field;

      const log = [
        {
          id: nid(),
          turn: state.turn,
          phase: 'invade',
          label: `${toN.name} takes ${fieldLabel} from ${fromHouse.name}`,
          detail: null,
          delta,
          snapshot: { houses: state.houses },
        },
        ...state.log,
      ];

      return { ...state, houses, log };
    }

    case 'restart': {
      const seedFn = action.seedFn;
      return {
        ...INITIAL_STATE,
        houses: state.houses.map((h, i) => {
          const meta = HOUSES[i];
          const reset = seedFn
            ? seedFn(h.id)
            : { territories: 0, castles: 0, ports: 0, vps: 0, bonusArmies: 0 };
          return { ...meta, ...reset } as House;
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
      let next: GameState = { ...state, log: rest };
      
      if (last.snapshot.houses) next.houses = last.snapshot.houses;
      if (last.snapshot.activeHouseId !== undefined) {
        next.activeHouseId = last.snapshot.activeHouseId;
        next.defenderHouseId = last.snapshot.defenderHouseId ?? null;
        next.phase = last.snapshot.phase!;
        next.turn = last.snapshot.turn!;
      }
      
      next.toast = { msg: 'Undone: ' + last.label, t: Date.now() };
      return next;
    }

    case 'hydrate': {
      return { ...action.state, toast: null };
    }

    case 'clear-toast': {
      return { ...state, toast: null };
    }

    default:
      return state;
  }
}
