'use client';

import { useMemo, useState } from 'react';
import { VideoHero } from '@/components/sections/video/VideoHero';
import { VideoFeaturedFilm } from '@/components/sections/video/VideoFeaturedFilm';
import { VideoGallery } from '@/components/sections/video/VideoGallery';
import { VideoCapabilities } from '@/components/sections/video/VideoCapabilities';
import { VideoTestimonial } from '@/components/sections/video/VideoTestimonial';
import { VideoCTA } from '@/components/sections/video/VideoCTA';
import { VideoLightbox, type LightboxVideo } from '@/components/molecules/VideoLightbox';
import { videoCapabilities, videoTestimonial } from '@/content/videoWork';
import type { VideoProject } from '@/types/content';

export function VideoWorkContent({
  showreel,
  videoProjects,
}: {
  showreel: VideoProject;
  videoProjects: VideoProject[];
}) {
  const [openVideo, setOpenVideo] = useState<LightboxVideo | null>(null);

  const categories = useMemo(
    () => [...new Set(videoProjects.map((project) => project.category))].sort(),
    [videoProjects],
  );

  const clients = useMemo(
    () =>
      [...new Set(videoProjects.map((project) => project.client).filter(Boolean))].sort() as string[],
    [videoProjects],
  );

  const openProject = (project: VideoProject) => {
    if (!project.src) return;
    setOpenVideo({
      src: project.src,
      poster: project.poster,
      width: project.width,
      height: project.height,
      title: project.title,
    });
  };

  return (
    <div className="bg-charcoal">
      <VideoHero showreel={showreel} onPlay={() => openProject(showreel)} />
      <VideoFeaturedFilm film={showreel} onOpen={openProject} />
      <VideoGallery
        projects={videoProjects}
        categories={categories}
        clients={clients}
        onOpen={openProject}
      />
      <VideoCapabilities items={videoCapabilities} />
      <VideoTestimonial text={videoTestimonial.text} author={videoTestimonial.author} />
      <VideoCTA film={showreel} onWatch={() => openProject(showreel)} />
      <VideoLightbox video={openVideo} isOpen={Boolean(openVideo)} onClose={() => setOpenVideo(null)} />
    </div>
  );
}
