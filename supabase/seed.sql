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
      '기억의 결을 그대로 품은 듯한 쓸쓸한 판타지.',
      '사건과 사건 사이의 고요한 틈이야말로 이 작품의 진짜 마법이다. 지금의 시간이 이미 상실의 그림자를 품고 있어서, 회상 장면마다 더 깊게 스며든다.',
      array['판타지', '쓸쓸함', '여정', '회복']::text[],
      '일본',
      date '2026-03-12',
      false
    ),
    (
      'Monster',
      'monster',
      'manga',
      'completed',
      9,
      '진실이 드러난 뒤에도 더 조여 오는 도덕적 스릴러.',
      '무엇보다 오래 남는 건 이 작품의 인내심이다. 명쾌한 답을 내주기보다 모호함 속에 머물도록 독자를 믿어 준다.',
      array['심리', '스릴러', '범죄', '서서히']::text[],
      '일본',
      date '2026-02-03',
      false
    ),
    (
      'Decision to Leave',
      'decision-to-leave',
      'movie',
      'completed',
      9,
      '형사 서사 안에 우아한 그리움을 감춘 영화.',
      '연출이 워낙 정교해서 감정의 드러남이 과장된 반전이 아니라 필연처럼 느껴진다. 반복되는 시각적 모티프가 애틋함을 더욱 날카롭게 만든다.',
      array['로맨스', '미스터리', '네오누아르', '집착']::text[],
      '한국',
      date '2026-01-18',
      false
    ),
    (
      'My Liberation Notes',
      'my-liberation-notes',
      'drama',
      'completed',
      10,
      '지침과 욕망, 그리고 이해받고 싶은 마음을 낮은 목소리로 그린 드라마.',
      '조용해질수록 더 솔직해지는 이야기다. 감정의 현실감이 놀라울 정도로 날것에 가깝다.',
      array['일상', '회복', '친밀감', '서서히']::text[],
      '한국',
      date '2025-12-22',
      false
    ),
    (
      'Pachinko',
      'pachinko',
      'novel',
      'completed',
      8,
      '세대를 가로지르지만 중심에는 끝내 사람이 남는 소설.',
      '문장은 절제되어 있지만 감정의 축적은 아주 크다. 거대한 역사 속에서도 개인의 삶이 지워지지 않는다.',
      array['역사', '가족', '디아스포라']::text[],
      '한국',
      date '2025-11-11',
      false
    ),
    (
      'The Apothecary Diaries',
      'the-apothecary-diaries',
      'anime',
      'watching',
      8,
      '영리하고 장난기 있는 전개에 주인공의 매력이 선명한 작품.',
      '에피소드 중심의 리듬이 겉보기엔 가볍게 흐르지만, 그 아래 깔린 계급 정치가 세계를 점점 넓혀 준다.',
      array['미스터리', '궁중', '역사', '영리함']::text[],
      '일본',
      date '2026-04-04',
      true
    ),
    (
      'Intermezzo',
      'intermezzo',
      'novel',
      'planned',
      null,
      '복잡한 감정을 밀도 있게 다룰 문학 소설로 다음 순서에 올려둔 작품.',
      '문체의 결이나 형제자매 사이의 긴장이 내가 좋아하는 예민한 내면 묘사와 꼭 맞을 것 같아 위시리스트에 담아두었다.',
      array['문학', '형제자매', '친밀감']::text[],
      '아일랜드',
      null,
      true
    ),
    (
      'Orb: On the Movements of the Earth',
      'orb-on-the-movements-of-the-earth',
      'manga',
      'planned',
      null,
      '역사와 과학, 철학적 긴장이 함께 밀려올 것 같아 담아둔 작품.',
      '아이디어와 인간의 운명을 어느 한쪽도 납작하게 만들지 않고 함께 밀어붙이는 작품일 것 같아서 취향과 잘 맞아 보인다.',
      array['역사', '과학', '철학']::text[],
      '일본',
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
