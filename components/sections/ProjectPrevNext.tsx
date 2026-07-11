import { PrevNextLink } from '@/components/PrevNextLink';

interface ProjectPrevNextProps {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}

export function ProjectPrevNext({ prev, next }: ProjectPrevNextProps) {
  return <PrevNextLink prev={prev} next={next} />;
}
