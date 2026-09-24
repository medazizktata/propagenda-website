# media-inbox

Put **original, unwatermarked** work media here, at the path it should have in the R2
bucket, and push to `main`. The *Watermark media* GitHub Action
(`.github/workflows/watermark-media.yml`) marks it, checks the mark is there, and uploads it.

| Drop | Uploaded as |
|---|---|
| `media-inbox/case-study-media/acme/hero.webp` | `case-study-media/acme/hero.webp` (same format) |
| `media-inbox/videos/work/acme-launch.mov` | `videos/work/acme-launch.mp4` + `videos/previews/acme-launch.mp4` + `video-posters/acme-launch.jpg` |

- Images: `.webp`, `.jpg`, `.png`. Videos: `.mp4`, `.mov`, `.m4v`, `.webm` (stored in Git LFS).
- Never add a file you downloaded from the live site: it is already marked. The job refuses
  files it can recognise as marked, but an original is the only safe input.
- Re-pushing an unchanged original is a no-op; changing it re-marks and replaces the upload.
- The job uploads media only. To show a new piece on the site, reference its key from D1
  (case study `hero_image` / `gallery`, or a `video_projects` row).

Run it locally without uploading: `node tools/watermark/process-inbox.cjs --all`
(output in `.watermark-out/`).
