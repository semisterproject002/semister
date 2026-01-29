-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('requested', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Create product categories enum
CREATE TYPE public.product_category AS ENUM ('seeds', 'fertilizers', 'pesticides', 'equipment');

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_subsidized BOOLEAN DEFAULT false,
  subsidy_percentage DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL DEFAULT 'requested',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tractors table
CREATE TABLE public.tractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model TEXT,
  horsepower INTEGER,
  hourly_rate DECIMAL(10,2) NOT NULL,
  daily_rate DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tractor bookings table
CREATE TABLE public.tractor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tractor_id UUID REFERENCES public.tractors(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  hours INTEGER NOT NULL,
  location TEXT NOT NULL,
  land_size_acres DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create labor skill categories enum
CREATE TYPE public.labor_skill AS ENUM ('harvesting', 'planting', 'spraying', 'weeding', 'irrigation', 'general');

-- Create labor workers table
CREATE TABLE public.labor_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  skill labor_skill NOT NULL,
  experience_years INTEGER DEFAULT 0,
  daily_rate DECIMAL(10,2) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  village TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create labor bookings table
CREATE TABLE public.labor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES public.labor_workers(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  days_required INTEGER NOT NULL DEFAULT 1,
  work_type labor_skill NOT NULL,
  location TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tractor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_bookings ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view, only admins can modify
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders: Users can view their own, admins can view all
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Order items: Users can view their own order items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tractors: Everyone can view available tractors
CREATE POLICY "Anyone can view available tractors" ON public.tractors
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage tractors" ON public.tractors
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tractor bookings: Users can view/create their own
CREATE POLICY "Users can view their own tractor bookings" ON public.tractor_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tractor bookings" ON public.tractor_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tractor bookings" ON public.tractor_bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tractor bookings" ON public.tractor_bookings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Labor workers: Everyone can view verified workers
CREATE POLICY "Anyone can view verified workers" ON public.labor_workers
  FOR SELECT USING (is_verified = true AND is_available = true);

CREATE POLICY "Admins can manage workers" ON public.labor_workers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Labor bookings: Users can view/create their own
CREATE POLICY "Users can view their own labor bookings" ON public.labor_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own labor bookings" ON public.labor_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own labor bookings" ON public.labor_bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all labor bookings" ON public.labor_bookings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tractor_bookings_updated_at BEFORE UPDATE ON public.tractor_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_labor_bookings_updated_at BEFORE UPDATE ON public.labor_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();