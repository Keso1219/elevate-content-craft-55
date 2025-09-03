export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      crm_connections: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          id: string
          last_sync_at: string | null
          provider: string
          refresh_token: string | null
          scope: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_sync_at?: string | null
          provider: string
          refresh_token?: string | null
          scope?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_sync_at?: string | null
          provider?: string
          refresh_token?: string | null
          scope?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_objects: {
        Row: {
          connection_id: string
          created_at: string
          data: Json
          external_id: string
          id: string
          indexed_at: string | null
          object_type: string
          provider: string
          updated_at: string
          updated_remote_at: string | null
        }
        Insert: {
          connection_id: string
          created_at?: string
          data: Json
          external_id: string
          id?: string
          indexed_at?: string | null
          object_type: string
          provider: string
          updated_at?: string
          updated_remote_at?: string | null
        }
        Update: {
          connection_id?: string
          created_at?: string
          data?: Json
          external_id?: string
          id?: string
          indexed_at?: string | null
          object_type?: string
          provider?: string
          updated_at?: string
          updated_remote_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_objects_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "crm_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_sync_runs: {
        Row: {
          connection_id: string
          error: string | null
          finished_at: string | null
          id: string
          started_at: string
          stats: Json | null
          status: string
        }
        Insert: {
          connection_id: string
          error?: string | null
          finished_at?: string | null
          id?: string
          started_at?: string
          stats?: Json | null
          status?: string
        }
        Update: {
          connection_id?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          started_at?: string
          stats?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_sync_runs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "crm_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_posts: {
        Row: {
          comments: number | null
          content: string | null
          dislikes: number | null
          embedding: string | null
          hashtags: string | null
          id: number
          likes: number | null
          metadata: Json | null
          platform: string | null
          post_url: string | null
          profile: string | null
          views: number | null
        }
        Insert: {
          comments?: number | null
          content?: string | null
          dislikes?: number | null
          embedding?: string | null
          hashtags?: string | null
          id?: number
          likes?: number | null
          metadata?: Json | null
          platform?: string | null
          post_url?: string | null
          profile?: string | null
          views?: number | null
        }
        Update: {
          comments?: number | null
          content?: string | null
          dislikes?: number | null
          embedding?: string | null
          hashtags?: string | null
          id?: number
          likes?: number | null
          metadata?: Json | null
          platform?: string | null
          post_url?: string | null
          profile?: string | null
          views?: number | null
        }
        Relationships: []
      }
      fb_guide_docs: {
        Row: {
          content: string
          content_tsv: unknown | null
          created_at: string
          embedding: string | null
          id: number
          metadata: Json | null
          title: string | null
        }
        Insert: {
          content: string
          content_tsv?: unknown | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
        }
        Update: {
          content?: string
          content_tsv?: unknown | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      ig_guide_docs: {
        Row: {
          content: string
          content_tsv: unknown | null
          created_at: string
          embedding: string | null
          id: number
          metadata: Json | null
          title: string | null
        }
        Insert: {
          content: string
          content_tsv?: unknown | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
        }
        Update: {
          content?: string
          content_tsv?: unknown | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          comments: number | null
          content: string | null
          date: string | null
          dislikes: number | null
          embedding: string | null
          hashtags: string | null
          id: number
          likes: number | null
          metadata: Json | null
          platform: string | null
          post_url: string | null
          profile: string | null
          views: number | null
        }
        Insert: {
          comments?: number | null
          content?: string | null
          date?: string | null
          dislikes?: number | null
          embedding?: string | null
          hashtags?: string | null
          id?: number
          likes?: number | null
          metadata?: Json | null
          platform?: string | null
          post_url?: string | null
          profile?: string | null
          views?: number | null
        }
        Update: {
          comments?: number | null
          content?: string | null
          date?: string | null
          dislikes?: number | null
          embedding?: string | null
          hashtags?: string | null
          id?: number
          likes?: number | null
          metadata?: Json | null
          platform?: string | null
          post_url?: string | null
          profile?: string | null
          views?: number | null
        }
        Relationships: []
      }
      li_guide_docs: {
        Row: {
          content: string
          content_tsv: unknown | null
          created_at: string
          embedding: string | null
          id: number
          metadata: Json | null
          title: string | null
        }
        Insert: {
          content: string
          content_tsv?: unknown | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
        }
        Update: {
          content?: string
          content_tsv?: unknown | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      linkedin_posts: {
        Row: {
          celebrate: number | null
          comments: number | null
          content: string | null
          date: string | null
          embedding: string | null
          funny: number | null
          hashtags: string | null
          id: number
          insight: number | null
          likes: number | null
          love: number | null
          media_url: string | null
          metadata: Json | null
          platform: string | null
          post_url: string | null
          profile: string | null
          reposts: number | null
          support: number | null
          total_interactions: number | null
          total_reactions: number | null
          views: number | null
        }
        Insert: {
          celebrate?: number | null
          comments?: number | null
          content?: string | null
          date?: string | null
          embedding?: string | null
          funny?: number | null
          hashtags?: string | null
          id?: number
          insight?: number | null
          likes?: number | null
          love?: number | null
          media_url?: string | null
          metadata?: Json | null
          platform?: string | null
          post_url?: string | null
          profile?: string | null
          reposts?: number | null
          support?: number | null
          total_interactions?: number | null
          total_reactions?: number | null
          views?: number | null
        }
        Update: {
          celebrate?: number | null
          comments?: number | null
          content?: string | null
          date?: string | null
          embedding?: string | null
          funny?: number | null
          hashtags?: string | null
          id?: number
          insight?: number | null
          likes?: number | null
          love?: number | null
          media_url?: string | null
          metadata?: Json | null
          platform?: string | null
          post_url?: string | null
          profile?: string | null
          reposts?: number | null
          support?: number | null
          total_interactions?: number | null
          total_reactions?: number | null
          views?: number | null
        }
        Relationships: []
      }
      news_documents: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      reddit_docs: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          created_iso: string | null
          detected_category: string | null
          document_source: string | null
          downs: number | null
          embedding: string | null
          engagement_score: number | null
          external_id: string | null
          keyword_coverage: number | null
          link_url: string | null
          matched_keywords: string | null
          matched_keywords_count: number | null
          metadata: Json | null
          num_comments: number | null
          priority: string | null
          score: number | null
          score_breakdown: string | null
          subreddit: string | null
          subreddit_subscribers: number | null
          thumbnail: string | null
          title: string | null
          total_score: number | null
          ups: number | null
          upvote_ratio: number | null
          used_keywords: string | null
          velocity: number | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          created_iso?: string | null
          detected_category?: string | null
          document_source?: string | null
          downs?: number | null
          embedding?: string | null
          engagement_score?: number | null
          external_id?: string | null
          keyword_coverage?: number | null
          link_url?: string | null
          matched_keywords?: string | null
          matched_keywords_count?: number | null
          metadata?: Json | null
          num_comments?: number | null
          priority?: string | null
          score?: number | null
          score_breakdown?: string | null
          subreddit?: string | null
          subreddit_subscribers?: number | null
          thumbnail?: string | null
          title?: string | null
          total_score?: number | null
          ups?: number | null
          upvote_ratio?: number | null
          used_keywords?: string | null
          velocity?: number | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          created_iso?: string | null
          detected_category?: string | null
          document_source?: string | null
          downs?: number | null
          embedding?: string | null
          engagement_score?: number | null
          external_id?: string | null
          keyword_coverage?: number | null
          link_url?: string | null
          matched_keywords?: string | null
          matched_keywords_count?: number | null
          metadata?: Json | null
          num_comments?: number | null
          priority?: string | null
          score?: number | null
          score_breakdown?: string | null
          subreddit?: string | null
          subreddit_subscribers?: number | null
          thumbnail?: string | null
          title?: string | null
          total_score?: number | null
          ups?: number | null
          upvote_ratio?: number | null
          used_keywords?: string | null
          velocity?: number | null
        }
        Relationships: []
      }
      vault_docs: {
        Row: {
          content: string
          created_at: string
          doc_type: string
          embedding: string | null
          id: string
          metadata: Json | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          doc_type: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          doc_type?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vault_source_records: {
        Row: {
          created_at: string
          crm_object_id: string
          id: string
          vault_doc_id: string
        }
        Insert: {
          created_at?: string
          crm_object_id: string
          id?: string
          vault_doc_id: string
        }
        Update: {
          created_at?: string
          crm_object_id?: string
          id?: string
          vault_doc_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vault_source_records_crm_object_id_fkey"
            columns: ["crm_object_id"]
            isOneToOne: false
            referencedRelation: "crm_objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vault_source_records_vault_doc_id_fkey"
            columns: ["vault_doc_id"]
            isOneToOne: false
            referencedRelation: "vault_docs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_facebook_posts: {
        Args: {
          filter: Json
          match_count: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
          row_id: number
          similarity: number
        }[]
      }
      match_fb_guide_docs: {
        Args: {
          filter: Json
          match_count: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
          row_id: number
          similarity: number
        }[]
      }
      match_ig_guide_docs: {
        Args: {
          filter: Json
          match_count: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
          row_id: number
          similarity: number
        }[]
      }
      match_instagram_posts: {
        Args: {
          filter: Json
          match_count: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
          row_id: number
          similarity: number
        }[]
      }
      match_li_guide_docs: {
        Args: {
          filter: Json
          match_count: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
          row_id: number
          similarity: number
        }[]
      }
      match_linkedin_posts: {
        Args: {
          filter: Json
          match_count: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
          row_id: number
          similarity: number
        }[]
      }
      match_reddit_docs: {
        Args: {
          filter: Json
          match_count: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
          reddit_id: string
          similarity: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
