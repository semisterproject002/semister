-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable realtime for tractor_bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.tractor_bookings;

-- Enable realtime for labor_bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.labor_bookings;