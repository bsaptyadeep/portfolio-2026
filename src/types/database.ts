export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          headline: string | null;
          bio: string | null;
          avatar_url: string | null;
          location: string | null;
          website: string | null;
          github: string | null;
          linkedin: string | null;
          twitter: string | null;
          role: "admin" | "viewer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          website?: string | null;
          github?: string | null;
          linkedin?: string | null;
          twitter?: string | null;
          role?: "admin" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          tags: string[];
          meta_title: string | null;
          meta_description: string | null;
          og_image: string | null;
          published: boolean;
          published_at: string | null;
          reading_time: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image?: string | null;
          tags?: string[];
          meta_title?: string | null;
          meta_description?: string | null;
          og_image?: string | null;
          published?: boolean;
          published_at?: string | null;
          reading_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          long_description: string | null;
          tech_stack: string[];
          live_url: string | null;
          repo_url: string | null;
          cover_image: string | null;
          featured: boolean;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          long_description?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          repo_url?: string | null;
          cover_image?: string | null;
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      experiences: {
        Row: {
          id: string;
          company_name: string;
          company_logo: string | null;
          role: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          current: boolean;
          description: string | null;
          achievements: string[];
          technologies: string[];
          metrics: Json;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          company_logo?: string | null;
          role: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          current?: boolean;
          description?: string | null;
          achievements?: string[];
          technologies?: string[];
          metrics?: Json;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["experiences"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Experience = Database["public"]["Tables"]["experiences"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
