alter table matches

add column if not exists team_a bigint
generated always as (team_a_id) stored;

alter table matches

add column if not exists team_b bigint
generated always as (team_b_id) stored;

alter table matches

add column if not exists encerrada boolean
generated always as (status = 'ended') stored;