-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100) NOT NULL,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  description TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  sales INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price_from DECIMAL(10,2),
  time_estimate VARCHAR(100),
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  device VARCHAR(100) NOT NULL,
  problem VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, name) VALUES 
('admin@xtech.com', 'admin123', 'Admin Xtech')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, price, original_price, category, stock, featured, is_new, image_url, description, rating, sales) VALUES
('iPhone 15 Pro Max', 1299.00, 1499.00, 'Smartphones', 15, true, true, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'O mais avançado iPhone de sempre com chip A17 Pro', 4.9, 45),
('MacBook Pro M3 Max', 2499.00, 2799.00, 'Laptops', 8, true, true, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'Poder profissional para criadores com chip M3 Max', 4.8, 23),
('AirPods Pro 2', 279.00, 329.00, 'Audio', 32, false, false, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'Audio imersivo com cancelamento de ruído ativo', 4.7, 67),
('iPad Pro 12.9 M2', 1199.00, 1399.00, 'Tablets', 12, true, false, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'Criatividade sem limites com display Liquid Retina XDR', 4.8, 34),
('Samsung Galaxy S24 Ultra', 1099.00, 1299.00, 'Smartphones', 20, false, true, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 'Inovação Android premium com S Pen integrada', 4.6, 28),
('Dell XPS 15 OLED', 1899.00, 2199.00, 'Laptops', 6, false, false, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 'Display OLED deslumbrante para profissionais', 4.5, 19),
('Apple Watch Series 9', 399.00, 449.00, 'Wearables', 25, true, true, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', 'O relógio inteligente mais avançado', 4.7, 52),
('Sony WH-1000XM5', 349.00, 399.00, 'Audio', 18, false, false, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', 'Cancelamento de ruído líder da indústria', 4.6, 41)
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (title, description, price_from, time_estimate, icon) VALUES
('Reparação de Smartphones', 'Ecrãs partidos, baterias, problemas de software e hardware', 29.00, '30min - 2h', 'Smartphone'),
('Reparação de Laptops', 'Problemas de hardware, limpeza, upgrades e otimização', 49.00, '2h - 24h', 'Laptop'),
('Reparação de Tablets', 'Ecrãs, baterias, problemas de carregamento e conectividade', 39.00, '1h - 4h', 'Tablet'),
('Reparação de Audio', 'Auscultadores, colunas, problemas de conectividade', 19.00, '30min - 1h', 'Headphones'),
('Upgrade de Hardware', 'Melhoramento de RAM, SSD, placas gráficas', 79.00, '2h - 6h', 'Zap'),
('Limpeza Profissional', 'Limpeza interna completa e manutenção preventiva', 35.00, '1h - 2h', 'Shield')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can read services" ON services FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Anyone can create service requests" ON service_requests FOR INSERT USING (true);
CREATE POLICY "Authenticated users can read service requests" ON service_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update service requests" ON service_requests FOR UPDATE TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);
