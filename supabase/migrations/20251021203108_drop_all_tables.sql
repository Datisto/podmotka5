/*
  # Видалення всіх старих таблиць та створення чистої бази даних

  1. Видалення
    - Видаляємо таблиці `site_content` та `backgrounds` якщо вони існують
    
  2. Нові таблиці
    - `user_content` - таблиця для збереження контенту сайту
      - `id` (uuid, primary key) - унікальний ідентифікатор
      - `content` (jsonb) - JSON з контентом сайту
      - `created_at` (timestamp) - час створення
      - `updated_at` (timestamp) - час останнього оновлення
      
  3. Безпека
    - Увімкнути RLS для таблиці `user_content`
    - Додати політику для публічного читання
    - Додати політику для запису через Edge Function (service_role)
*/

-- Видаляємо старі таблиці якщо існують
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS backgrounds CASCADE;

-- Створюємо нову чисту таблицю
CREATE TABLE IF NOT EXISTS user_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Увімкнути RLS
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;

-- Політика для публічного читання
CREATE POLICY "Anyone can read content"
  ON user_content
  FOR SELECT
  TO public
  USING (true);

-- Політика для запису через Edge Function
CREATE POLICY "Service role can write content"
  ON user_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Вставляємо початковий порожній запис
INSERT INTO user_content (content) 
VALUES ('{}'::jsonb)
ON CONFLICT DO NOTHING;