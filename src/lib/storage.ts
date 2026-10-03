import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, TweakSettings } from '../types/game';
import { INITIAL_STATE } from './gameState';

const GAME_STATE_KEY = '@hand_of_the_king:game_state';
const TWEAKS_KEY = '@hand_of_the_king:tweaks';

/* =====================================================================
   GAME STATE PERSISTENCE
   ===================================================================== */

export async function loadGameState(): Promise<GameState> {
  try {
    const stored = await AsyncStorage.getItem(GAME_STATE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('Failed to load game state:', err);
  }
  return INITIAL_STATE;
}

export async function saveGameState(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save game state:', err);
  }
}

export async function clearGameState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
  } catch (err) {
    console.warn('Failed to clear game state:', err);
  }
}

/* =====================================================================
   TWEAKS PERSISTENCE
   ===================================================================== */

export const DEFAULT_TWEAKS: TweakSettings = {
  theme: 'parchment',
  density: 'spacious',
  showFormula: true,
  playerCount: 7,
  language: 'en',
};

export async function loadTweaks(): Promise<TweakSettings> {
  try {
    const stored = await AsyncStorage.getItem(TWEAKS_KEY);
    if (stored) {
      return { ...DEFAULT_TWEAKS, ...JSON.parse(stored) };
    }
  } catch (err) {
    console.warn('Failed to load tweaks:', err);
  }
  return DEFAULT_TWEAKS;
}

export async function saveTweaks(tweaks: TweakSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(TWEAKS_KEY, JSON.stringify(tweaks));
  } catch (err) {
    console.warn('Failed to save tweaks:', err);
  }
}
