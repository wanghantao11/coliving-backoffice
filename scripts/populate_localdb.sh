#!/bin/bash

echo "Start populating test data in backoffice db"

psql -v ON_ERROR_STOP=1 --host=127.0.0.1 --port=5432 --dbname=colive_backoffice --username "postgres" <<-EOSQL
  DELETE FROM contract;
  DELETE FROM room;
  DELETE FROM application;
  DELETE FROM accomodation;
  DELETE FROM project;
  DELETE FROM user_preferences;
  DELETE FROM interests;
  DELETE FROM user_profiles;
  DELETE FROM "user";
  DELETE FROM address;
  DELETE FROM apartment;
  DELETE FROM client;
  DELETE FROM role;
  DELETE FROM admin;
  DELETE FROM scope;
  DELETE FROM emergency_contacts;
  DELETE FROM label;
  DELETE FROM member_tags;
  DELETE FROM admin_member_notes;

  INSERT INTO "user" (user_key, iduser, first_name, last_name, birthday, user_type, registration_time, is_test_complete, tos_version_accepted, description, email, password, phone) VALUES
    (1, 'KVps9LEJQVdqy6w60EJweMnctSk0', 'Erik', 'Petersson', '1977-02-03', 'tenant', '2019-01-11 16:51:32.905077', TRUE, 1, 'Jag är en kille från Malmö', 'erik@petterson.com','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345678'),
    (2, 'BQJbo2Ymn6gmwgpAyac95vlAnH81', 'Anna', 'Lundberg', '1987-06-30', 'tenant', '2019-03-30 11:34:22.84826', TRUE, 1, 'Jag vill hita en lägenhet!', 'anna@lundberg.se','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345679'),
    (3, 'cKScvOOi6fdhet2WplsCOUDczKB3', 'Abdulahi', 'Ahmed', '1992-09-12', 'tenant', '2019-04-26 18:11:19.84826', TRUE, 1, 'I am intested in apartments near down town.', 'ahmed@ahmed.nu','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (4, 'cKScvOOi6fdhet2WplsCOUDczKB4', 'NOT', 'TENANT', '1993-09-12', 'Light', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am a light user, happy forever.', 'not@tenant.fake.es','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (5, 'cKScvOOi6fdhet2WplsCOUDczKB5', 'Bai', 'Li', '1990-09-12', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am drunk. Who are you?', 'li@bai.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (6, 'cKScvOOi6fdhet2WplsCOUDczKB6', 'Fu', 'Du', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'fu@du.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (7, 'cKScvOOi6fdhet2WplsCOUDczKB7', 'Juyi', 'Bai', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'juyi@bai.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (8, 'cKScvOOi6fdhet2WplsCOUDczKB8', 'Qingzhao', 'Li', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'qingzhao@li.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (9, 'cKScvOOi6fdhet2WplsCOUDczKB9', 'Hidetaka', 'Miyazaki', '1974-01-01', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'YOU DIED', 'hi@mi.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (10, 'cKScvOOi6fdhet2WplsCOUDczKB10', 'Hirohiko', 'Araki', '1960-06-07', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, '', 'hi@ar.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (11, 'cKScvOOi6fdhet2WplsCOUDczKB11', 'Cixin', 'Liu', '1963-06-23', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'cixin@liu.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (12, 'cKScvOOi6fdhet2WplsCOUDczKB12', 'Fu 1', 'Du 1', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'fu1@du.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (13, 'cKScvOOi6fdhet2WplsCOUDczKB13', 'Fu 2', 'Du 6', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'fu2@du.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (14, 'cKScvOOi6fdhet2WplsCOUDczKB14', 'Fu 3', 'Du 2', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'fu3@du.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (15, 'cKScvOOi6fdhet2WplsCOUDczKB15', 'Fu 4', 'Du 3', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'fu4@du.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (16, 'cKScvOOi6fdhet2WplsCOUDczKB16', 'Fu 5', 'Du 4', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'fu5@du.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670'),
    (17, 'cKScvOOi6fdhet2WplsCOUDczKB17', 'Fu 6', 'Du 5', '1989-06-03', 'tenant', '2019-05-01 18:11:19.84826', TRUE, 1, 'I am fine. And you?', 'fu6@du.fake.cn','\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '0712345670');
  SELECT setval('user_user_key_seq', (SELECT MAX(user_key) FROM "user"));

  INSERT INTO user_preferences (iduser, locations) VALUES
    (1, '{12000}'),
    (2, '{12002,12004}'),
    (3, '{16001,17001,18001}'),
    (4, '{16001,17001,18001}'),
    (5, '{16001,17001,18001}'),
    (6, '{16001,17001,18001}'),
    (7, '{16001,17001,18001}'),
    (8, '{16001,17001,18001}'),
    (9, '{16001,17001,18001}'),
    (10, '{16001,17001,18001}'),
    (11, '{16001,17001,18001}'),
    (12, '{16001,17001,18001}'),
    (13, '{16001,17001,18001}'),
    (14, '{16001,17001,18001}'),
    (15, '{16001,17001,18001}'),
    (16, '{16001,17001,18001}'),
    (17, '{16001,17001,18001}');

  INSERT INTO interests (id, value) VALUES
    (1,'sports'),
    (2,'cooking'),
    (3,'reading'),
    (4,'watching_movies'),
    (5,'running'),
    (6,'yoga_and_meditation'),
    (7,'video_games'),
    (8,'entrepreneurship'),
    (9,'hiking'),
    (10,'climbing'),
    (11,'travelling');
  SELECT setval('interests_id_seq', (SELECT MAX(id) FROM interests));

  INSERT INTO user_profiles (iduser, interest_ids, food_preference, fun_facts, schools) VALUES
    ('KVps9LEJQVdqy6w60EJweMnctSk0', '{1,2,3}', 'vegan','{}','{"MIT","IT","T"}'),
    ('BQJbo2Ymn6gmwgpAyac95vlAnH81', '{4,5}', 'vegan', '{"3":"The answer to q3"}','{"DIABLO 4 SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB3', '{6,2}','vegetarian', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEIYUU SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB4', '{1,2}', 'vegan', '{"3":"The answer to q3"}','{"I LOVE STARWAR"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB5', '{1,5}','vegan', '{"1":"The answer to q1","2":"The answer to q2"}','{"PERSONA 5 SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB6', '{3}','vegetarian', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB7', '{1}','vegan', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB8', '{4}','vegetarian', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB9', '{6}','no_preference', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB10', '{5}','vegetarian', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB11', '{5,6}','vegan', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB12', '{3,5}','vegetarian', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB13', '{3,6}','no_preference', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB14', '{4,5}','vegetarian', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB15', '{4,6}','vegan', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB16', '{1,2,3,4,5}','vegetarian', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}'),
    ('cKScvOOi6fdhet2WplsCOUDczKB17', '{3,4,5,6}','no_preference', '{"1":"The answer to q1","2":"The answer to q2"}','{"SEKIRO SCHOOL"}');

  INSERT INTO accomodation (id, "clientId", "createdAt", "accomodationName", address, "roomRentFrom", "roomRentTo", "occupancyDate", published, "publishedAt", "coverImageSource", "coverImageText") VALUES
    (11, 2, '2019-07-03 15:18:14.385378', 'COLIVE LAB', 'Agavägen 40', 2000, 3000, '2019-10-01',true, '2019-08-30 20:20:20', 'https://firebasestorage.googleapis.com/v0/b/colive-back-office-auth-stage.appspot.com/o/accomodations%2F2ee86f9e-c2b8-4f2f-846d-2914d8cd76eb?alt=media&token=9376a8c2-06f1-447f-9358-b333c875ba72', 'Test resort cover photo'),
    (12, 2, '2019-07-05 20:54:14.385378', 'COLIVE U25', 'Nytorgsgatan 44', 5000, 9000, '2019-10-01', false, NULL, 'https://firebasestorage.googleapis.com/v0/b/colive-back-office-auth-stage.appspot.com/o/accomodations%2F1b3c2582-4f5f-4cc5-a0dd-f677f83e879b?alt=media&token=e6ab9251-e565-407e-ad79-54d2b146025d', 'Test apartment cover photo'),
    (13, 2, '2020-02-05 20:54:14.385378', 'Parkstråket', 'Örnens väg 789', 5000, 6000, '2020-01-30', false, NULL, NULL, NULL);
  SELECT setval('accomodation_id_seq', (SELECT MAX(id) FROM accomodation));

  INSERT INTO project (id, accomodation_id, client_id, created_at, name, street, city, country, zip, service_fee, distance_to_public_transport, roomies_from, roomies_to, shared_area_size_from, shared_area_size_to, status, key_features, community_features, room_features, third_party_services, floor_map_source, room_rent_from, room_rent_to, move_in_date, is_published, published_at, cover_image_source, cover_image_text, apartments, about_project, about_location, about_other_info, is_applicable) VALUES
    (1, 11, 2, '2019-07-03 15:18:14.385378', 'COLIVE LAB', 'Agavägen 40', 'Stockholm', 'Sweden', '107 07', 2030, '100m-500m', 11, 12, 150, 150, 'occupied', '{roof-terrace,central-location}', '{roof-terrace,central-location,wifi,cleaning-included,laundry-room,elevator,dishwasher}', '{single-room,double-room,shared-bath}', NULL, NULL, 5814, 8670, '2019-07-01',true, '2019-03-30 20:20:20', 'https://firebasestorage.googleapis.com/v0/b/colive-back-office-auth.appspot.com/o/accomodations%2Ffff67b9a-9dc3-4deb-bf54-3f9ab5a9febb?alt=media&token=590cc2ea-782d-44e4-8ec4-bfddb084fd1d', 'Vardagsrum med matplats och soffhörna', 1, 'VÄLKOMMEN TILL COLIVE LAB
    COLIVE LAB är vår första coliving-lägenhet som slog upp portarna våren 2019 efter en genomgående totalrenovering.', 'COLIVE LAB ligger mitt på Södermalm, ett stenkast från Nytorget med dess folkliv, restauranger, caféer och barer. Flera mataffärer, apotek och systembolag ligger inom gångavstånd. Närmaste T-bana är Medborgarplatsen och flera busslinjer går i närheten, bl.a. busslinje 2, 3, 53 och 76.', 'LÄGENHETEN
COLIVE LAB består av 11 privata bostadsrum, varav ett av dessa kan hyras som dubbelrum. 
De privata rummen är delvis möblerade, vilket innebär att det finns säng och god förvaring men samtidigt plats för dig som hyresgäst att sätta en personlig prägel på rummet.
Badrummen delas av max 3 personer och är försedda med personliga badrumsskåp och krokar. Badrummen är helkaklade i olika kulörer och har en mycket god standard. 
Gemensamma utrymmen består av ett stort kök med dubbla spisar, diskmaskiner och diskhoar, matplats, soffhörna, fåtöljhörna och två terrasser i bästa läge. 
Generell standard är av god och modern kvalitet med genomgående parkettgolv och väggar målade i vitt. Köket går i en behaglig ljusgrå kulör med rostfria detaljer och vitvaror. Alla Colives lägenheter har diskmaskin. 
De gemensamma ytorna är fullt möblerade, från möbler till bestick för att det ska vara smidigt och enkelt att flytta in. 


GEMENSAMMA TILLGÅNGAR 
Tvättstugan finns i husets källare och delas av alla i fastigheten (även de som inte bor i COLIVE), men det är enkelt att boka en tvättid som passar dig.
', TRUE),
    (2, 12, 2, '2019-07-05 20:54:14.385378', 'COLIVE U25', 'Nytorgsgatan 44', 'Lidingö', 'Sweden', '182 34', 2244, '100m-500m', 4, 4, 60, 60, 'occupied', '{balcony-terrace,nearby-water}', '{balcony-terrace,nearby-water,storage-room,newly-built,cleaning-included,outdoor-bike-parking,wifi,dishwasher,elevator,laundry-room}', '{single-room,shared-bath,shared-toilet}', '{car-parking}', 'https://firebasestorage.googleapis.com/v0/b/colive-back-office-auth-stage.appspot.com/o/accomodations%2F39_1579797119422.jpg?alt=media&token=3028646c-9139-4d13-ab1f-19f504aaa964', 5236, 5609, '2019-10-14', true, '2019-08-30 20:20:20', 'https://firebasestorage.googleapis.com/v0/b/colive-back-office-auth.appspot.com/o/accomodations%2F49cac6a8-8ce9-4346-be5a-4561a53fb4e4?alt=media&token=608a4fec-aef3-4886-af24-3ca898119e81', 'Gemensam matplats och vardagsrum i delningslägenhet', 3, 'VÄLKOMMEN TILL COLIVE U25
    COLIVE U25 är en coliving-hubb för dig som är mellan 18 - 25 år. Huset är beläget i Larsberg på Lidingö, som en del i John Mattsons nyproducerade bostadshus U25 som riktar sig till unga vuxna.', 'Från Larsbergs Station tar det 6 minuter med Lidingöbanan till Ropsten där tunnelbanans röda linje ansluter. Det är möjligt att ta flera busslinjer till Lidingö Centrum samt andra delar av ön. Från närliggande Dalénums brygga går dessutom pendlingsbåtar till Nacka, Saltsjöqvarn, Djurgården och Nybroviken. Larsberg är ett lokalt centrum där du finner en stor ICA-butik, café, pizzeria, bank, apotek, blomsterhandel och gym. Larsbergsparken ligger i nära anslutning till U25 med utegym, grillplatser, fotbollsplan mm. I området finns också vattennära promenadvägar och goda cykelförbindelser hela vägen in till stan.', 'LÄGENHETEN
Varje coliving-lägenhet på U25 består av 4 privata rum.
De privata rummen är delvis möblerade, vilket innebär att det finns säng och god förvaring men samtidigt plats för dig som hyresgäst att sätta en personlig prägel på rummet.
Badrummen delas av 2 personer och är försedda med personliga badrumsskåp och krokar. Badrummen är helkaklade med en god nyproducerad standard. 
Gemensamma utrymmen består av matplats, vardagsrum, kök och en balkong i sydväst. 
De gemensamma ytorna är fullt möblerade, från möbler till bestick, för att det ska vara smidigt och enkelt att flytta in. 
Standarden är av god och modern kvalitet med genomgående parkett och väggar i en varmt vit kulör. Även köken utgörs av en behaglig naturvit kulör.
Alla Colives lägenheter har diskmaskin. 


GEMENSAMMA TILLGÅNGAR 
Gemensam takterrass samt en gård med sittplatser och cykelparkering samt laddstation för el-cykel.
Tvätt-lounge med flera tvätt-pelare finns på plan 1 och delas av alla i hubben. 
Lägenhetsgemensamma förråd i källarplan.
Hela coliving-hubben är uppkopplad med bredband från Telenor och wi-fi med god signal ingår i alla coliving-lägenheter. 
', FALSE),
    (3, 13, 2, '2020-02-05 20:54:14.385378', 'Parkstråket', 'Örnens väg 789', 'Huddinge', 'Sweden', '170 72', NULL, '100m-500m', 5, 6, 62, 90, 'coming-soon','{lounge-area,outdoor-space}', '{lounge-area,outdoor-space,meditation-room,bbq,indoor-bike-parking,storage-room,nature-park,yard-garden,wifi,dishwasher,elevator,laundry-room}', '{private-balcony,single-room,double-room,shared-bath,shared-toilet}', '{guest-apartment}', NULL, 5000, 9000, '2020-11-14', true, '2020-01-30 20:20:20', 'https://firebasestorage.googleapis.com/v0/b/colive-back-office-auth-stage.appspot.com/o/accomodations%2F40_1579527058752.jpg?alt=media&token=5e686f53-0fa4-4e90-a5bf-21241a9eed1c', NULL, 17, 'VÄLKOMMEN TILL PARKSTRÅKET
    COLIVE Parkstråket – Sveriges största och första coliving-hubb – rymmer 17 colivinglägenheter och ger hem åt ca 100 hyresgäster. Som i alla Colives hubbar har du ditt privata rum i en delad lägenhet, dessutom får du tillgång till ett helt våningsplan med gemensamhetsytor – Klubben.
    På Parkstråket bor du centralt i Haninge, nära centrum och Handens pendeltågsstation med 23 minuter till Stockholms centralstation. Från Handenterminalen går dessutom flertalet busslinjer.', 'I din närhet finns naturreservatet och friluftsområdet Rudan. Här badar du, bastar, vandrar, joggar och cyklar mountainbike – eller tränar på utegymmet. Platsen erbjuder även unika tillgångar såsom ett av Stockholms främsta konstsnöspår för längdskidåkning, och garanterad fiskelycka i sjön där kommunen planterar in 1,5 ton ädelfisk varje år. Från Parkstråket är det även promenadavstånd till Haninge centrum som erbjuder ett stort utbud av aktiviteter och shopping. Centrumet består av ca 85 butiker och restauranger samt kulturhus och bibliotek.', 'LÄGENHET
Varje coliving-lägenhet på Parkstråket består av 5-6 privata rum, varav vissa rum kan hyras som dubbelrum. 
De privata rummen är delvis möblerade, vilket innebär att det finns säng och god förvaring men samtidigt plats för dig som hyresgäst att sätta en personlig prägel på rummet.
Badrummen delas av max 3 personer och är försedda med personliga badrumsskåp och krokar. Badrummen är helkaklade med en god nyproducerad standard. 
Gemensamma utrymmen består av matplats, vardagsrum, kök och i vissa fall även balkong. 
De gemensamma ytorna är fullt möblerade, från möbler till bestick, för att det ska vara smidigt och enkelt att flytta in. 
Standarden är av god och modern kvalitet med genomgående parkett, väggar i en varmt ljusgrå kulör och fönsterbänkar i vit Carraramarmor. Köken utgörs av en behaglig naturvit kulör med rostfria detaljer och vitvaror. Alla Colives lägenheter har diskmaskin. 


GEMENSAMMA TILLGÅNGAR 
Klubben – en generös gemensamhetsyta på plan 1 som erbjuder loungeplatser, arbetsplatser och möjlighet till gemensamma filmkvällar och måltider. En sydväst-vänd uteplats finns även i anslutning till Klubben.
Fullt utrustad övernattningslägenhet till uthyrning för besökande gäster. (Ligger i anslutning till Klubben.)
Hela coliving-hubben är uppkopplad med bredband från Telenor och wi-fi med god signal ingår i alla coliving-lägenheter. Den ”gemensamma loungen” är uppkopplad till ett separat smart wi-fi.
Invändigt cykelförråd
Tvättlounge med flera tvättpelare finns på plan 1 och delas av alla i hubben.
Ytterligare områdesgemensam uteplats på gården med sittplatser samt grillplats för alla grannar i området. 
Extra förrådsutrymme finns att hyra


RÖKNING
Eftersom vi vill erbjuda våra hyresgäster ett hälsosamt boende och en rökfri boendemiljö har vi rökförbud i alla Colives hubbar. I COLIVE Parkstråket innefattas även balkonger, gård och uteplats av rökförbudet.

', TRUE);
  SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));

  INSERT INTO address (id, project_id, careof, city, country, street, zip) VALUES
    (1, 11, 'Colive Lab', 'Stockholm', 'Sweden', 'Vasagatan 12', '181 81'),
    (2, 11, '', 'Stockholm', 'Sweden', 'Vasagatan 13', '181 81'),
    (3, 11, 'Colive Lab', 'Stockholm', 'Sweden', 'Vasagatan 14', '181 81'),
    (4, 12, 'Colive Lab', 'Stockholm', 'Sweden', 'Vasagatan 15', '181 81'),
    (5, 12, 'Colive Lab', 'Stockholm', 'Sweden', 'Vasagatan 20', '181 81');
  SELECT setval('address_id_seq', (SELECT MAX(id) FROM address));

  INSERT INTO apartment (id, project_id, name) VALUES
    (1, 11, 'Lab apartment 1'),
    (2, 11, 'Lab apartment 2'),
    (3, 11, 'Lab apartment 3'),
    (4, 12, 'U25 apartment 1'),
    (5, 12, 'U25 apartment 2'),
    (6, 13, 'Parkstråket apartment 1'),
    (7, 13, 'Parkstråket apartment 2');
  SELECT setval('apartment_id_seq', (SELECT MAX(id) FROM apartment));

  INSERT INTO application (id, iduser, facade_id, created_at) VALUES
    (30, 'KVps9LEJQVdqy6w60EJweMnctSk0', 11, '2018-01-01 07:37:53.667517'),
    (31, 'BQJbo2Ymn6gmwgpAyac95vlAnH81', 11, '2018-02-02 13:44:23.437759'),
    (32, 'cKScvOOi6fdhet2WplsCOUDczKB3', 11, '2018-03-02 13:44:23.437759'),
    (33, 'cKScvOOi6fdhet2WplsCOUDczKB4', 11, '2018-04-08 13:44:23.437759'),
    (34, 'cKScvOOi6fdhet2WplsCOUDczKB5', 11, '2018-05-12 13:44:23.437759'),
    (35, 'cKScvOOi6fdhet2WplsCOUDczKB6', 11, '2018-06-02 13:44:23.437759'),
    (36, 'cKScvOOi6fdhet2WplsCOUDczKB7', 11, '2018-07-02 13:44:23.437759'),
    (37, 'cKScvOOi6fdhet2WplsCOUDczKB8', 11, '2018-08-22 13:44:23.437759'),
    (38, 'cKScvOOi6fdhet2WplsCOUDczKB9', 11, '2018-10-02 13:44:23.437759'),
    (39, 'cKScvOOi6fdhet2WplsCOUDczKB10', 11, '2018-11-11 13:44:23.437759'),
    (40, 'cKScvOOi6fdhet2WplsCOUDczKB11', 11, '2018-11-30 13:44:23.437759'),
    (41, 'cKScvOOi6fdhet2WplsCOUDczKB12', 11, '2018-12-25 13:44:23.437759'),
    (42, 'cKScvOOi6fdhet2WplsCOUDczKB13', 11, '2019-01-02 13:44:23.437759'),
    (43, 'cKScvOOi6fdhet2WplsCOUDczKB14', 11, '2019-02-28 13:44:23.437759'),
    (44, 'cKScvOOi6fdhet2WplsCOUDczKB15', 11, '2019-03-12 13:44:23.437759'),
    (45, 'cKScvOOi6fdhet2WplsCOUDczKB16', 11, '2019-04-30 13:44:23.437759'),
    (46, 'BQJbo2Ymn6gmwgpAyac95vlAnH81', 12, '2019-10-02 13:46:35.445729');
  SELECT setval('application_id_seq', (SELECT MAX(id) FROM application));

  INSERT INTO label (id, project_id, name) VALUES
    (1, 11, 'Broken window'),
    (2, 11, 'Top floor'),
    (3, 12, 'Red Building');
  SELECT setval('label_id_seq', (SELECT MAX(id) FROM label));

  INSERT INTO room (id, project_id, apartment_id, created_at, name, number, address_id, size, shared_area_size, rent, service_fee, is_suitable_for_disability, people_per_room, has_private_bathroom, has_private_kitchen, has_private_toilet, label_ids) VALUES
    (13, 11, 1, '2019-07-19 11:14:01.991233', 'Developer room', '1201', 1, 13, 100, 5100, 2800, true, 1, true, false, true, '{1}'),
    (14, 11, 1, '2019-07-19 11:14:01.991233', 'Manager room', '1202', 2, 38, 120, 6900, 3000, true, 2, false, false, true, '{2}'),
    (15, 11, 2, '2019-07-20 18:15:23.991233', 'Single room', '1001', 3, 25, 200, 7900, 5000, false, 1, false, false, true, '{1,2}'),
    (16, 11, 2, '2019-07-20 18:15:23.991233', 'Test room1', '1201', 5, 105, 100, 17500, 2000, false, 3, true, false, true, '{1,2}'),
    (17, 11, 1, '2019-07-20 18:15:23.991233', 'Test room2', '1201', 5, 105, 100, 17500, 2000, false, 3, true, true, false, '{1,2}'),
    (18, 11, 1, '2019-07-20 18:15:23.991233', 'Test room3', '1201', 5, 105, 100, 17500, 2000, false, 3, true, true, true, '{1,2}'),
    (19, 11, 1, '2019-07-20 18:15:23.991233', 'Test room4', '1201', 5, 105, 100, 17500, 2000, false, 3, true, false, false, NULL),
    (20, 11, 1, '2019-07-20 18:15:23.991233', 'Test room5', '1201', 5, 105, 100, 17500, 2000, false, 3, true, false, false, '{1}'),
    (21, 11, 2, '2019-07-20 18:15:23.991233', 'Test room6', '1201', 5, 105, 100, 17500, 2000, false, 3, true, true, true, '{2}'),
    (22, 11, 2, '2019-07-20 18:15:23.991233', 'Test room7', '1201', 5, 105, 100, 17500, 2000, false, 3, true, true, true, '{1,2}'),
    (23, 11, 2, '2019-07-20 18:15:23.991233', 'Test room8', '1201', 5, 105, 100, 17500, 2000, false, 3, true, false, true, '{1,2}'),
    (24, 11, 2, '2019-07-20 18:15:23.991233', 'Test room9', '1201', 5, 105, 100, 17500, 2000, false, 3, true, true, false, '{1,2}'),
    (25, 11, 3, '2019-07-20 18:15:23.991233', 'Test room10', '1201', 5, 105, 100, 17500, 2000, false, 3, true, true, false, '{1,2}'),
    (26, 11, 3, '2019-07-20 18:15:23.991233', 'Test room11', '1201', 5, 105, 100, 17500, 2000, false, 3, true, false, true, '{1,2}'),
    (27, 11, 3, '2019-07-20 18:15:23.991233', 'Test room12', '1201', 5, 105, 100, 17500, 2000, false, 3, true, false, true, NULL),
    (28, 11, NULL, '2019-07-20 18:15:23.991233', 'Test room13', '1201', 5, 105, 100, 17500, 2000, false, 3, true, false, true, NULL),
    (29, 12, 4, '2019-07-20 18:15:23.991233', 'Double room', '1101', 4, 65, 135, 13500, 1500, false, 2, true, false, true, '{3}'),
    (30, 12, 4, '2019-07-20 18:15:23.991233', 'Family room', '1201', 5, 105, 328, 17500, 2000, false, 3, true, false, true, '{3}');
  SELECT setval('room_id_seq', (SELECT MAX(id) FROM room));

  INSERT INTO contract (id, iduser, room_id, created_at, updated_at, start_date, end_date, status) VALUES
    (3, 'BQJbo2Ymn6gmwgpAyac95vlAnH81', 13, '2019-07-30 13:25:01.331959', '2019-07-30 13:25:01.331959', '2019-07-09 22:00:00', '2019-07-31 22:00:00', 'Initiated'),
    (4, 'BQJbo2Ymn6gmwgpAyac95vlAnH81', 15, '2019-08-12 09:27:32.89246', '2019-08-12 09:27:32.89246', '2019-08-09 22:00:00', '2019-08-31 22:00:00', 'Signed'),
    (5, 'KVps9LEJQVdqy6w60EJweMnctSk0', 17, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (6, 'cKScvOOi6fdhet2WplsCOUDczKB5', 18, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (7, 'cKScvOOi6fdhet2WplsCOUDczKB6', 19, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (8, 'cKScvOOi6fdhet2WplsCOUDczKB7', 20, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (9, 'cKScvOOi6fdhet2WplsCOUDczKB8', 21, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (10, 'cKScvOOi6fdhet2WplsCOUDczKB9', 22, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (11, 'cKScvOOi6fdhet2WplsCOUDczKB10', 23, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (12, 'cKScvOOi6fdhet2WplsCOUDczKB11', 24, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (13, 'cKScvOOi6fdhet2WplsCOUDczKB12', 25, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (14, 'cKScvOOi6fdhet2WplsCOUDczKB13', 26, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (15, 'cKScvOOi6fdhet2WplsCOUDczKB14', 27, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (16, 'cKScvOOi6fdhet2WplsCOUDczKB15', 28, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (17, 'cKScvOOi6fdhet2WplsCOUDczKB16', 29, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent'),
    (18, 'cKScvOOi6fdhet2WplsCOUDczKB17', 30, '2019-07-11 12:33:39.12347', '2019-07-11 12:33:39.12347', '2019-07-02 23:00:00', '2020-01-02 23:00:00', 'Sent');
  SELECT setval('contract_id_seq', (SELECT MAX(id) FROM contract));

  INSERT INTO client (id, created_at, updated_at, org_no, vat_no, name, phone, email, address, city, zip, country, type, logo) VALUES
    (1, DEFAULT, DEFAULT, '12345', '12345', 'administration', '+4612345678', 'tech@colive.se', 'fleminggatan 20', 'stockholm', '12345', 'Sweden', 'admin', 'img'),
    (2, DEFAULT, DEFAULT, '559145-6008', '12345', 'Colive AB', '+4608-770 38 00', 'info@colive.se', 'fleminggatan 20', 'stockholm', '12345', 'Sweden', 'default', 'img');
  SELECT setval('client_id_seq', (SELECT MAX(id) FROM client));

  INSERT INTO member_tags (id, client_id, name) VALUES
    (1, 2, 'Beautiful girl'),
    (2, 2, 'Fit for Lab'),
    (3, 2, 'Animal lovers');
  SELECT setval('label_id_seq', (SELECT MAX(id) FROM label));

  INSERT INTO admin_member_notes (iduser, description, tag_ids) VALUES
    ('BQJbo2Ymn6gmwgpAyac95vlAnH81', 'She is lovely', '{1,2}'),
    ('KVps9LEJQVdqy6w60EJweMnctSk0', 'He is a good fit for Lab', '{2,3}');
  SELECT setval('label_id_seq', (SELECT MAX(id) FROM label));

  INSERT INTO role (id, created_at, updated_at, client_id, name, scopes) VALUES
    (1, DEFAULT, DEFAULT, 1, 'sys_admin', '{1}'),
    (2, DEFAULT, DEFAULT, 2, 'site_admin', '{1}'),
    (3, DEFAULT, DEFAULT, 2, 'project_manager', '{2, 5, 6, 8, 11, 15, 17}'),
    (4, DEFAULT, DEFAULT, 2, 'community_manager', '{3, 4, 7, 8, 11, 15, 16}');
  SELECT setval('role_id_seq', (SELECT MAX(id) FROM role));

  INSERT INTO admin (id, created_at, updated_at, first_name, last_name, language, client_id, role_id, email, password, projects, type, verified, verification_code) VALUES
    (1, DEFAULT, DEFAULT, 'Xiaowei', 'Xu', 'en', 1, 1, 'xiaowei@colive.se', '\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', NULL, 'sys_admin', TRUE, NULL),
    (2, DEFAULT, DEFAULT, 'Hantao', 'Wang', 'en', 1, 1, 'hantao@colive.se', '\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', NULL, 'sys_admin', TRUE, NULL),
    (3, DEFAULT, DEFAULT, 'Victoria', 'Pometsko', 'en', 2, 2, 'victoria@colive.se', '\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '{}', 'admin', TRUE, NULL),
    (4, DEFAULT, DEFAULT, 'Malin', 'Sandström', 'sv', 2, 2, 'malin@colive.se', '\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '{}', 'default', TRUE, NULL),
    (5, DEFAULT, DEFAULT, 'Morgane', 'Oléron', 'en', 2, 2, 'morgane@colive.se', '\$2y\$12\$HLr6clsVO7Rvg/HtKPh68.9bsG/rUzgNc59KnuUmcjpMg1eWb3nRK', '{}', 'default', TRUE, NULL);
    SELECT setval('admin_id_seq', (SELECT MAX(id) FROM admin));

  INSERT INTO scope (id,value) VALUES
    (1, '*'),
    (2, 'accomodation:*'),
    (3, 'accomodation:get'),
    (4, 'application:*'),
    (5, 'application:get'),
    (6, 'room:*'),
    (7, 'room:get'),
    (8, 'contract:*'),
    (9, 'contract:get'),
    (10, 'admin:*'),
    (11, 'admin:get'),
    (12, 'client:*'),
    (13, 'client:get'),
    (14, 'role:*'),
    (15, 'role:get'),
    (16, 'newsletter:*'),
    (17, 'newsletter:get');
  SELECT setval('scope_id_seq', (SELECT MAX(id) FROM scope));

  INSERT INTO emergency_contacts (id, name, phone, relation, iduser) VALUES
    (1, 'nobody', '1234567', 'friend', 'cKScvOOi6fdhet2WplsCOUDczKB3'),
    (2, 'mommy', '7654321', 'parent', 'BQJbo2Ymn6gmwgpAyac95vlAnH81');
  SELECT setval('emergency_contacts_id_seq', (SELECT MAX(id) FROM emergency_contacts));
EOSQL
