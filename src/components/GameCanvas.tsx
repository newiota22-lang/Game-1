import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ThreeWorld } from '../game/ThreeWorld';
import { LevelConfig, AvatarSettings, MoralOption } from '../types/game';

export interface GameCanvasHandle {
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  pause: () => void;
  resume: () => void;
  updateAvatar: (avatar: AvatarSettings) => void;
}

interface GameCanvasProps {
  level: LevelConfig;
  avatar: AvatarSettings;
  onStarCollect: (count: number) => void;
  onReachDilemma: (dilemmaIndex: number) => void;
  onProgressDistance: (current: number, target: number) => void;
  onLevelComplete: () => void;
  onPlayerHitObstacle: () => void;
}

export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(({
  level,
  avatar,
  onStarCollect,
  onReachDilemma,
  onProgressDistance,
  onLevelComplete,
  onPlayerHitObstacle
}, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<ThreeWorld | null>(null);

  // Store latest callbacks in refs so ThreeWorld always invokes newest versions without re-initializing
  const callbacksRef = useRef({
    onStarCollect,
    onReachDilemma,
    onProgressDistance,
    onLevelComplete,
    onPlayerHitObstacle
  });

  useEffect(() => {
    callbacksRef.current = {
      onStarCollect,
      onReachDilemma,
      onProgressDistance,
      onLevelComplete,
      onPlayerHitObstacle
    };
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize ThreeWorld once
    const world = new ThreeWorld(
      mountRef.current,
      level,
      avatar,
      {
        onStarCollect: (cnt) => callbacksRef.current.onStarCollect(cnt),
        onReachDilemma: (idx) => callbacksRef.current.onReachDilemma(idx),
        onProgressDistance: (cur, tgt) => callbacksRef.current.onProgressDistance(cur, tgt),
        onLevelComplete: () => callbacksRef.current.onLevelComplete(),
        onPlayerHitObstacle: () => callbacksRef.current.onPlayerHitObstacle()
      }
    );

    worldRef.current = world;

    return () => {
      world.dispose();
      worldRef.current = null;
    };
  }, [level.id]); // Re-initialize only when level changes

  useImperativeHandle(ref, () => ({
    moveLeft: () => worldRef.current?.moveLeft(),
    moveRight: () => worldRef.current?.moveRight(),
    jump: () => worldRef.current?.jump(),
    pause: () => worldRef.current?.pause(),
    resume: () => worldRef.current?.resume(),
    updateAvatar: (newAvatar) => worldRef.current?.updateAvatar(newAvatar)
  }));

  return (
    <div 
      ref={mountRef} 
      data-testid="three-canvas-container"
      className="absolute inset-0 w-full h-full overflow-hidden bg-amber-50 dark:bg-slate-950"
    />
  );
});

GameCanvas.displayName = 'GameCanvas';
