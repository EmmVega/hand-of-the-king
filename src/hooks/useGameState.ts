import { useReducer, useEffect, useState } from 'react';
import { GameState, GameAction, TweakSettings } from '../types/game';
import { gameStateReducer, INITIAL_STATE } from '../lib/gameState';
import { loadGameState, saveGameState, loadTweaks, saveTweaks, DEFAULT_TWEAKS } from '../lib/storage';

export function useGameState() {
  const [isHydrating, setIsHydrating] = useState(true);
  const [state, dispatch] = useReducer(gameStateReducer, INITIAL_STATE);

  useEffect(() => {
    loadGameState()
      .then(loaded => {
        const seen = new Set<string>();
        const log = loaded.log.map((entry, i) => {
          const id = seen.has(entry.id) ? `${entry.id}_${i}` : entry.id;
          seen.add(id);
          return { ...entry, id };
        });
        dispatch({ type: 'hydrate', state: { ...loaded, log } });
      })
      .catch(err => console.warn('Hydration failed:', err))
      .finally(() => setIsHydrating(false));
  }, []);

  // Persist on every state change (500ms debounce)
  useEffect(() => {
    if (isHydrating) return;
    const timer = setTimeout(() => saveGameState(state), 500);
    return () => clearTimeout(timer);
  }, [state, isHydrating]);

  // Auto-dismiss toast after 2s (matching prototype)
  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => dispatch({ type: 'clear-toast' }), 2000);
    return () => clearTimeout(timer);
  }, [state.toast]);

  return { state, dispatch, isHydrated: !isHydrating };
}

export function useTweaks() {
  const [tweaks, setTweaksState] = useState<TweakSettings>(DEFAULT_TWEAKS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    loadTweaks()
      .then(loaded => setTweaksState(loaded))
      .catch(err => console.warn('Tweaks hydration failed:', err))
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (isHydrated) saveTweaks(tweaks);
  }, [tweaks, isHydrated]);

  const setTweak = (key: keyof TweakSettings, value: any) => {
    setTweaksState(prev => ({ ...prev, [key]: value }));
  };

  return [tweaks, setTweak, isHydrated] as const;
}
