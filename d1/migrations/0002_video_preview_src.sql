-- Lightweight muted preview clip for the /work/video grid (hover / in-view autoplay). The grid
-- plays this instead of the full film: a hover used to download the whole file (~12MB average)
-- within ~1.5s. NULL = no preview; the card falls back to `src`. The lightbox always plays `src`.
-- Relative R2 object key, same convention as `src` / `poster`.
ALTER TABLE video_projects ADD COLUMN preview_src TEXT;
