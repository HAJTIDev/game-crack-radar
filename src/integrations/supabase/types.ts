export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crack_status: {
        Row: {
          crack_date: string | null
          crack_quality: string | null
          cracked_by: string | null
          created_at: string
          drm_protection: string[] | null
          game_id: string | null
          id: string
          notes: string | null
          protection_strength: string | null
          source_url: string | null
          status: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          crack_date?: string | null
          crack_quality?: string | null
          cracked_by?: string | null
          created_at?: string
          drm_protection?: string[] | null
          game_id?: string | null
          id?: string
          notes?: string | null
          protection_strength?: string | null
          source_url?: string | null
          status: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          crack_date?: string | null
          crack_quality?: string | null
          cracked_by?: string | null
          created_at?: string
          drm_protection?: string[] | null
          game_id?: string | null
          id?: string
          notes?: string | null
          protection_strength?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "crack_status_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_updates: {
        Row: {
          breaks_crack: boolean | null
          changelog: string | null
          created_at: string
          game_id: string | null
          id: string
          new_protection_added: boolean | null
          update_date: string | null
          version_number: string | null
        }
        Insert: {
          breaks_crack?: boolean | null
          changelog?: string | null
          created_at?: string
          game_id?: string | null
          id?: string
          new_protection_added?: boolean | null
          update_date?: string | null
          version_number?: string | null
        }
        Update: {
          breaks_crack?: boolean | null
          changelog?: string | null
          created_at?: string
          game_id?: string | null
          id?: string
          new_protection_added?: boolean | null
          update_date?: string | null
          version_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_updates_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          achievements: number | null
          average_2weeks: number | null
          average_forever: number | null
          created_at: string
          currency: string | null
          description: string | null
          developer: string | null
          dlc_count: number | null
          early_access: boolean | null
          genre: string | null
          has_achievements: boolean | null
          has_dlc: boolean | null
          has_trading_cards: boolean | null
          header_image: string | null
          id: string
          is_free: boolean | null
          languages: string[] | null
          last_synced_at: string | null
          median_2weeks: number | null
          median_forever: number | null
          metacritic_score: number | null
          metacritic_url: string | null
          negative: number | null
          owners: string | null
          owners_variance: number | null
          players_2weeks: number | null
          players_2weeks_variance: number | null
          players_forever: number | null
          players_forever_variance: number | null
          positive: number | null
          price: number | null
          publisher: string | null
          release_date: string | null
          score_rank: number | null
          screenshots_count: number | null
          steam_id: number
          tags: string[] | null
          title: string
          updated_at: string
          userscore: number | null
          videos_count: number | null
          website: string | null
        }
        Insert: {
          achievements?: number | null
          average_2weeks?: number | null
          average_forever?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          developer?: string | null
          dlc_count?: number | null
          early_access?: boolean | null
          genre?: string | null
          has_achievements?: boolean | null
          has_dlc?: boolean | null
          has_trading_cards?: boolean | null
          header_image?: string | null
          id?: string
          is_free?: boolean | null
          languages?: string[] | null
          last_synced_at?: string | null
          median_2weeks?: number | null
          median_forever?: number | null
          metacritic_score?: number | null
          metacritic_url?: string | null
          negative?: number | null
          owners?: string | null
          owners_variance?: number | null
          players_2weeks?: number | null
          players_2weeks_variance?: number | null
          players_forever?: number | null
          players_forever_variance?: number | null
          positive?: number | null
          price?: number | null
          publisher?: string | null
          release_date?: string | null
          score_rank?: number | null
          screenshots_count?: number | null
          steam_id: number
          tags?: string[] | null
          title: string
          updated_at?: string
          userscore?: number | null
          videos_count?: number | null
          website?: string | null
        }
        Update: {
          achievements?: number | null
          average_2weeks?: number | null
          average_forever?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          developer?: string | null
          dlc_count?: number | null
          early_access?: boolean | null
          genre?: string | null
          has_achievements?: boolean | null
          has_dlc?: boolean | null
          has_trading_cards?: boolean | null
          header_image?: string | null
          id?: string
          is_free?: boolean | null
          languages?: string[] | null
          last_synced_at?: string | null
          median_2weeks?: number | null
          median_forever?: number | null
          metacritic_score?: number | null
          metacritic_url?: string | null
          negative?: number | null
          owners?: string | null
          owners_variance?: number | null
          players_2weeks?: number | null
          players_2weeks_variance?: number | null
          players_forever?: number | null
          players_forever_variance?: number | null
          positive?: number | null
          price?: number | null
          publisher?: string | null
          release_date?: string | null
          score_rank?: number | null
          screenshots_count?: number | null
          steam_id?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          userscore?: number | null
          videos_count?: number | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
