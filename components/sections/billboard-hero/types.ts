import type * as THREE from 'three';

/**
 * Contract between the canvas host and whatever scene it renders.
 *
 * The host owns the renderer, the rAF loop, resize, pausing and teardown; the scene owns
 * everything inside it. Keeping the boundary here means the billboard scene (TASK-3.4) can
 * be built and swapped without touching lifecycle code that is easy to get subtly wrong.
 */
export type HeroScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Advance the scene. `dt` is seconds since the previous frame, clamped by the host. */
  update: (dt: number, elapsed: number) => void;
  /** Viewport changed. The host has already resized the renderer. */
  resize: (width: number, height: number) => void;
  /** Release every GPU resource the scene created. The host disposes the renderer itself. */
  dispose: () => void;
};

export type HeroSceneContext = {
  renderer: THREE.WebGLRenderer;
  width: number;
  height: number;
  /**
   * When true the scene is rendered exactly once and never animated, so it must look
   * complete in its first frame rather than settling into place.
   */
  reducedMotion: boolean;
};

export type HeroSceneFactory = (ctx: HeroSceneContext) => HeroScene;
