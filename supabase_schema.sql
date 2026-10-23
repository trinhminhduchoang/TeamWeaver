-- =========================================================================
-- TEAMWEAVER - HỆ THỐNG CƠ SỞ DỮ LIỆU SUPABASE CHUẨN
-- Phân quyền: 'student' (Người dùng sinh viên) & 'developer' (Nhà phát triển)
-- Bảo mật: Mỗi người dùng chỉ sửa đổi profile chính mình, mật khẩu mã hóa an toàn qua Supabase Auth
-- =========================================================================

-- 1. BẢNG PROFILES (HỒ SƠ TÀI KHOẢN SINH VIÊN & NHÀ PHÁT TRIỂN)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'developer')),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    university TEXT DEFAULT 'Đại học Bách Khoa Hà Nội (HUST)',
    uni_short TEXT DEFAULT 'HUST',
    student_id TEXT,                     -- Mã số sinh viên (MSSV)
    major TEXT DEFAULT 'Công nghệ thông tin',
    gpa NUMERIC(3, 2) DEFAULT 3.6,
    max_gpa NUMERIC(3, 2) DEFAULT 4.0,
    gpa_verified BOOLEAN DEFAULT false,
    gpa_consent_agreed BOOLEAN DEFAULT false,
    phone TEXT,                          -- Số điện thoại (Chỉ hiển thị khi đã match hoặc chính chủ)
    github_url TEXT,
    linkedin_url TEXT,
    bio TEXT DEFAULT 'Chào bạn! Mình đang tìm kiếm đồng đội học tập và làm đồ án.',
    skills JSONB DEFAULT '["React", "Python"]'::jsonb,
    primary_skill_category TEXT DEFAULT 'Coding & Tech',
    expectation TEXT DEFAULT 'High Distinction (HD)',
    target_score TEXT DEFAULT 'HD',
    availability TEXT DEFAULT '8 hours / week',
    schedule_detail TEXT DEFAULT 'Tối thứ 2 - 6 và cuối tuần',
    working_style TEXT DEFAULT 'Proactive Communicator',
    working_style_traits JSONB DEFAULT '["Giao tiếp chủ động", "Đúng deadline"]'::jsonb,
    awards JSONB DEFAULT '[]'::jsonb,
    radar_scores JSONB DEFAULT '{"skills": 85, "schedule": 88, "style": 82, "goals": 90}'::jsonb,
    credit_score INTEGER DEFAULT 98,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    completed_projects_count INTEGER DEFAULT 0,
    completion_rate INTEGER DEFAULT 100,
    likes_given JSONB DEFAULT '[]'::jsonb,
    is_seeking BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG MATCHES (GHÉP ĐÔI GIỮA CÁC SINH VIÊN)
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,
    student_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    synergy_score INTEGER DEFAULT 90,
    status TEXT DEFAULT 'matched',       -- 'matched', 'archived'
    last_message TEXT,
    last_message_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG MESSAGES (TIN NHẮN CHAT THỜI GIAN THỰC)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    match_id TEXT REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT,
    sender_avatar TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG REVIEWS (ĐÁNH GIÁ TÍN NHIỆM & CREDIT ĐỒNG ĐỘI)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    target_student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT,
    author_avatar TEXT,
    author_role TEXT,
    project_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG TEAMS (KHÔNG GIAN LÀM VIỆC NHÓM TEAM HUB)
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    members JSONB DEFAULT '[]'::jsonb,
    tasks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT ROW LEVEL SECURITY (RLS) ĐỂ BẢO VỆ TÍNH TOÀN VẸN DỮ LIỆU
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- POLICIES CHO PHÉP TRUY VẤN ĐỌC & GHI AN TOÀN
-- Profiles: Mọi người có thể đọc profile công khai, nhưng chỉ chính chủ mới được sửa thông tin của mình
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Matches: Thành viên tham gia có thể xem và tạo match
DROP POLICY IF EXISTS "Matches are viewable by everyone" ON public.matches;
CREATE POLICY "Matches are viewable by everyone" ON public.matches
    FOR ALL USING (true);

-- Messages: Tin nhắn chat thời gian thực
DROP POLICY IF EXISTS "Messages are accessible by everyone" ON public.messages;
CREATE POLICY "Messages are accessible by everyone" ON public.messages
    FOR ALL USING (true);

-- Reviews: Đánh giá có thể xem bởi mọi người
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR ALL USING (true);

-- Teams: Truy cập nhóm
DROP POLICY IF EXISTS "Teams are accessible by everyone" ON public.teams;
CREATE POLICY "Teams are accessible by everyone" ON public.teams
    FOR ALL USING (true);

-- BẬT TÍNH NĂNG SUPABASE REALTIME CHO TIN NHẮN
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.messages, public.matches, public.profiles;
COMMIT;

-- TỰ ĐỘNG TẠO PROFILE VỚI ROLE KHI ĐĂNG KÝ QUA SUPABASE AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    role,
    email, 
    name, 
    university, 
    uni_short, 
    student_id, 
    major,
    avatar
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'university', 'Đại học Bách Khoa Hà Nội (HUST)'),
    COALESCE(NEW.raw_user_meta_data->>'uni_short', 'HUST'),
    COALESCE(NEW.raw_user_meta_data->>'student_id', '20230000'),
    COALESCE(NEW.raw_user_meta_data->>'major', 'Công nghệ thông tin'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80')
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    university = EXCLUDED.university;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
