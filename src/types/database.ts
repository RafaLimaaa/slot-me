export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          description: string | null;
          address: string | null;
          city: string | null;
          phone: string | null;
          cover_url: string | null;
          logo_url: string | null;
          maps_embed_url: string | null;
          created_at: string;
        };
        Insert: {
          owner_id: string;
          name: string;
          slug: string;
          description?: string | null;
          address?: string | null;
          city?: string | null;
          phone?: string | null;
          cover_url?: string | null;
          logo_url?: string | null;
          maps_embed_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
        Relationships: [];
      };
      professionals: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          photo_url: string | null;
          specialty: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          business_id: string;
          name: string;
          photo_url?: string | null;
          specialty?: string | null;
          phone?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["professionals"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "professionals_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          price: number;
          duration_minutes: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      professional_services: {
        Row: {
          professional_id: string;
          service_id: string;
        };
        Insert: Database["public"]["Tables"]["professional_services"]["Row"];
        Update: Partial<Database["public"]["Tables"]["professional_services"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: false;
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "professional_services_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      working_hours: {
        Row: {
          id: string;
          professional_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          lunch_start: string | null;
          lunch_end: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["working_hours"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["working_hours"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "working_hours_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: false;
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          },
        ];
      };
      blocked_periods: {
        Row: {
          id: string;
          professional_id: string;
          date: string;
          start_time: string;
          end_time: string;
          reason: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blocked_periods"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["blocked_periods"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "blocked_periods_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: false;
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: {
          id: string;
          business_id: string;
          professional_id: string;
          service_id: string;
          client_name: string;
          client_phone: string;
          client_email: string;
          date: string;
          start_time: string;
          end_time: string;
          status: "scheduled" | "completed" | "cancelled";
          cancel_token: string;
          reschedule_token: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["appointments"]["Row"],
          "id" | "cancel_token" | "reschedule_token" | "created_at"
        > & { status?: "scheduled" | "completed" | "cancelled" };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: false;
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
