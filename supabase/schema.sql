-- Todo Pro Supabase Table Schema
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'P2',
  category TEXT NOT NULL DEFAULT 'General',
  due_date TEXT,
  due_time TEXT,
  reminder_enabled BOOLEAN NOT NULL DEFAULT false,
  recurrence TEXT NOT NULL DEFAULT 'none',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for demonstration/public anon key usage
CREATE POLICY "Allow public read access" ON public.todos FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.todos FOR DELETE USING (true);
