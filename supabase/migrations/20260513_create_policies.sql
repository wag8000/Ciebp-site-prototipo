create policy "Teams leitura pública"
on teams
for select
using (true);

create policy "Matches leitura pública"
on matches
for select
using (true);

create policy "Teams editáveis"
on teams
for all
to authenticated
using (true)
with check (true);

create policy "Matches editáveis"
on matches
for all
to authenticated
using (true)
with check (true);