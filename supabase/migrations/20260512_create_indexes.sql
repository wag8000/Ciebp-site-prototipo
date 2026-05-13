create index if not exists idx_matches_round
on matches(round);

create index if not exists idx_matches_status
on matches(status);

create index if not exists idx_matches_team_a
on matches(team_a_id);

create index if not exists idx_matches_team_b
on matches(team_b_id);

create index if not exists idx_matches_next
on matches(next_match_id);