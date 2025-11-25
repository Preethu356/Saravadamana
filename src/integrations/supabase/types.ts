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
      achievement_badges: {
        Row: {
          badge_name: string
          badge_type: string
          earned_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          created_at: string
          id: string
          raw: Json
          score: number
          tool: string
          user_profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          raw: Json
          score: number
          tool: string
          user_profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          raw?: Json
          score?: number
          tool?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_metadata: {
        Row: {
          audio_url: string
          created_at: string
          duration_sec: number | null
          id: string
          intervention_id: string
          provider: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          duration_sec?: number | null
          id?: string
          intervention_id: string
          provider: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          duration_sec?: number | null
          id?: string
          intervention_id?: string
          provider?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_logs: {
        Row: {
          analytics: boolean | null
          consented_at: string
          data_sharing: boolean | null
          id: string
          research: boolean | null
          user_profile_id: string
        }
        Insert: {
          analytics?: boolean | null
          consented_at?: string
          data_sharing?: boolean | null
          id?: string
          research?: boolean | null
          user_profile_id: string
        }
        Update: {
          analytics?: boolean | null
          consented_at?: string
          data_sharing?: boolean | null
          id?: string
          research?: boolean | null
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_logs_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      environment_snapshots: {
        Row: {
          ai_insights: string | null
          aqi: number | null
          created_at: string | null
          humidity: number | null
          id: string
          pm25: number | null
          pressure: number | null
          temperature: number | null
          timestamp: string | null
          user_id: string
          uv_index: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          ai_insights?: string | null
          aqi?: number | null
          created_at?: string | null
          humidity?: number | null
          id?: string
          pm25?: number | null
          pressure?: number | null
          temperature?: number | null
          timestamp?: string | null
          user_id: string
          uv_index?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          ai_insights?: string | null
          aqi?: number | null
          created_at?: string | null
          humidity?: number | null
          id?: string
          pm25?: number | null
          pressure?: number | null
          temperature?: number | null
          timestamp?: string | null
          user_id?: string
          uv_index?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: []
      }
      exercise_plans: {
        Row: {
          completed_sessions: number | null
          created_at: string | null
          exercises: Json
          id: string
          plan_type: string
          reminder_enabled: boolean | null
          scheduled_time: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_sessions?: number | null
          created_at?: string | null
          exercises: Json
          id?: string
          plan_type: string
          reminder_enabled?: boolean | null
          scheduled_time?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_sessions?: number | null
          created_at?: string | null
          exercises?: Json
          id?: string
          plan_type?: string
          reminder_enabled?: boolean | null
          scheduled_time?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          created_at: string
          event_props: Json | null
          event_type: string
          id: string
          user_profile_id: string
        }
        Insert: {
          created_at?: string
          event_props?: Json | null
          event_type: string
          id?: string
          user_profile_id: string
        }
        Update: {
          created_at?: string
          event_props?: Json | null
          event_type?: string
          id?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lifestyle_logs: {
        Row: {
          created_at: string
          diet_quality: number | null
          exercise_minutes: number | null
          id: string
          log_date: string
          sleep_hours: number | null
          user_profile_id: string
          water_intake_ml: number | null
        }
        Insert: {
          created_at?: string
          diet_quality?: number | null
          exercise_minutes?: number | null
          id?: string
          log_date: string
          sleep_hours?: number | null
          user_profile_id: string
          water_intake_ml?: number | null
        }
        Update: {
          created_at?: string
          diet_quality?: number | null
          exercise_minutes?: number | null
          id?: string
          log_date?: string
          sleep_hours?: number | null
          user_profile_id?: string
          water_intake_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lifestyle_logs_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mind_plans: {
        Row: {
          created_at: string | null
          current_day: number | null
          duration_days: number | null
          id: string
          interventions: Json
          streak_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_day?: number | null
          duration_days?: number | null
          id?: string
          interventions: Json
          streak_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_day?: number | null
          duration_days?: number | null
          id?: string
          interventions?: Json
          streak_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      neural_fingerprinting: {
        Row: {
          created_at: string | null
          id: string
          protective_factors: Json
          recommendations: Json
          risk_factors: Json
          risk_level: string
          user_id: string
          vulnerability_score: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          protective_factors: Json
          recommendations: Json
          risk_factors: Json
          risk_level: string
          user_id: string
          vulnerability_score: number
        }
        Update: {
          created_at?: string | null
          id?: string
          protective_factors?: Json
          recommendations?: Json
          risk_factors?: Json
          risk_level?: string
          user_id?: string
          vulnerability_score?: number
        }
        Relationships: []
      }
      nutrition_plans: {
        Row: {
          completed_days: number | null
          created_at: string | null
          id: string
          meals: Json
          plan_type: string
          title: string
          total_days: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_days?: number | null
          created_at?: string | null
          id?: string
          meals: Json
          plan_type: string
          title: string
          total_days?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_days?: number | null
          created_at?: string | null
          id?: string
          meals?: Json
          plan_type?: string
          title?: string
          total_days?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      personality_profiles: {
        Row: {
          animal_label: string | null
          continuum_value: number | null
          created_at: string
          id: string
          scores: Json
          user_profile_id: string
        }
        Insert: {
          animal_label?: string | null
          continuum_value?: number | null
          created_at?: string
          id?: string
          scores: Json
          user_profile_id: string
        }
        Update: {
          animal_label?: string | null
          continuum_value?: number | null
          created_at?: string
          id?: string
          scores?: Json
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personality_profiles_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personality_results: {
        Row: {
          archetype: string
          created_at: string | null
          growth_areas: string[]
          id: string
          position_score: number
          reflection_notes: string | null
          strengths: string[]
          user_id: string
        }
        Insert: {
          archetype: string
          created_at?: string | null
          growth_areas: string[]
          id?: string
          position_score: number
          reflection_notes?: string | null
          strengths: string[]
          user_id: string
        }
        Update: {
          archetype?: string
          created_at?: string | null
          growth_areas?: string[]
          id?: string
          position_score?: number
          reflection_notes?: string | null
          strengths?: string[]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          mental_state: string | null
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          mental_state?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          mental_state?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      safety_flags: {
        Row: {
          created_at: string
          id: string
          message: string | null
          meta: Json | null
          severity: string
          source: string
          user_profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          meta?: Json | null
          severity: string
          source: string
          user_profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          meta?: Json | null
          severity?: string
          source?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_flags_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      screening_results: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          max_score: number
          percentage_score: number | null
          score: number
          screening_type: string
          severity: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          max_score: number
          percentage_score?: number | null
          score: number
          screening_type: string
          severity?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          max_score?: number
          percentage_score?: number | null
          score?: number
          screening_type?: string
          severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sequence_steps: {
        Row: {
          audio_script: string | null
          completed: boolean
          completed_at: string | null
          content: string
          created_at: string
          duration_minutes: number | null
          id: string
          intervention_key: string
          sequence_id: string
          step_order: number
          title: string
          type: string
        }
        Insert: {
          audio_script?: string | null
          completed?: boolean
          completed_at?: string | null
          content: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          intervention_key: string
          sequence_id: string
          step_order: number
          title: string
          type: string
        }
        Update: {
          audio_script?: string | null
          completed?: boolean
          completed_at?: string | null
          content?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          intervention_key?: string
          sequence_id?: string
          step_order?: number
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      sequences: {
        Row: {
          completed_steps: number
          created_at: string
          description: string | null
          gad7_score: number | null
          id: string
          phq9_score: number | null
          status: string
          title: string
          total_steps: number
          updated_at: string
          user_id: string
          who5_score: number | null
        }
        Insert: {
          completed_steps?: number
          created_at?: string
          description?: string | null
          gad7_score?: number | null
          id?: string
          phq9_score?: number | null
          status?: string
          title: string
          total_steps?: number
          updated_at?: string
          user_id: string
          who5_score?: number | null
        }
        Update: {
          completed_steps?: number
          created_at?: string
          description?: string | null
          gad7_score?: number | null
          id?: string
          phq9_score?: number | null
          status?: string
          title?: string
          total_steps?: number
          updated_at?: string
          user_id?: string
          who5_score?: number | null
        }
        Relationships: []
      }
      sleep_routines: {
        Row: {
          bedtime_routine: Json
          body_image_reflection: string | null
          created_at: string | null
          id: string
          psqi_score: number | null
          sleep_quality_rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bedtime_routine: Json
          body_image_reflection?: string | null
          created_at?: string | null
          id?: string
          psqi_score?: number | null
          sleep_quality_rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bedtime_routine?: Json
          body_image_reflection?: string | null
          created_at?: string | null
          id?: string
          psqi_score?: number | null
          sleep_quality_rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stigma_tool_progress: {
        Row: {
          completed: boolean | null
          completion_date: string | null
          created_at: string | null
          id: string
          responses: Json | null
          score: number | null
          tool_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          responses?: Json | null
          score?: number | null
          tool_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          responses?: Json | null
          score?: number | null
          tool_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          auth_user_id: string
          created_at: string
          display_name: string | null
          id: string
          preferred_language: string | null
          preferred_modes: Json | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_language?: string | null
          preferred_modes?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_language?: string | null
          preferred_modes?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_wellness_stats: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          journal_entries: number
          last_activity_date: string | null
          longest_streak: number
          meditation_minutes: number
          mood_entries: number
          total_sessions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          journal_entries?: number
          last_activity_date?: string | null
          longest_streak?: number
          meditation_minutes?: number
          mood_entries?: number
          total_sessions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          journal_entries?: number
          last_activity_date?: string | null
          longest_streak?: number
          meditation_minutes?: number
          mood_entries?: number
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wellness_plans: {
        Row: {
          created_at: string
          daily_routine: Json
          description: string | null
          goals: string[]
          id: string
          title: string
          updated_at: string
          user_id: string
          weekly_schedule: Json
        }
        Insert: {
          created_at?: string
          daily_routine: Json
          description?: string | null
          goals?: string[]
          id?: string
          title: string
          updated_at?: string
          user_id: string
          weekly_schedule: Json
        }
        Update: {
          created_at?: string
          daily_routine?: Json
          description?: string | null
          goals?: string[]
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          weekly_schedule?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_community_member_count: {
        Args: { community_uuid: string }
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
