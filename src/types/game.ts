/* Game Types — exact match to prototype */

export type HouseId = 'stark' | 'lannister' | 'targaryen' | 'baratheon' | 'tyrell' | 'martell' | 'ghiscari';
export type Phase = 'reinforce' | 'invade' | 'objectives';

export interface House {
  id: HouseId;
  name: string;
  words: string;
  color: string;
  tint: string;
  territories: number;
  castles: number;
  ports: number;
  vps: number;
  bonusArmies: number;
}

export interface LogEntry {
  id: string;
  turn: number;
  phase: Phase | 'turn';
  label: string;
  detail: string | null;
  delta: number;
  snapshot: {
    houses?: House[];
    activeHouseId?: HouseId;
    defenderHouseId?: HouseId | null;
    phase?: Phase;
    turn?: number;
  };
}

export interface GameState {
  houses: House[];
  activeHouseId: HouseId;
  defenderHouseId: HouseId | null;
  phase: Phase;
  turn: number;
  log: LogEntry[];
  redoStack: LogEntry[];
  toast: { msg: string; t: number } | null;
}

export interface ReinforceOutput {
  baseArmies: number;
  armies: number;
  gold: number;
}

export type GameAction =
  | { type: 'set-active'; houseId: HouseId }
  | { type: 'select-turn'; houseId: HouseId; order?: HouseId[]; silent?: boolean }
  | { type: 'set-phase'; phase: Phase }
  | { type: 'set-defender'; houseId: HouseId | null }
  | { type: 'adjust'; field: string; houseId: HouseId; delta: number }
  | { type: 'transfer'; field: string; from: HouseId; to: HouseId; delta: number }
  | { type: 'restart'; seedFn?: (id: HouseId) => Partial<House>; firstId?: HouseId }
  | { type: 'set-count'; field: string; houseId: HouseId; value: number }
  | { type: 'hydrate'; state: GameState }
  | { type: 'undo' }
  | { type: 'clear-toast' };

export interface TweakSettings {
  theme: 'parchment' | 'dark';
  density: 'spacious' | 'compact';
  showFormula: boolean;
  playerCount: 2 | 3 | 4 | 5 | 6 | 7;
  language: 'en' | 'es';
}
