'use client';

import { useState } from 'react';
import { VideoHero } from '@/components/sections/video/VideoHero';
import { VideoFeaturedFilm } from '@/components/sections/video/VideoFeaturedFilm';
import { VideoGallery } from '@/components/sections/video/VideoGallery';
import { VideoCapabilities } from '@/components/sections/video/VideoCapabilities';
import { VideoTestimonial } from '@/components/sections/video/VideoTestimonial';
import { VideoCTA } from '@/components/sections/video/VideoCTA';
import { VideoLightbox, type LightboxVideo } from '@/components/molecules/VideoLightbox';
import {
  showreel,
  videoProjects,
  videoCategories,
  videoClients,
  videoCapabilities,
  videoTestimonial,
} from '@/content/videoWork';
import type { VideoProject } from '@/types/content';

export function VideoWorkContent() {
  const [openVideo, setOpenVideo] = useState<LightboxVideo | null>(null);

  const openProject = (p: VideoProject) => {
    if (!p.src) return;
    setOpenVideo({ src: p.src, poster: p.poster, width: p.width, height: p.height, title: p.title });
  };

  return (
    <div className="bg-charcoal">
      <VideoHero showreel={showreel} onPlay={() => openProject(showreel)} />
      <VideoFeaturedFilm film={showreel} onOpen={openProject} />
      <VideoGallery
        projects={videoProjects}
        categories={videoCategories}
        clients={videoClients}
        onOpen={openProject}
      />
      <VideoCapabilities items={videoCapabilities} />
      <VideoTestimonial text={videoTestimonial.text} author={videoTestimonial.author} />
      <VideoCTA film={showreel} onWatch={() => openProject(showreel)} />
      <VideoLightbox video={openVideo} isOpen={Boolean(openVideo)} onClose={() => setOpenVideo(null)} />
    </div>
  );
}
