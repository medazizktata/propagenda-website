'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

let registered = false;

export function registerGsap() {
  if (registered) return;
  // SplitText is free since GSAP 3.13 — used for Cuberto-style line-mask reveals.
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

if (typeof window !== 'undefined') {
  registerGsap();
}

export { gsap, ScrollTrigger, SplitText };
