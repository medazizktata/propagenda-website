export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      case_studies: {
        Row: {
          accent: Json | null;
          approach: string | null;
          category: string;
          challenge: string | null;
          client: string | null;
          created_at: string;
          deliverables: Json | null;
          gallery: Json;
          h1: string;
          hero_image: string | null;
          id: string;
          industry: string | null;
          locale: string;
          next_slug: string | null;
          outcome: string | null;
          overview: string;
          prev_slug: string | null;
          published_at: string | null;
          quote: Json | null;
          results: Json | null;
          scope_items: Json;
          seo: Json;
          slug: string;
          sort_order: number;
          status: Database['public']['Enums']['content_status'];
          tier: string;
          title: string;
          updated_at: string;
          year: string | null;
        };
        Insert: {
          accent?: Json | null;
          approach?: string | null;
          category: string;
          challenge?: string | null;
          client?: string | null;
          created_at?: string;
          deliverables?: Json | null;
          gallery?: Json;
          h1: string;
          hero_image?: string | null;
          id?: string;
          industry?: string | null;
          locale?: string;
          next_slug?: string | null;
          outcome?: string | null;
          overview?: string;
          prev_slug?: string | null;
          published_at?: string | null;
          quote?: Json | null;
          results?: Json | null;
          scope_items?: Json;
          seo?: Json;
          slug: string;
          sort_order?: number;
          status?: Database['public']['Enums']['content_status'];
          tier?: string;
          title: string;
          updated_at?: string;
          year?: string | null;
        };
        Update: {
          accent?: Json | null;
          approach?: string | null;
          category?: string;
          challenge?: string | null;
          client?: string | null;
          created_at?: string;
          deliverables?: Json | null;
          gallery?: Json;
          h1?: string;
          hero_image?: string | null;
          id?: string;
          industry?: string | null;
          locale?: string;
          next_slug?: string | null;
          outcome?: string | null;
          overview?: string;
          prev_slug?: string | null;
          published_at?: string | null;
          quote?: Json | null;
          results?: Json | null;
          scope_items?: Json;
          seo?: Json;
          slug?: string;
          sort_order?: number;
          status?: Database['public']['Enums']['content_status'];
          tier?: string;
          title?: string;
          updated_at?: string;
          year?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          event_checklist: Json | null;
          extended_bullets: Json | null;
          gallery: Json;
          h1: string;
          hub: Json | null;
          id: string;
          locale: string;
          overview: string;
          published_at: string | null;
          related_work: Json | null;
          scope_items: Json;
          seo: Json;
          slug: string;
          sort_order: number;
          status: Database['public']['Enums']['content_status'];
          tertiary_cta: Json | null;
          tiers: Json | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          event_checklist?: Json | null;
          extended_bullets?: Json | null;
          gallery?: Json;
          h1: string;
          hub?: Json | null;
          id?: string;
          locale?: string;
          overview?: string;
          published_at?: string | null;
          related_work?: Json | null;
          scope_items?: Json;
          seo?: Json;
          slug: string;
          sort_order?: number;
          status?: Database['public']['Enums']['content_status'];
          tertiary_cta?: Json | null;
          tiers?: Json | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          event_checklist?: Json | null;
          extended_bullets?: Json | null;
          gallery?: Json;
          h1?: string;
          hub?: Json | null;
          id?: string;
          locale?: string;
          overview?: string;
          published_at?: string | null;
          related_work?: Json | null;
          scope_items?: Json;
          seo?: Json;
          slug?: string;
          sort_order?: number;
          status?: Database['public']['Enums']['content_status'];
          tertiary_cta?: Json | null;
          tiers?: Json | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      video_projects: {
        Row: {
          category: string;
          client: string | null;
          created_at: string;
          description: string | null;
          duration: string | null;
          height: number;
          id: string;
          is_showreel: boolean;
          locale: string;
          orientation: string;
          placeholder: boolean;
          poster: string;
          published_at: string | null;
          slug: string;
          sort_order: number;
          src: string;
          status: Database['public']['Enums']['content_status'];
          title: string;
          updated_at: string;
          width: number;
        };
        Insert: {
          category: string;
          client?: string | null;
          created_at?: string;
          description?: string | null;
          duration?: string | null;
          height?: number;
          id?: string;
          is_showreel?: boolean;
          locale?: string;
          orientation?: string;
          placeholder?: boolean;
          poster: string;
          published_at?: string | null;
          slug: string;
          sort_order?: number;
          src?: string;
          status?: Database['public']['Enums']['content_status'];
          title: string;
          updated_at?: string;
          width?: number;
        };
        Update: {
          category?: string;
          client?: string | null;
          created_at?: string;
          description?: string | null;
          duration?: string | null;
          height?: number;
          id?: string;
          is_showreel?: boolean;
          locale?: string;
          orientation?: string;
          placeholder?: boolean;
          poster?: string;
          published_at?: string | null;
          slug?: string;
          sort_order?: number;
          src?: string;
          status?: Database['public']['Enums']['content_status'];
          title?: string;
          updated_at?: string;
          width?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      content_status: 'draft' | 'published';
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
