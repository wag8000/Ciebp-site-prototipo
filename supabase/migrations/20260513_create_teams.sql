create table if not exists teams (

    id bigint generated always as identity primary key,

    escola text not null,

    nome_equipe text not null,

    created_at timestamptz default now(),

    constraint unique_team
    unique (escola, nome_equipe)
);