do $$
begin

    if not exists (
        select 1
        from pg_type
        where typname = 'match_status'
    ) then

        create type match_status as enum (
            'upcoming',
            'live',
            'ended'
        );

    end if;

end
$$;