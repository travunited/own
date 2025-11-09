-- ============================================
-- SOCIAL SHARING & REFERRAL SYSTEM SCHEMA
-- Tracks shares, referrals, and rewards
-- ============================================

-- ============================================
-- SOCIAL SHARES TABLE
-- Track all social media shares
-- ============================================

CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Share details
  platform TEXT NOT NULL, -- facebook, twitter, whatsapp, linkedin, email, copy_link
  content_type TEXT NOT NULL, -- visa, tour, blog, achievement, referral
  content_id UUID,
  url TEXT NOT NULL,
  
  -- Referral tracking
  referral_code TEXT,
  
  -- Metadata
  shared_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Indexes
  CONSTRAINT valid_platform CHECK (platform IN ('facebook', 'twitter', 'whatsapp', 'linkedin', 'email', 'copy_link', 'instagram', 'pinterest')),
  CONSTRAINT valid_content_type CHECK (content_type IN ('visa', 'tour', 'blog', 'achievement', 'referral', 'deal', 'testimonial'))
);

CREATE INDEX idx_social_shares_user ON social_shares(user_id);
CREATE INDEX idx_social_shares_content ON social_shares(content_type, content_id);
CREATE INDEX idx_social_shares_platform ON social_shares(platform);
CREATE INDEX idx_social_shares_referral ON social_shares(referral_code);
CREATE INDEX idx_social_shares_date ON social_shares(shared_at DESC);

-- ============================================
-- REFERRAL CLICKS TABLE
-- Track referral link clicks
-- ============================================

CREATE TABLE IF NOT EXISTS referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referral details
  referral_code TEXT NOT NULL,
  source TEXT, -- facebook, twitter, direct, etc
  campaign TEXT,
  
  -- Tracking
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  clicked_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_referral_clicks_code ON referral_clicks(referral_code);
CREATE INDEX idx_referral_clicks_date ON referral_clicks(clicked_at DESC);

-- ============================================
-- REFERRALS TABLE
-- Track successful referrals and rewards
-- ============================================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referral parties
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Referral details
  referral_code TEXT NOT NULL,
  source TEXT, -- platform where referral came from
  campaign TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, completed, rewarded, cancelled
  
  -- Rewards
  referrer_reward INTEGER DEFAULT 0,
  referee_reward INTEGER DEFAULT 0,
  conversion_value INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP,
  rewarded_at TIMESTAMP,
  
  CONSTRAINT valid_referral_status CHECK (status IN ('pending', 'completed', 'rewarded', 'cancelled'))
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_completed ON referrals(completed_at DESC);

-- ============================================
-- WALLET TRANSACTIONS TABLE
-- Track wallet credits and debits
-- ============================================

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Transaction details
  type TEXT NOT NULL, -- credit, debit
  amount INTEGER NOT NULL,
  description TEXT,
  
  -- Reference
  reference_type TEXT, -- referral, share_reward, purchase, refund
  reference_id UUID,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP,
  
  CONSTRAINT valid_transaction_type CHECK (type IN ('credit', 'debit')),
  CONSTRAINT valid_transaction_status CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_status ON wallet_transactions(status);
CREATE INDEX idx_wallet_transactions_date ON wallet_transactions(created_at DESC);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- Track user milestones and achievements
-- ============================================

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Achievement details
  achievement_type TEXT NOT NULL, -- first_visa, five_visas, ten_countries, first_tour, etc
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  
  -- Metadata
  badge_image TEXT,
  badge_color TEXT,
  
  -- Sharing
  shared BOOLEAN DEFAULT FALSE,
  share_count INTEGER DEFAULT 0,
  
  -- Timestamps
  earned_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, achievement_type)
);

CREATE INDEX idx_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_achievements_type ON user_achievements(achievement_type);
CREATE INDEX idx_achievements_earned ON user_achievements(earned_at DESC);

-- ============================================
-- Add referral_code to user_profiles
-- ============================================

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Create index on referral_code
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Generate unique referral code for user
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id UUID, p_name TEXT)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code from name + random string
    v_code := UPPER(SUBSTRING(REGEXP_REPLACE(p_name, '[^A-Za-z]', '', 'g') FROM 1 FOR 4)) || 
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    
    -- Check if code exists
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE referral_code = v_code) INTO v_exists;
    
    -- Exit loop if unique
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  -- Update user profile
  UPDATE user_profiles SET referral_code = v_code WHERE id = p_user_id;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Get user's wallet balance
CREATE OR REPLACE FUNCTION get_wallet_balance(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT COALESCE(
    SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END),
    0
  ) INTO v_balance
  FROM wallet_transactions
  WHERE user_id = p_user_id AND status = 'completed';
  
  RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- Award achievement to user
CREATE OR REPLACE FUNCTION award_achievement(
  p_user_id UUID,
  p_type TEXT,
  p_name TEXT,
  p_description TEXT
)
RETURNS UUID AS $$
DECLARE
  v_achievement_id UUID;
BEGIN
  INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
  VALUES (p_user_id, p_type, p_name, p_description)
  ON CONFLICT (user_id, achievement_type) DO NOTHING
  RETURNING id INTO v_achievement_id;
  
  RETURN v_achievement_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-generate referral code on user creation
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code(NEW.id, COALESCE(NEW.full_name, NEW.username, 'USER'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_generate_referral_code
BEFORE INSERT ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION auto_generate_referral_code();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Social shares policies
CREATE POLICY "Users can view own shares"
  ON social_shares FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shares"
  ON social_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- Wallet transactions policies
CREATE POLICY "Users can view own transactions"
  ON wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- SAMPLE DATA & ACHIEVEMENTS
-- ============================================

-- Define achievement types
INSERT INTO public.achievement_types (type, name, description, badge_icon, badge_color) VALUES
('first_visa', 'First Visa', 'Got your first visa approved', '🎉', '#10b981'),
('five_visas', 'Visa Pro', 'Got 5 visas approved', '🌟', '#f59e0b'),
('ten_visas', 'Travel Expert', 'Got 10 visas approved', '🏆', '#ef4444'),
('first_tour', 'First Adventure', 'Booked your first tour', '✈️', '#3b82f6'),
('five_tours', 'Explorer', 'Completed 5 tours', '🗺️', '#8b5cf6'),
('ten_countries', 'World Traveler', 'Visited 10 countries', '🌍', '#ec4899'),
('top_reviewer', 'Top Reviewer', 'Left 10 helpful reviews', '⭐', '#fbbf24'),
('referral_master', 'Referral Master', 'Referred 10 friends', '🎁', '#06b6d4')
ON CONFLICT (type) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Social sharing schema created!';
  RAISE NOTICE '📊 Tables: social_shares, referral_clicks, referrals, wallet_transactions, user_achievements';
  RAISE NOTICE '🔧 Functions: generate_referral_code, get_wallet_balance, award_achievement';
  RAISE NOTICE '⚡ Triggers: auto_generate_referral_code';
  RAISE NOTICE '🔒 RLS policies enabled';
END $$;

