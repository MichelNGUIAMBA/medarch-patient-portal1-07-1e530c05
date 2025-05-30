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
      companies: {
        Row: {
          allowed_services: string[] | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          allowed_services?: string[] | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          allowed_services?: string[] | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      lab_exams: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          exam_name: string
          exam_type: string
          id: string
          patient_id: string
          priority: string | null
          requested_at: string | null
          requested_by: string
          results: Json | null
          results_text: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          exam_name: string
          exam_type: string
          id?: string
          patient_id: string
          priority?: string | null
          requested_at?: string | null
          requested_by: string
          results?: Json | null
          results_text?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          exam_name?: string
          exam_type?: string
          id?: string
          patient_id?: string
          priority?: string | null
          requested_at?: string | null
          requested_by?: string
          results?: Json | null
          results_text?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_exams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      modification_history: {
        Row: {
          changed_fields: string[] | null
          field_name: string | null
          id: string
          modified_by: string
          modified_by_name: string
          modified_by_role: string
          new_value: string | null
          old_value: string | null
          patient_id: string
          timestamp: string | null
        }
        Insert: {
          changed_fields?: string[] | null
          field_name?: string | null
          id?: string
          modified_by: string
          modified_by_name: string
          modified_by_role: string
          new_value?: string | null
          old_value?: string | null
          patient_id: string
          timestamp?: string | null
        }
        Update: {
          changed_fields?: string[] | null
          field_name?: string | null
          id?: string
          modified_by?: string
          modified_by_name?: string
          modified_by_role?: string
          new_value?: string | null
          old_value?: string | null
          patient_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modification_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string
          company_id: string
          created_at: string | null
          email: string | null
          employee_id: string | null
          first_name: string
          gender: string
          id: string
          id_number: string | null
          last_name: string
          name: string | null
          notes: string | null
          original_patient_id: string | null
          phone: string | null
          registered_by: string | null
          service: string
          status: string
          taken_care_by: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          company_id: string
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          first_name: string
          gender: string
          id?: string
          id_number?: string | null
          last_name: string
          name?: string | null
          notes?: string | null
          original_patient_id?: string | null
          phone?: string | null
          registered_by?: string | null
          service: string
          status?: string
          taken_care_by?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          company_id?: string
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          first_name?: string
          gender?: string
          id?: string
          id_number?: string | null
          last_name?: string
          name?: string | null
          notes?: string | null
          original_patient_id?: string | null
          phone?: string | null
          registered_by?: string | null
          service?: string
          status?: string
          taken_care_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_original_patient_id_fkey"
            columns: ["original_patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_records: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          notes: string | null
          patient_id: string
          performed_by: string
          service_data: Json
          service_type: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          performed_by: string
          service_data?: Json
          service_type: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          performed_by?: string
          service_data?: Json
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
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
