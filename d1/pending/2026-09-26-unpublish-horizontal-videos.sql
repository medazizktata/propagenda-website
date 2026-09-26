-- Owner direction 2026-09-26: remove horizontal (landscape) films from /work/video.
-- Unpublish only (status -> 'draft'): the rows and their R2 uploads (film, preview, poster)
-- stay, so a film can be re-published from the admin. The public query reads status='published'.
-- Scope: the three grid films wider than tall. NOT the showreel (is_showreel=1, the page's hero
-- and featured film; getVideoWork throws without a published showreel), and NOT
-- propagenda-logo-animation, which is square (1920x1920) despite its 'landscape' label.
UPDATE video_projects
SET status = 'draft', updated_at = datetime('now')
WHERE locale = 'en'
  AND is_showreel = 0
  AND status = 'published'
  AND width > height
  AND slug IN ('clemson-porter-logo-animation', 'propagenda-logo-reveal', 'propagenda-branding-reel');
