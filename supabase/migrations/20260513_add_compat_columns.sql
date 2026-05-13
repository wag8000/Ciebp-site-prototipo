-- Migration: add compatibility generated columns and RPC wrapper
alter table matches
  add column if not exists team_a bigint generated always as (time_a) stored,
  add column if not exists team_b bigint generated always as (time_b) stored,
  add column if not exists encerrada boolean generated always as (status = 'FINALIZADO') stored;

-- Add FK constraints on generated columns (time_a/time_b should already have FKs from original migration)
alter table matches
  add constraint if not exists fk_matches_team_a foreign key (team_a) references teams(id) on delete cascade;

alter table matches
  add constraint if not exists fk_matches_team_b foreign key (team_b) references teams(id) on delete cascade;

-- Wrapper RPC so frontend's expected name exists
create or replace function gerar_chaveamento()
returns void
language plpgsql
as $$
begin
  perform gerar_semifinais();
end;
$$;

-- Create indexes to help realtime queries
create index if not exists idx_matches_status on matches(status);
create index if not exists idx_matches_time_a on matches(time_a);
create index if not exists idx_matches_time_b on matches(time_b);