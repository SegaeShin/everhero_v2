create extension if not exists pgcrypto;

create table if not exists company_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null,
  employee_count integer not null default 0,
  pension_type text not null,
  provider text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists employees (
  id text primary key,
  name text not null,
  department text not null,
  join_date date not null,
  birth_year integer not null,
  balance numeric(15, 0) not null default 0,
  monthly_contribution numeric(15, 0) not null default 0,
  return_rate numeric(5, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists employee_risk_flags (
  id bigint generated always as identity primary key,
  employee_id text not null references employees(id) on delete cascade,
  flag text not null check (
    flag in (
      'risk_asset_over',
      'high_fee',
      'low_return',
      'no_diversification',
      'age_mismatch'
    )
  ),
  created_at timestamptz not null default now(),
  unique (employee_id, flag)
);

create table if not exists employee_portfolios (
  id bigint generated always as identity primary key,
  employee_id text not null references employees(id) on delete cascade,
  product_name text not null,
  category text not null check (
    category in ('equity', 'bond', 'deposit', 'mixed', 'tdf', 'alternative')
  ),
  allocation numeric(5, 2) not null,
  return_rate numeric(5, 2) not null,
  fee_rate numeric(5, 2) not null,
  risk_level integer not null check (risk_level between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists employees_department_idx on employees(department);
create index if not exists employee_risk_flags_employee_id_idx on employee_risk_flags(employee_id);
create index if not exists employee_portfolios_employee_id_idx on employee_portfolios(employee_id);

alter table company_profiles enable row level security;
alter table employees enable row level security;
alter table employee_risk_flags enable row level security;
alter table employee_portfolios enable row level security;

drop policy if exists "Public read company_profiles" on company_profiles;
create policy "Public read company_profiles"
on company_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Public read employees" on employees;
create policy "Public read employees"
on employees
for select
to anon, authenticated
using (true);

drop policy if exists "Public read employee_risk_flags" on employee_risk_flags;
create policy "Public read employee_risk_flags"
on employee_risk_flags
for select
to anon, authenticated
using (true);

drop policy if exists "Public read employee_portfolios" on employee_portfolios;
create policy "Public read employee_portfolios"
on employee_portfolios
for select
to anon, authenticated
using (true);
