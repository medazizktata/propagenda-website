import type { VideoProject } from '@/types/content';
import type { Enums, Tables } from '@/types/database.types';

export type ContentStatus = Enums<'content_status'>;

export type ServiceDiscipline = 'brand' | 'digital' | 'production' | 'experience';

export interface ServiceHubData {
  image: string;
  tag: ServiceDiscipline;
  descriptor: string;
  preview?: string;
  subBullets?: string[];
}

export type ServiceRow = Tables<'services'>;
export type CaseStudyRow = Tables<'case_studies'>;
export type VideoProjectRow = Tables<'video_projects'>;

export interface VideoWorkBundle {
  showreel: VideoProject;
  projects: VideoProject[];
}

export type ServiceListRow = Pick<
  ServiceRow,
  'id' | 'slug' | 'title' | 'status' | 'sort_order' | 'updated_at'
>;
