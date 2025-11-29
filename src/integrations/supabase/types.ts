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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          area_m2: number | null
          base_price: number | null
          client_type: string | null
          created_at: string | null
          device_type: string | null
          discount_amount: number | null
          discount_percent: number | null
          email: string | null
          final_price: number | null
          first_landing_url: string | null
          frequency: string | null
          gclid: string | null
          id: string
          intent: string | null
          keyword: string | null
          last_page_url: string | null
          method: string | null
          mvt_arm_key: string | null
          mvt_impression_id: string | null
          name: string
          object_type: string | null
          phone: string
          service: string | null
          session_id: string | null
          source: string | null
          status: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant_id: string | null
          yclid: string | null
        }
        Insert: {
          area_m2?: number | null
          base_price?: number | null
          client_type?: string | null
          created_at?: string | null
          device_type?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          email?: string | null
          final_price?: number | null
          first_landing_url?: string | null
          frequency?: string | null
          gclid?: string | null
          id?: string
          intent?: string | null
          keyword?: string | null
          last_page_url?: string | null
          method?: string | null
          mvt_arm_key?: string | null
          mvt_impression_id?: string | null
          name: string
          object_type?: string | null
          phone: string
          service?: string | null
          session_id?: string | null
          source?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          yclid?: string | null
        }
        Update: {
          area_m2?: number | null
          base_price?: number | null
          client_type?: string | null
          created_at?: string | null
          device_type?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          email?: string | null
          final_price?: number | null
          first_landing_url?: string | null
          frequency?: string | null
          gclid?: string | null
          id?: string
          intent?: string | null
          keyword?: string | null
          last_page_url?: string | null
          method?: string | null
          mvt_arm_key?: string | null
          mvt_impression_id?: string | null
          name?: string
          object_type?: string | null
          phone?: string
          service?: string | null
          session_id?: string | null
          source?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          yclid?: string | null
        }
        Relationships: []
      }
      mvt_arm_params: {
        Row: {
          alpha: number
          beta: number
          conversions_count: number | null
          created_at: string | null
          id: string
          impressions_count: number | null
          intent: string
          revenue_sum: number | null
          test_name: string
          updated_at: string | null
          variant_key: string
        }
        Insert: {
          alpha?: number
          beta?: number
          conversions_count?: number | null
          created_at?: string | null
          id?: string
          impressions_count?: number | null
          intent?: string
          revenue_sum?: number | null
          test_name: string
          updated_at?: string | null
          variant_key: string
        }
        Update: {
          alpha?: number
          beta?: number
          conversions_count?: number | null
          created_at?: string | null
          id?: string
          impressions_count?: number | null
          intent?: string
          revenue_sum?: number | null
          test_name?: string
          updated_at?: string | null
          variant_key?: string
        }
        Relationships: []
      }
      mvt_impressions: {
        Row: {
          created_at: string | null
          device_type: string | null
          id: string
          intent: string | null
          sampled_theta: number | null
          session_id: string
          test_name: string
          utm_source: string | null
          variant_key: string
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          intent?: string | null
          sampled_theta?: number | null
          session_id: string
          test_name: string
          utm_source?: string | null
          variant_key: string
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          intent?: string | null
          sampled_theta?: number | null
          session_id?: string
          test_name?: string
          utm_source?: string | null
          variant_key?: string
        }
        Relationships: []
      }
      mvt_test_config: {
        Row: {
          confidence_threshold: number | null
          created_at: string | null
          description: string | null
          exploration_sessions_per_variant: number | null
          id: string
          is_active: boolean | null
          test_name: string
          updated_at: string | null
          variants: Json
          winner_variant: string | null
        }
        Insert: {
          confidence_threshold?: number | null
          created_at?: string | null
          description?: string | null
          exploration_sessions_per_variant?: number | null
          id?: string
          is_active?: boolean | null
          test_name: string
          updated_at?: string | null
          variants?: Json
          winner_variant?: string | null
        }
        Update: {
          confidence_threshold?: number | null
          created_at?: string | null
          description?: string | null
          exploration_sessions_per_variant?: number | null
          id?: string
          is_active?: boolean | null
          test_name?: string
          updated_at?: string | null
          variants?: Json
          winner_variant?: string | null
        }
        Relationships: []
      }
      traffic_events: {
        Row: {
          device_type: string | null
          event_data: Json | null
          event_type: string
          gclid: string | null
          id: string
          intent: string | null
          keyword_raw: string | null
          page_url: string
          referrer: string | null
          session_id: string
          timestamp: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant_id: string | null
          yclid: string | null
        }
        Insert: {
          device_type?: string | null
          event_data?: Json | null
          event_type: string
          gclid?: string | null
          id?: string
          intent?: string | null
          keyword_raw?: string | null
          page_url: string
          referrer?: string | null
          session_id: string
          timestamp?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          yclid?: string | null
        }
        Update: {
          device_type?: string | null
          event_data?: Json | null
          event_type?: string
          gclid?: string | null
          id?: string
          intent?: string | null
          keyword_raw?: string | null
          page_url?: string
          referrer?: string | null
          session_id?: string
          timestamp?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          yclid?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_arm_alpha: {
        Args: {
          p_intent: string
          p_revenue?: number
          p_test_name: string
          p_variant_key: string
        }
        Returns: undefined
      }
      increment_arm_beta: {
        Args: { p_intent: string; p_test_name: string; p_variant_key: string }
        Returns: undefined
      }
      increment_arm_impressions: {
        Args: { p_intent: string; p_test_name: string; p_variant_key: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
