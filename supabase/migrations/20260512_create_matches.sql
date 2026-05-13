create table if not exists matches (

    id bigint generated always as identity primary key,

    round integer not null,

    match_number integer not null,

    team_a_id bigint,

    team_b_id bigint,

    score_a integer default 0,

    score_b integer default 0,

    status match_status default 'upcoming',

    winner_id bigint,

    next_match_id bigint,

    created_at timestamptz default now(),

    constraint fk_team_a
    foreign key (team_a_id)
    references teams(id)
    on delete set null,

    constraint fk_team_b
    foreign key (team_b_id)
    references teams(id)
    on delete set null,

    constraint fk_winner
    foreign key (winner_id)
    references teams(id)
    on delete set null,

    constraint fk_next_match
    foreign key (next_match_id)
    references matches(id)
    on delete set null
);