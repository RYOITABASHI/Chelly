-- reflections テーブル（汎用設計：今回の3フェーズに限定しない）
create table if not exists reflections (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),

  -- 生徒情報
  student_name text not null,

  -- プロジェクト・フェーズ（汎用：先生が自由に定義できる）
  project_name text not null default 'R''z Lab. 2026',
  phase text not null,

  -- 5段階評価（汎用：JSON形式で任意の評価軸に対応）
  ratings jsonb not null default '{}',
  -- 例: {"q1_vision": 4, "q2_trial": 3, "q3_positive": 5, "q4_grit": 4, "q5_self": 3}

  -- 自由記述（汎用：JSON形式で任意の記述項目に対応）
  notes jsonb not null default '{}',
  -- 例: {"q6_trigger": "...", "q7_idea": "...", ...}

  -- メタデータ
  submitted_at timestamptz default now()
);

-- Row Level Security: anon ユーザーからの INSERT を許可（生徒が送信できる）
alter table reflections enable row level security;

create policy "allow_anon_insert" on reflections
  for insert to anon with check (true);

-- 教員・研究者用: authenticated ユーザーは全件 SELECT 可能
create policy "allow_auth_select" on reflections
  for select to authenticated using (true);

-- anon ユーザーも SELECT 可能（ダッシュボードをパスワードなしで使う場合）
create policy "allow_anon_select" on reflections
  for select to anon using (true);
