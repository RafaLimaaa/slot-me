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
        Insert: Omit<Database["public"]["Tables"]["businesses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
      };
      professionals: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          photo_url: string | null;
          specialty: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["professionals"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["professionals"]["Insert"]>;
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
      };
      professional_services: {
        Row: {
          professional_id: string;
          service_id: string;
        };
        Insert: Database["public"]["Tables"]["professional_services"]["Row"];
        Update: Partial<Database["public"]["Tables"]["professional_services"]["Row"]>;
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
      };
    };
  };
};
