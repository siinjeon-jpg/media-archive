with target_user as (
  select id
  from auth.users
  order by created_at asc
  limit 1
)
insert into public.media_entries (
  user_id,
  title,
  slug,
  category,
  status,
  rating,
  review,
  memo,
  tags,
  country,
  consumed_on,
  is_wishlist
)
select
  target_user.id,
  seed.title,
  seed.slug,
  seed.category::public.media_category,
  seed.status::public.entry_status,
  seed.rating,
  seed.review,
  seed.memo,
  seed.tags,
  seed.country,
  seed.consumed_on,
  seed.is_wishlist
from target_user
cross join (
  values
    (
      'Frieren: Beyond Journey''s End',
      'frieren-beyond-journeys-end',
      'anime',
      'completed',
      10,
      'Melancholy fantasy that somehow feels like memory itself.',
      'The quiet spaces between plot beats are the real magic here. Every flashback lands because the present is already haunted by what was lost.',
      array['fantasy', 'melancholy', 'journey', 'healing']::text[],
      'Japan',
      date '2026-03-12',
      false
    ),
    (
      'Monster',
      'monster',
      'manga',
      'completed',
      9,
      'A moral thriller that keeps tightening long after the reveal.',
      'What stays with me is the series'' patience. It trusts the reader to sit inside ambiguity instead of rewarding them with neat answers.',
      array['psychological', 'thriller', 'crime', 'slow-burn']::text[],
      'Japan',
      date '2026-02-03',
      false
    ),
    (
      'Decision to Leave',
      'decision-to-leave',
      'movie',
      'completed',
      9,
      'Elegant longing wrapped in a detective story.',
      'The directing is so precise that the emotional reveal feels inevitable rather than dramatic. Every visual motif sharpens the ache.',
      array['romance', 'mystery', 'neo-noir', 'obsession']::text[],
      'South Korea',
      date '2026-01-18',
      false
    ),
    (
      'My Liberation Notes',
      'my-liberation-notes',
      'drama',
      'completed',
      10,
      'A whisper-level drama about exhaustion, desire, and being seen.',
      'This is the kind of story that becomes more honest the quieter it gets. The emotional realism is almost alarming.',
      array['slice-of-life', 'healing', 'intimacy', 'slow-burn']::text[],
      'South Korea',
      date '2025-12-22',
      false
    ),
    (
      'Pachinko',
      'pachinko',
      'novel',
      'completed',
      8,
      'Intergenerational sweep with a deeply human center.',
      'The prose is restrained, but the emotional accumulation is huge. The historical movement never swallows the private lives.',
      array['historical', 'family', 'diaspora']::text[],
      'South Korea',
      date '2025-11-11',
      false
    ),
    (
      'The Apothecary Diaries',
      'the-apothecary-diaries',
      'anime',
      'watching',
      8,
      'Sharp, playful intrigue with a lead who is impossible not to follow.',
      'The procedural rhythm keeps it light on the surface, but the class politics underneath keep expanding the world in useful ways.',
      array['mystery', 'court', 'historical', 'clever']::text[],
      'Japan',
      date '2026-04-04',
      true
    ),
    (
      'Intermezzo',
      'intermezzo',
      'novel',
      'planned',
      null,
      'Queued for the next stretch of emotionally complicated literary fiction.',
      'On the wishlist because the voice and sibling tension seem like exactly the kind of sharp interiority I love.',
      array['literary', 'siblings', 'intimacy']::text[],
      'Ireland',
      null,
      true
    ),
    (
      'Orb: On the Movements of the Earth',
      'orb-on-the-movements-of-the-earth',
      'manga',
      'planned',
      null,
      'Saved for its mix of history, science, and philosophical pressure.',
      'This feels aligned with my taste for works that turn ideas into human stakes without flattening either one.',
      array['history', 'science', 'philosophy']::text[],
      'Japan',
      null,
      true
    )
) as seed(
  title,
  slug,
  category,
  status,
  rating,
  review,
  memo,
  tags,
  country,
  consumed_on,
  is_wishlist
)
on conflict (user_id, slug) do nothing;
