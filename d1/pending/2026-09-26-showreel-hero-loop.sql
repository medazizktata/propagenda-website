-- Perf pass 2026-09-26: give the showreel a light background loop for the /work/video hero.
-- public/videos/previews/showreel-hero.mp4 is the whole 27s reel at 1280px, no audio, ~1.5 MB,
-- cut from the UNWATERMARKED original (the showreel stays unmarked by owner decision). The hero
-- was streaming the 6.4 MB 2560px film behind a 45% scrim. The full film (src) is unchanged and
-- still what the Play button opens. '/'-prefixed paths are served from the Worker's assets.
UPDATE video_projects
SET preview_src = '/videos/previews/showreel-hero.mp4', updated_at = datetime('now')
WHERE slug = 'showreel' AND is_showreel = 1;
