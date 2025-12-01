-- ChoreChamp Database Schema Reference
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.badges (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  description text,
  icon_url text,
  badge_type text NOT NULL,
  criteria jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT badges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conversation_members (
  id bigint NOT NULL DEFAULT nextval('conversation_members_id_seq'::regclass),
  conversation_id bigint NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamp without time zone DEFAULT now(),
  CONSTRAINT conversation_members_pkey PRIMARY KEY (id),
  CONSTRAINT conversation_members_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id)
);
CREATE TABLE public.conversations (
  id bigint NOT NULL DEFAULT nextval('conversations_id_seq'::regclass),
  task_id bigint,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id),
  CONSTRAINT conversations_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.disputes (
  id bigint NOT NULL DEFAULT nextval('disputes_id_seq'::regclass),
  task_id bigint NOT NULL,
  raised_by uuid NOT NULL,
  description text,
  status text DEFAULT 'open'::text CHECK (status = ANY (ARRAY['open'::text, 'under_review'::text, 'resolved'::text])),
  created_at timestamp without time zone DEFAULT now(),
  priority text DEFAULT 'normal'::text,
  admin_notes text,
  reopened_at timestamp without time zone,
  CONSTRAINT disputes_pkey PRIMARY KEY (id),
  CONSTRAINT disputes_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT disputes_raised_by_fkey FOREIGN KEY (raised_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.insurance_claims (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  task_id bigint NOT NULL,
  claimant_id uuid NOT NULL,
  claim_type text NOT NULL,
  description text NOT NULL,
  claim_amount numeric,
  evidence_urls ARRAY,
  status text DEFAULT 'submitted'::text,
  resolution_notes text,
  resolved_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT insurance_claims_pkey PRIMARY KEY (id),
  CONSTRAINT insurance_claims_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT insurance_claims_claimant_id_fkey FOREIGN KEY (claimant_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.locations (
  id bigint NOT NULL DEFAULT nextval('locations_id_seq'::regclass),
  user_id uuid NOT NULL,
  address text,
  city character varying,
  latitude numeric,
  longitude numeric,
  CONSTRAINT locations_pkey PRIMARY KEY (id),
  CONSTRAINT locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.messages (
  id bigint NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
  conversation_id bigint NOT NULL,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  sent_at timestamp without time zone DEFAULT now(),
  is_read boolean DEFAULT false,
  read_at timestamp without time zone,
  message_type text DEFAULT 'user'::text,
  attachment_urls ARRAY,
  updated_at timestamp without time zone,
  deleted_by_sender boolean DEFAULT false,
  deleted_by_receiver boolean DEFAULT false,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notification_preferences (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  notification_type text NOT NULL,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT notification_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notifications (
  id bigint NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  user_id uuid NOT NULL,
  title text,
  message text,
  type text CHECK (type = ANY (ARRAY['new_task'::text, 'new_offer'::text, 'offer_accepted'::text, 'offer_rejected'::text, 'task_assigned'::text, 'task_completed'::text, 'review_received'::text, 'message_received'::text, 'payment_received'::text, 'payment_sent'::text, 'task_cancelled'::text, 'system_alert'::text])),
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  action_url text,
  related_task_id bigint,
  related_offer_id bigint,
  priority text DEFAULT 'normal'::text,
  read_at timestamp without time zone,
  deleted_at timestamp without time zone,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT notifications_related_task_id_fkey FOREIGN KEY (related_task_id) REFERENCES public.tasks(id),
  CONSTRAINT notifications_related_offer_id_fkey FOREIGN KEY (related_offer_id) REFERENCES public.task_offers(id)
);
CREATE TABLE public.payments (
  id bigint NOT NULL DEFAULT nextval('payments_id_seq'::regclass),
  task_id bigint NOT NULL,
  customer_id uuid NOT NULL,
  tasker_id uuid NOT NULL,
  amount numeric NOT NULL,
  platform_fee numeric DEFAULT 0,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'refunded'::text])),
  created_at timestamp without time zone DEFAULT now(),
  transaction_type text NOT NULL,
  payment_method text,
  processing_fee numeric DEFAULT 0.00,
  net_amount numeric,
  stripe_payment_intent_id text,
  stripe_transfer_id text,
  refund_amount numeric,
  refunded_at timestamp without time zone,
  failure_reason text,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT payments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.profiles(id),
  CONSTRAINT payments_tasker_id_fkey FOREIGN KEY (tasker_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.payouts (
  id bigint NOT NULL DEFAULT nextval('payouts_id_seq'::regclass),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'paid'::text, 'rejected'::text])),
  requested_at timestamp without time zone DEFAULT now(),
  CONSTRAINT payouts_pkey PRIMARY KEY (id),
  CONSTRAINT payouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  name character varying,
  phone character varying,
  role text DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['customer'::text, 'tasker'::text, 'admin'::text])),
  profile_photo text,
  bio text,
  rating numeric DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_background_checked boolean DEFAULT false,
  background_check_date timestamp without time zone,
  stripe_customer_id text,
  stripe_account_id text,
  hourly_rate numeric,
  completed_tasks_count integer DEFAULT 0,
  cancellation_rate numeric DEFAULT 0.00,
  response_time_minutes integer,
  last_active_at timestamp without time zone,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
-- Partial unique index on phone: allows multiple NULLs but ensures non-NULL phone numbers are unique
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx ON public.profiles(phone) WHERE phone IS NOT NULL;
CREATE TABLE public.promo_code_usage (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  promo_code_id bigint NOT NULL,
  user_id uuid NOT NULL,
  task_id bigint,
  discount_applied numeric,
  used_at timestamp without time zone DEFAULT now(),
  CONSTRAINT promo_code_usage_pkey PRIMARY KEY (id),
  CONSTRAINT promo_code_usage_promo_code_id_fkey FOREIGN KEY (promo_code_id) REFERENCES public.promo_codes(id),
  CONSTRAINT promo_code_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT promo_code_usage_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.promo_codes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL,
  discount_value numeric NOT NULL,
  max_uses integer,
  current_uses integer DEFAULT 0,
  valid_from timestamp without time zone DEFAULT now(),
  valid_until timestamp without time zone,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT promo_codes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.referrals (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  referrer_id uuid NOT NULL,
  referred_id uuid NOT NULL UNIQUE,
  referral_code text NOT NULL,
  reward_amount numeric,
  reward_claimed boolean DEFAULT false,
  reward_claimed_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT referrals_pkey PRIMARY KEY (id),
  CONSTRAINT referrals_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.profiles(id),
  CONSTRAINT referrals_referred_id_fkey FOREIGN KEY (referred_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.reviews (
  id bigint NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
  task_id bigint NOT NULL,
  reviewer_id uuid NOT NULL,
  reviewee_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp without time zone DEFAULT now(),
  review_type text NOT NULL,
  helpful_count integer DEFAULT 0,
  response text,
  response_at timestamp without time zone,
  is_verified boolean DEFAULT false,
  updated_at timestamp without time zone,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id),
  CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.saved_tasks (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  task_id bigint NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT saved_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT saved_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT saved_tasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.task_assignments (
  id bigint NOT NULL DEFAULT nextval('task_assignments_id_seq'::regclass),
  task_id bigint NOT NULL,
  tasker_id uuid NOT NULL,
  offer_id bigint NOT NULL,
  assigned_at timestamp without time zone DEFAULT now(),
  started_at timestamp without time zone,
  cancelled_at timestamp without time zone,
  cancelled_by uuid,
  cancellation_reason text,
  status text DEFAULT 'active'::text,
  payment_released boolean DEFAULT false,
  payment_released_at timestamp without time zone,
  CONSTRAINT task_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT task_assignments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT task_assignments_tasker_id_fkey FOREIGN KEY (tasker_id) REFERENCES public.profiles(id),
  CONSTRAINT task_assignments_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.task_offers(id),
  CONSTRAINT task_assignments_cancelled_by_fkey FOREIGN KEY (cancelled_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.task_categories (
  id bigint NOT NULL DEFAULT nextval('task_categories_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT task_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.task_images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  task_id bigint NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  caption text,
  uploaded_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT task_images_pkey PRIMARY KEY (id),
  CONSTRAINT task_images_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT task_images_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.task_milestones (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  task_id bigint NOT NULL,
  title text NOT NULL,
  description text,
  amount numeric NOT NULL,
  status text DEFAULT 'pending'::text,
  due_date timestamp without time zone,
  completed_at timestamp without time zone,
  approved_at timestamp without time zone,
  display_order integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT task_milestones_pkey PRIMARY KEY (id),
  CONSTRAINT task_milestones_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.task_offers (
  id bigint NOT NULL DEFAULT nextval('task_offers_id_seq'::regclass),
  task_id bigint NOT NULL,
  tasker_id uuid NOT NULL,
  price numeric NOT NULL,
  message text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'withdrawn'::text])),
  created_at timestamp without time zone DEFAULT now(),
  estimated_hours numeric,
  available_from timestamp without time zone,
  expires_at timestamp without time zone DEFAULT (now() + '48:00:00'::interval),
  is_counter_offer boolean DEFAULT false,
  parent_offer_id bigint,
  updated_at timestamp without time zone,
  CONSTRAINT task_offers_pkey PRIMARY KEY (id),
  CONSTRAINT task_offers_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT task_offers_tasker_id_fkey FOREIGN KEY (tasker_id) REFERENCES public.profiles(id),
  CONSTRAINT task_offers_parent_offer_id_fkey FOREIGN KEY (parent_offer_id) REFERENCES public.task_offers(id)
);
CREATE TABLE public.task_questions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  task_id bigint NOT NULL,
  asker_id uuid NOT NULL,
  question text NOT NULL,
  answer text,
  answered_by uuid,
  answered_at timestamp without time zone,
  is_public boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT task_questions_pkey PRIMARY KEY (id),
  CONSTRAINT task_questions_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT task_questions_asker_id_fkey FOREIGN KEY (asker_id) REFERENCES public.profiles(id),
  CONSTRAINT task_questions_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.task_subcategories (
  id bigint NOT NULL DEFAULT nextval('task_subcategories_id_seq'::regclass),
  category_id bigint NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT task_subcategories_pkey PRIMARY KEY (id),
  CONSTRAINT task_subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.task_categories(id)
);
CREATE TABLE public.tasker_skills (
  id bigint NOT NULL DEFAULT nextval('tasker_skills_id_seq'::regclass),
  tasker_id uuid NOT NULL,
  subcategory_id bigint NOT NULL,
  CONSTRAINT tasker_skills_pkey PRIMARY KEY (id),
  CONSTRAINT tasker_skills_tasker_id_fkey FOREIGN KEY (tasker_id) REFERENCES public.profiles(id),
  CONSTRAINT tasker_skills_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.task_subcategories(id)
);
CREATE TABLE public.tasks (
  id bigint NOT NULL DEFAULT nextval('tasks_id_seq'::regclass),
  user_id uuid NOT NULL,
  category_id bigint,
  subcategory_id bigint,
  title character varying NOT NULL,
  description text,
  budget_type text CHECK (budget_type = ANY (ARRAY['fixed'::text, 'hourly'::text])),
  budget_amount numeric NOT NULL,
  location_id bigint,
  status text DEFAULT 'open'::text CHECK (status = ANY (ARRAY['open'::text, 'assigned'::text, 'in_progress'::text, 'completed'::text, 'cancelled'::text])),
  due_date date,
  created_at timestamp without time zone DEFAULT now(),
  image_urls ARRAY,
  urgency text DEFAULT 'flexible'::text,
  is_remote boolean DEFAULT false,
  task_size text,
  offer_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  expires_at timestamp without time zone,
  assigned_worker_id uuid,
  completed_at timestamp without time zone,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT tasks_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.task_categories(id),
  CONSTRAINT tasks_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.task_subcategories(id),
  CONSTRAINT tasks_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id),
  CONSTRAINT tasks_assigned_worker_id_fkey FOREIGN KEY (assigned_worker_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.transactions (
  id bigint NOT NULL DEFAULT nextval('transactions_id_seq'::regclass),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['credit'::text, 'debit'::text])),
  description text,
  created_at timestamp without time zone DEFAULT now(),
  status text DEFAULT 'succeeded'::text CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'succeeded'::text, 'failed'::text, 'cancelled'::text])),
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.trust_and_safety_reports (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  reporter_id uuid NOT NULL,
  reported_user_id uuid,
  reported_task_id bigint,
  report_type text NOT NULL,
  description text NOT NULL,
  evidence_urls ARRAY,
  status text DEFAULT 'pending'::text,
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT trust_and_safety_reports_pkey PRIMARY KEY (id),
  CONSTRAINT trust_and_safety_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.profiles(id),
  CONSTRAINT trust_and_safety_reports_reported_user_id_fkey FOREIGN KEY (reported_user_id) REFERENCES public.profiles(id),
  CONSTRAINT trust_and_safety_reports_reported_task_id_fkey FOREIGN KEY (reported_task_id) REFERENCES public.tasks(id),
  CONSTRAINT trust_and_safety_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.user_availability (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  day_of_week integer NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_availability_pkey PRIMARY KEY (id),
  CONSTRAINT user_availability_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.user_badges (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  badge_id bigint NOT NULL,
  earned_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_badges_pkey PRIMARY KEY (id),
  CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id)
);
CREATE TABLE public.verification_documents (
  id bigint NOT NULL DEFAULT nextval('verification_documents_id_seq'::regclass),
  user_id uuid NOT NULL,
  document_type text,
  document_file text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  uploaded_at timestamp without time zone DEFAULT now(),
  CONSTRAINT verification_documents_pkey PRIMARY KEY (id),
  CONSTRAINT verification_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
