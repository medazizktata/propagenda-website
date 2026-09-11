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
  /**
   * Optional: the scene draws itself, because it owns a post-processing chain the host knows
   * nothing about. When absent the host does a plain `renderer.render(scene, camera)`.
   */
  render?: (renderer: THREE.WebGLRenderer) => void;
  /** Release every GPU resource the scene created. The host disposes the renderer itself. */
  dispose: () => void;
  /**
   * Optional pointer hit-test in NDC (−1…1). Returns true when the cursor is over an
   * interactive object so the host can set `cursor: grab`.
   */
  pointerMove?: (ndcX: number, ndcY: number) => boolean;
  /** Start a drag if something is under the pointer. Returns true when a floater was claimed. */
  pointerDown?: (ndcX: number, ndcY: number) => boolean;
  /** Move the active floater in the drag plane. */
  pointerDrag?: (ndcX: number, ndcY: number) => void;
  /**
   * End the drag. A short tap kicks/spin-advances; a real drag rewrites the floater's
   * steady velocity to match the throw direction.
   */
  pointerUp?: (ndcX: number, ndcY: number) => void;
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
  /**
   * Ask the host for one more frame. Only meaningful when no loop is running — under reduced
   * motion the single frame is drawn immediately, so anything loaded asynchronously after it
   * (poster textures, the monogram) would otherwise never appear at all.
   */
  requestDraw: () => void;
};

export type HeroSceneFactory = (ctx: HeroSceneContext) => HeroScene;
