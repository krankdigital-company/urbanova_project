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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      collections: {
        Row: {
          id: string
          image: string
          is_published: boolean
          item_count: number
          slug: string
          sort_order: number
          subtitle: string
          tag: string
          title: string
          updated_at: string
        }
        Insert: {
          id?: string
          image?: string
          is_published?: boolean
          item_count?: number
          slug?: string
          sort_order?: number
          subtitle?: string
          tag?: string
          title: string
          updated_at?: string
        }
        Update: {
          id?: string
          image?: string
          is_published?: boolean
          item_count?: number
          slug?: string
          sort_order?: number
          subtitle?: string
          tag?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          area: string
          charge: number
          district: string
          eta: string
          free_threshold: number | null
          id: string
          is_active: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          area?: string
          charge?: number
          district: string
          eta?: string
          free_threshold?: number | null
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          area?: string
          charge?: number
          district?: string
          eta?: string
          free_threshold?: number | null
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      discount_redemptions: {
        Row: {
          amount: number
          created_at: string
          discount_id: string
          id: string
          order_id: string | null
          phone: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          discount_id: string
          id?: string
          order_id?: string | null
          phone?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          discount_id?: string
          id?: string
          order_id?: string | null
          phone?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_redemptions_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          code: string
          created_at: string
          description: string
          discount_type: string
          ends_at: string | null
          id: string
          is_active: boolean
          max_discount: number | null
          min_order: number
          per_customer_limit: number | null
          starts_at: string | null
          updated_at: string
          usage_limit: number | null
          used_count: number
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string
          discount_type?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order?: number
          per_customer_limit?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          discount_type?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order?: number
          per_customer_limit?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      eco_metrics: {
        Row: {
          description: string
          icon: string
          id: string
          is_published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          description?: string
          icon?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          badge: string
          cta_label: string
          cta_url: string
          id: string
          image: string
          impact: string
          is_published: boolean
          media_type: string
          sort_order: number
          secondary_cta_label: string
          secondary_cta_url: string
          subtitle: string
          tagline: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          badge?: string
          cta_label?: string
          cta_url?: string
          id?: string
          image?: string
          impact?: string
          is_published?: boolean
          media_type?: string
          sort_order?: number
          secondary_cta_label?: string
          secondary_cta_url?: string
          subtitle?: string
          tagline?: string
          title: string
          updated_at?: string
          video_url?: string
        }
        Update: {
          badge?: string
          cta_label?: string
          cta_url?: string
          id?: string
          image?: string
          impact?: string
          is_published?: boolean
          media_type?: string
          sort_order?: number
          secondary_cta_label?: string
          secondary_cta_url?: string
          subtitle?: string
          tagline?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          caption: string
          handle: string
          id: string
          image: string
          is_published: boolean
          likes: number
          product_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption?: string
          handle?: string
          id?: string
          image?: string
          is_published?: boolean
          likes?: number
          product_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string
          handle?: string
          id?: string
          image?: string
          is_published?: boolean
          likes?: number
          product_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      lookbook_outfits: {
        Row: {
          hotspots: Json
          id: string
          image: string
          is_published: boolean
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          hotspots?: Json
          id?: string
          image?: string
          is_published?: boolean
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          hotspots?: Json
          id?: string
          image?: string
          is_published?: boolean
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          badge: string
          features: Json
          id: string
          image: string
          is_published: boolean
          name: string
          sort_order: number
          stats: Json
          tagline: string
          updated_at: string
        }
        Insert: {
          badge?: string
          features?: Json
          id?: string
          image?: string
          is_published?: boolean
          name: string
          sort_order?: number
          stats?: Json
          tagline?: string
          updated_at?: string
        }
        Update: {
          badge?: string
          features?: Json
          id?: string
          image?: string
          is_published?: boolean
          name?: string
          sort_order?: number
          stats?: Json
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          group_label: string
          href: string
          id: string
          is_visible: boolean
          label: string
          location: string
          parent_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          group_label?: string
          href?: string
          id?: string
          is_visible?: boolean
          label: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          group_label?: string
          href?: string
          id?: string
          is_visible?: boolean
          label?: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          created_at: string
          id: string
          note: string
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string
          id: string
          image: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          size: string
          sku: string
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          color?: string
          id?: string
          image?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          size?: string
          sku?: string
          unit_price?: number
          variant_id?: string | null
        }
        Update: {
          color?: string
          id?: string
          image?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: string
          sku?: string
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          channel: string
          city: string
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          discount_amount: number
          discount_code: string
          district: string
          id: string
          internal_notes: string
          invoice_number: string | null
          notes: string
          order_number: string
          payment_method: string
          payment_status: string
          payment_txn_id: string
          shipping: number
          shipping_address: string
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          channel?: string
          city?: string
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          discount_amount?: number
          discount_code?: string
          district?: string
          id?: string
          internal_notes?: string
          invoice_number?: string | null
          notes?: string
          order_number: string
          payment_method?: string
          payment_status?: string
          payment_txn_id?: string
          shipping?: number
          shipping_address?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          channel?: string
          city?: string
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          discount_amount?: number
          discount_code?: string
          district?: string
          id?: string
          internal_notes?: string
          invoice_number?: string | null
          notes?: string
          order_number?: string
          payment_method?: string
          payment_status?: string
          payment_txn_id?: string
          shipping?: number
          shipping_address?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          blocks: Json
          created_at: string
          hero_image: string
          id: string
          is_published: boolean
          seo_description: string
          seo_title: string
          show_in_footer: boolean
          show_in_header: boolean
          slug: string
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          created_at?: string
          hero_image?: string
          id?: string
          is_published?: boolean
          seo_description?: string
          seo_title?: string
          show_in_footer?: boolean
          show_in_header?: boolean
          slug: string
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          created_at?: string
          hero_image?: string
          id?: string
          is_published?: boolean
          seo_description?: string
          seo_title?: string
          show_in_footer?: boolean
          show_in_header?: boolean
          slug?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_number: string
          description: string
          id: string
          instructions: string
          is_enabled: boolean
          key: string
          label: string
          requires_txn_id: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          account_number?: string
          description?: string
          id?: string
          instructions?: string
          is_enabled?: boolean
          key: string
          label: string
          requires_txn_id?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          account_number?: string
          description?: string
          id?: string
          instructions?: string
          is_enabled?: boolean
          key?: string
          label?: string
          requires_txn_id?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          description: string
          id: string
          image: string
          is_visible: boolean
          name: string
          show_in_footer: boolean
          show_in_header: boolean
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          description?: string
          id?: string
          image?: string
          is_visible?: boolean
          name: string
          show_in_footer?: boolean
          show_in_header?: boolean
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          image?: string
          is_visible?: boolean
          name?: string
          show_in_footer?: boolean
          show_in_header?: boolean
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          color: string
          created_at: string
          id: string
          low_stock_threshold: number
          product_id: string
          size: string
          sku: string
          stock: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id: string
          size?: string
          sku?: string
          stock?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id?: string
          size?: string
          sku?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          co2_saved_kg: number
          colors: Json
          composition: string
          created_at: string
          currency: string
          description: string
          detail_blocks: Json
          eco_badge: string
          eco_impact_text: string
          fit_description: string
          id: string
          images: Json
          is_best_seller: boolean
          is_new: boolean
          is_published: boolean
          is_sustainable: boolean
          name: string
          original_price: number | null
          price: number
          rating: number
          reviews_count: number
          sizes: Json
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          co2_saved_kg?: number
          colors?: Json
          composition?: string
          created_at?: string
          currency?: string
          description?: string
          detail_blocks?: Json
          eco_badge?: string
          eco_impact_text?: string
          fit_description?: string
          id?: string
          images?: Json
          is_best_seller?: boolean
          is_new?: boolean
          is_published?: boolean
          is_sustainable?: boolean
          name: string
          original_price?: number | null
          price?: number
          rating?: number
          reviews_count?: number
          sizes?: Json
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          co2_saved_kg?: number
          colors?: Json
          composition?: string
          created_at?: string
          currency?: string
          description?: string
          detail_blocks?: Json
          eco_badge?: string
          eco_impact_text?: string
          fit_description?: string
          id?: string
          images?: Json
          is_best_seller?: boolean
          is_new?: boolean
          is_published?: boolean
          is_sustainable?: boolean
          name?: string
          original_price?: number | null
          price?: number
          rating?: number
          reviews_count?: number
          sizes?: Json
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      promo_banners: {
        Row: {
          badge: string
          cta_label: string
          cta_url: string
          description: string
          eyebrow: string
          id: string
          image: string
          is_published: boolean
          media_type: string
          sort_order: number
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          badge?: string
          cta_label?: string
          cta_url?: string
          description?: string
          eyebrow?: string
          id?: string
          image?: string
          is_published?: boolean
          media_type?: string
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string
        }
        Update: {
          badge?: string
          cta_label?: string
          cta_url?: string
          description?: string
          eyebrow?: string
          id?: string
          image?: string
          is_published?: boolean
          media_type?: string
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      home_blocks: {
        Row: {
          block_type: string
          id: string
          is_visible: boolean
          settings: Json
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          block_type: string
          id?: string
          is_visible?: boolean
          settings?: Json
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          block_type?: string
          id?: string
          is_visible?: boolean
          settings?: Json
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          is_visible: boolean
          key: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          is_visible?: boolean
          key: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          is_visible?: boolean
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      shop_locations: {
        Row: {
          address: string
          city: string
          hours: string
          id: string
          is_visible: boolean
          map_url: string
          name: string
          phone: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          address?: string
          city?: string
          hours?: string
          id?: string
          is_visible?: boolean
          map_url?: string
          name: string
          phone?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          hours?: string
          id?: string
          is_visible?: boolean
          map_url?: string
          name?: string
          phone?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          is_visible: boolean
          platform: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          id?: string
          is_visible?: boolean
          platform: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Update: {
          id?: string
          is_visible?: boolean
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          delta: number
          id: string
          note: string
          product_id: string | null
          reason: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          delta?: number
          id?: string
          note?: string
          product_id?: string | null
          reason?: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          delta?: number
          id?: string
          note?: string
          product_id?: string | null
          reason?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      is_manager: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "customer"
        | "manager"
        | "staff"
        | "editor"
        | "moderator"
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
      app_role: [
        "admin",
        "customer",
        "manager",
        "staff",
        "editor",
        "moderator",
      ],
    },
  },
} as const
