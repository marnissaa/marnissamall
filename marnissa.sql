create table public.categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  slug text not null,
  created_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_slug_key unique (slug)
) TABLESPACE pg_default;

create table public.order_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  order_id uuid not null,
  product_id uuid null,
  seller_id uuid null,
  product_name text not null,
  product_image text null,
  price numeric(10, 2) not null,
  quantity integer not null,
  subtotal numeric(10, 2) not null,
  constraint order_items_pkey primary key (id),
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger trg_apply_order_item
after INSERT on order_items for EACH row
execute FUNCTION apply_order_item ();

create table public.orders (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text null,
  payment_method text null default 'cod'::text,
  status text null default 'pending'::text,
  subtotal numeric(10, 2) not null,
  shipping_cost numeric(10, 2) null default 0,
  total numeric(10, 2) not null,
  notes text null,
  created_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;

create table public.products (
  id uuid not null default gen_random_uuid (),
  seller_id uuid null,
  category_id uuid null,
  sku text null,
  name text not null,
  description text null,
  long_description text null,
  price numeric(10, 2) not null,
  old_price numeric(10, 2) null,
  cost_price numeric(10, 2) null,
  stock integer null default 0,
  low_stock_threshold integer null default 5,
  max_order_quantity integer null default 10,
  processing_time integer null default 2,
  weight text null,
  dimensions text null,
  materials text null,
  brand text null,
  origin text null,
  warranty text null,
  images text[] null default '{}'::text[],
  video_url text null,
  is_available boolean null default true,
  is_featured boolean null default false,
  allow_reviews boolean null default true,
  rating_avg numeric(3, 2) null default 0,
  rating_count integer null default 0,
  slug text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  meta_keywords text null,
  tags text[] null default '{}'::text[],
  subcategory_id uuid null,
  variants jsonb null default '[]'::jsonb,
  constraint products_pkey primary key (id),
  constraint products_sku_key unique (sku),
  constraint products_slug_key unique (slug),
  constraint products_subcategory_id_fkey foreign KEY (subcategory_id) references categories (id) on delete set null,
  constraint products_seller_id_fkey foreign KEY (seller_id) references sellers (id) on delete CASCADE,
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id) on delete set null,
  constraint products_stock_check check ((stock >= 0)),
  constraint products_price_check check ((price >= (0)::numeric))
) TABLESPACE pg_default;

create table public.reviews (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid not null,
  user_id uuid null,
  name text not null,
  rating integer not null,
  comment text null,
  is_approved boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint reviews_pkey primary key (id),
  constraint reviews_user_id_fkey foreign KEY (user_id) references auth.users (id),
  constraint reviews_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  )
) TABLESPACE pg_default;

create trigger trg_review_insert
after INSERT
or DELETE
or
update on reviews for EACH row
execute FUNCTION update_product_rating ();

create table public.sellers (
  id uuid not null default gen_random_uuid (),
  store_name text not null,
  phone text null,
  address text null,
  logo text null,
  is_approved boolean null default true,
  total_sales numeric null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint sellers_pkey primary key (id)
) TABLESPACE pg_default;

create table public.stock_movements (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid not null,
  change integer not null,
  reason text null default 'adjustment'::text,
  created_at timestamp with time zone null default now(),
  note text null,
  constraint stock_movements_pkey primary key (id)
) TABLESPACE pg_default;

create trigger trg_apply_stock_movement
after INSERT on stock_movements for EACH row
execute FUNCTION apply_stock_movement ();