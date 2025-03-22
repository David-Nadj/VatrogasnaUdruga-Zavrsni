--drop table opremaSkladista
--drop table opremaVatrogasca
--drop table opremaSpremnika
--drop table spremnikVozila
--drop table oprema
--drop table vatrogasac
--drop table vozila
--drop table spremnik
--drop table skladiste
--drop table vrstaOpreme
--drop table vrstaVozila

create table vrstaVozila (
	sifra int not null identity (1,1) primary key,
	vrsta varchar (30) not null
);

create table vozila (
	sifra int not null identity (1,1) primary key,
	naziv varchar (50) not null,
	brojSjedala  int not null,
	registracija varchar (10) not null,
	datumProizvodnje date,
	datumZadnjeRegistracije date not null,
	vrstaVozilaSifra int not null references vrstaVozila(sifra)
); 
create table vrstaOpreme (
	sifra int not null identity (1,1) primary key,
	vrsta varchar (50) not null
);

create table oprema (
	sifra int not null identity (1,1) primary key,
	naziv varchar (70) not null,
	opis varchar (500),
	datumProvjereValjanosti date,
	datumKrajaValjanosti date,
	vrstaOpremeSifra int not null references vrstaOpreme (sifra) 
);

create table vatrogasac (
	sifra int not null identity (1,1) primary key,
	ime varchar (15) not null,
	prezime varchar (30) not null,
	brojTelefona varchar (22) not null,
	godinaRodenja int check (godinaRodenja between 1950 and 2025)
);

create table opremaVatrogasca (
	sifra int not null identity (1,1) primary key,
	sifraVatrogasca int not null references vatrogasac (sifra),
	sifraOpreme int not null references oprema (sifra),
	kolicina int not null check (kolicina > 0)
);

create table skladiste (
	sifra int not null identity (1,1) primary key,
	naziv varchar (50) not null,
	adresa varchar (150)
);

create table opremaSkladista (
	sifra int not null identity (1,1) primary key,
	sifraSkladista int not null references skladiste (sifra),
	sifraOpreme int not null references oprema (sifra),
	kolicina int not null check (kolicina > 0)
);

create table spremnik (
	sifra int not null identity (1,1) primary key,
	naziv varchar (50) not null
);

create table opremaSpremnika (
	sifra int not null identity (1,1) primary key,
	sifraSpremnika int not null references spremnik (sifra),
	sifraOpreme int not null references oprema (sifra),
	kolicina int not null check (kolicina > 0)
);

create table spremnikVozila (
	sifra int not null identity (1,1) primary key,
	sifraSpremnika int not null references spremnik (sifra),
	sifraVozila int not null references vozila (sifra)
);

insert into vrstaOpreme (vrsta) values
	('Vatrogasne pumpe'),('Osobna vatrogasna oprema'),('Vatrogasne cijevi'),('Vatrogasne armature za vodu i pjenu'),
	('Aparati za pocetno gašenje požara'),('Aparati za zaštitu organa za disanje'),
	('Uredaji i oprema za rad na visini'),('Stabilne instalacije za gašenje požara'),('Ostala vatrogasna oprema')
	;

insert into vrstaVozila (vrsta) values
	('Autocisterna'),('Navalno vozilo'),('Tehnicko vozilo'),('Kemijsko vozilo'),
	('Autoljestve');

insert into oprema (naziv, vrstaOpremeSifra, datumKrajaValjanosti, datumProvjereValjanosti, opis) values 
	('Vatrogasna kaciga', 2, '2030-02-12', '2025-02-12', 'Namijenjena je da štiti glavu vatrogasca od mehanickih ozljeda koje nastaju zbog pada ili udarca nekog predmeta, 
		takoder štite od toplinskog isijavanja i plamena, niskih temperatura i elektricne struje'),
	('Penjački opasač', 2, '2033-02-11', '2024-02-12', 'Izradujese od kože ili poliesterskih vlakana u 4 dužine. Održava se prema uputi
		prodavaca.'),
	('Zaštitna maska',6, '2020-10-02', '2025-07-17', 'Zaštitna maska koristi se za zaštitu dišnih puteva vatrogasaca od dima, otrovnih plinova i vruceg zraka.'),
	('Vatrogasne Zaštitne čizme sa ojačanim đonom i čeličnim kapicama',2, '2020-10-02', '2025-07-17', ' Gornjište-Visokokvalitetna hidrofobirana i 
		vatrootporna goveda koža, debljine 2,3 - 2,5 mm ,Podstava-Sympatex vodonepropusna membrana,Potplat-NBR GUMA, montažni don  Kapica-Celicna / kompozitna Tabanica-Celicna / kompozitn'),
	('Zaštitne rukavice', 2, '2035-12-10', '2023-01-12', 'potpuno vodonepropusna i paropropusna sa Gore-Tex membranom'),
	('Zaštitne hlače i jakna', 2, '2035-12-10', '2023-01-12', 'Vatrogasne zaštitne hlace i jakna su osnovni dio osobne zaštitne opreme vatrogasaca i služe za zaštitu tijela od toplinskih, mehanickih i kemijskih utjecaja tijekom intervencija.'),
    ('Cijevni mostići', 9, '2035-12-10', '2023-01-12', 'Omogucuju preijlaz vozila preko tlacnih cijevi.'),	
	('Usisna vatrogasna cijev veličine B', 3, '2035-12-10', '2023-01-12', 'Izraduju se iz gume, s platnenim ili tkanim tekstilnim 
		uloškom, a u gumu je uvulkanizirana celicna spirala, Guma daje nepropusnost, tekstilni uložak služi kao 
		armatura, a celicna spirala omogucava zadržavanje poprecnog presjeka kad se u cijevi stvara podtlak'),
	('Usisna vatrogasna cijev veličine A', 3, '2035-12-10', '2023-01-12', 'Izraduju se iz gume, s platnenim ili tkanim tekstilnim 
		uloškom, a u gumu je uvulkanizirana celicna spirala, Guma daje nepropusnost, tekstilni uložak služi kao 
		armatura, a celicna spirala omogucava zadržavanje poprecnog presjeka kad se u cijevi stvara podtlak'),
	('Vatrogasna cijev veličine B', 3, '2035-12-10', '2023-01-12', 'Vatrogasne cijevu su opreme koje služe za prijenos vode pod visokim tlakom od vatrogasne pumpe do mlaznice ili mjesta požara. Razlikuju se po promjeru, kapacitetu protoka i namjeni, Promjer: 75 mm (3 cola)Radni tlak: Obicno do 16 bara,Kapacitet protoka: Otprilike 800-1600 litara/min'),
	('Vatrogasna cijev veličine C', 3, '2035-12-10', '2023-01-12', 'Vatrogasne cijevu su opreme koje služe za prijenos vode pod visokim tlakom od vatrogasne pumpe do mlaznice ili mjesta požara. Razlikuju se po promjeru, kapacitetu protoka i namjeni. Promjer: 52 mm (2 cola)Radni tlak: Obicno do 16 bara,Kapacitet protoka: Otprilike 200-800 litara/min'),
	('Vatrogasna cijev veličine D', 3, '2035-12-10', '2023-01-12', 'Vatrogasne cijevu su opreme koje služe za prijenos vode pod visokim tlakom od vatrogasne pumpe do mlaznice ili mjesta požara. Razlikuju se po promjeru, kapacitetu protoka i namjeni.Promjer: 25 mm (1 cola)Radni tlak: Obicno do 16 bara, Kapacitet protoka: Otprilike 50-200 litara/min'),
	('Odijela za zaštitu od kontaminacije', 9, '2035-12-10', '2023-01-12', 'Štiti vatrogasca od tekucina, aerosola, i drugih oblika 
		kontaminacije'),---13
	('Eksplozimetar', 9, '2035-12-10', '2023-01-12', 'Eksplozimetar uredaj koji mjeri koncentraciju zapaljivih plinova i para, kisika i ugljicnog monoksida.'),
	('Vatrogasna pumpa', 1, '2035-12-10', '2023-01-12', ' Glavna svrha vatrogasne pumpe je omoguciti ucinkovito gašenje požara osiguravajuci snažan i kontinuiran mlaz vode ili pjene.'),
	('Cijevne povezice', 4, '2035-12-10', '2023-01-12', ''),
	('Cijevni nosač', 9, '2035-12-10', '2023-01-12', ' Cijevni nosac je vatrogasna oprema koja služi za sigurno postavljanje i pridržavanje vatrogasnih crijeva tijekom intervencija. Njegova glavna funkcija je sprijeciti savijanje, uvijanje ili nekontrolirano pomicanje cijevi dok voda tece pod visokim tlakom.'),
	('Cijevni držac', 9, '2035-12-10', '2023-01-12', 'Cijevni držac je vatrogasna oprema koja se koristi za pridržavanje i vodenje vatrogasnih crijeva tijekom intervencija. Njegova glavna funkcija je olakšati manipulaciju crijevima, omoguciti bolju kontrolu mlaza vode i smanjiti opterecenje vatrogasaca.'),
	('Torbica sa užetom', 9, '2035-12-10', '2023-01-12', ''),---19
	('Cijevno vitlo', 3, '2035-12-10', '2023-01-12', 'Cijevno vitlo služi za skladištenje i brzo izvlacenje vatrogasnih crijeva.'),
	('Vatrogasna mlaznica obična', 4, '2035-12-10', '2023-01-12', 'Konstrukcijski su najjednostavnije, nemaju mogucnost prekidanja mlaza vode i mogu 
		dati samo puni mlaz vode, Oznacavaju se imenom i oznakom promjera prikljucne spojnice (B,C,D)'),
	('Vatrogasna mlaznica univerzalna', 4, '2035-12-10', '2023-01-12', 'Imaju mogucnost prekidanja mlaza vode, mogu dati puni, raspršeni ili zaštitni mlaz (ne i kombinaciju)'),
	('Vatrogasna mlaznica sa zatvaračem', 4, '2035-12-10', '2023-01-12', 'Imaju mogucnost prekidanja mlaza.'),
	('Vatrogasna mlaznica pištolj', 4, '2035-12-10', '2023-01-12', ' Visokotlacna mlaznica koja se koristi na vitlima za brzu navalu, Visoki tlak(30-60 bara), uz mali protok (do 200 l/min)
		Daje puni i raspršeni mlaz, uz poseban nastavak mogu dati i pjenu'),
	('Vatrogasna mlaznica monsun', 4, '2035-12-10', '2023-01-12', ' Ima raspršivac specijalne konstrukcije tako da gasi raspršenom vodom, razvijena je kao mlaznica za gašenje uredeja pod naponom'),
	('Vatrogasna mlaznica dubinska', 4, '2035-12-10', '2023-01-12', 'Koristi se za gašenje tinjajucih i dubinskih požara, požara ugljena, piljevine i žita
		 cijevni dio dug oko 1,5 m sa sitnim rupicama po plaštu mlaznic'),
	('Razdjelnica', 4, '2035-12-10', '2023-01-12', 'Služi za raspodjelu jednog vodenog toka u 2 ili 3, odnosno za ukljucivanje ili 
		iskljucivanje pojednih cijevnih pruga ili potrošaca koda su spojene na izvor.'),---27
	('Ublaživač reakcije vodenog mlaza', 4, '2035-12-10', '2023-01-12', 'vatrogasna armatura pomocu koje mlaznicar smanjuje reakciju pri korištenju 
		mlaza'),
	('Hidraulične škare ',9, '2018-06-03', '2025-01-30', 'Alat za rezanje metala i širenje olupina tijekom spašavanja iz vozila.'),
	('Radio stanica za komunikaciju', 9, '2022-03-25', '2025-07-05', 'Mobilna radio stanica za komunikaciju izmedu vatrogasnih timova.'),
	('Uže za spašavanje',  7, '2021-10-10', '2025-03-11', 'Specijalno vatrootporno uže za izvlacenje i spuštanje tijekom intervencija s visine.'),
	('Nosila za spašavanje', 9, '2020-01-01', '2025-04-12', 'Skopiva nosila za hitan prijevoz ozlijedenih osoba s mjesta nesrece.'),
	('Termalna kamera', 9, '2021-08-22', '2025-02-15', 'Kamera koja omogucuje prepoznavanje izvora topline i pronalaženje žrtava u zadimljenim prostorima.'),
	('Lopata za uklanjanje prepreka', 9, '2020-12-11', '2025-06-22', 'Robusna vatrogasna lopata za uklanjanje ruševina i prepreka tijekom spašavanja.'),
	('Prva pomoć - osnovni set', 9, '2019-09-20', '2025-01-10', 'Osnovni set za pružanje prve pomoci s medicinskim potrepštinama.'),
	('Sjekira za vatrogasne intervencije', 9, '2021-01-14', '2025-04-05', 'Teška sjekira s oštricom za probijanje i rezanje materijala.'),
	('Ventilator za odimljavanje', 9, '2022-02-28', '2025-08-19', 'Mobilni ventilator za uklanjanje dima iz zatvorenih prostora.'),
	('Protupožarni aparat s prahom', 5, '2018-11-13', '2025-03-29', 'Aparat za gašenje požara s prahom, idealan za elektricne i zapaljive tekucine.'),
	('Svjetiljka za intervencije',9, '2019-05-23', '2025-09-01', 'Snažna prijenosna svjetiljka otporna na vodu i udarce.'),
	('Alat za probijanje vrata',9, '2020-10-02', '2025-07-17', 'Specijalni alat za brzu intervenciju i probijanje zakljucanih vrata.'),
	('Medumješalica',9, '2020-10-02', '2025-07-17', 'Vatrogasne medumješalice su uredaji koji se koriste za miješanje vode i pjenila kako bi se stvorila vatrogasna pjena potrebna za gašenje požara zapaljivih tekucina ili drugih materijala koji se ne mogu ucinkovito gasiti vodom.'),
	(' Mlaznica za pjenu',4, '2020-10-02', '2025-07-17', 'Vatrogasne mlaznice za pjenu su posebne mlaznice koje se koriste za raspršivanje pjenila pomiješanog s vodom u obliku guste i stabilne pjene. Njihova glavna funkcija je stvaranje pjene koja se koristi za gašenje požara zapaljivih tekucina (klasa B) i cvrstih materijala impregniranih zapaljivim tvarima.'),
	('Aparati za početno gašenje požara CO2',5, '2020-10-02', '2025-07-17', 'Vatrogasni aparati za gašenje požara sa ugljicnim 
		dioksidom (CO2) namijenjeni su za gašenje požara uredaja pod elektricnim naponom, a mogu se koristiti za gašenje pocetnih požara razreda B i C'),
	('Vatrogasne ljestve',7, '2020-10-02', '2025-07-17',''), 
	('Izolacijski aparat sa stlačenim zrakom',6, '2020-10-02', '2025-07-17', ' Nacin rada– Zasniva se na ospkrbi korisnika cistim 
		zrakom za disanje iz boce– Zrak iz boce prolazi kroz ventil za redukciju, te preko tlacne cijevi dolazi do plucnog automata koji regulira protok dovoljne kolicine zraka– Izdahnuti zrak preko izdišnog ventila na zaštitnoj masci izlazi u atmosfer'),
	('Hidraulična pumpa',9, '2020-10-02', '2025-07-17','')
;
 

 insert into vatrogasac (ime, prezime, brojTelefona, godinaRodenja) values	
('David', 'Nad','099-381-7991','1998'), 
('Andreja', 'Nad','099-381-7992','1999'),
('Ivan', 'Horvat', '0911234567', '1990'),
('Petra', 'Kovacic', '0922345678', '1985'),
('Marko', 'Maric', '0953456789', '1995'),
('Ana', 'Novak', '0974567890', '1988'),
('Luka', 'Babic', '0985678901', '1992'),
('Maja', 'Sertic', '0996789012', '1993'),
('Tomislav', 'Grgic', '0917890123','1987'),
('Karla', 'Radic', '0928901234', '1991'),
('Filip', 'Juric', '0959012345', '1994'),
('Ivana', 'Milic', '0970123456', '1989'),
('Matej', 'Tomic', '0981234567', '1996'),
('Dora', 'Petrovic', '0992345678', '1993'),
('Nikola', 'Šimic', '0913456789', '1997'),
('Marina', 'Božic', '0924567890', '1986'),
('Ante', 'Vukovic', '0955678901', '1991'),
('Sara', 'Kneževic', '0976789012', '1998'),
('Josip', 'Matic', '0987890123', '1990'),
('Tena', 'Vidovic', '0998901234', '1995'),
('Damir', 'Krnic', '0919012345', '1984'),
('Ivona', 'Rašic', '0920123456', '1992');
;
   
 insert into opremaVatrogasca (sifraVatrogasca, sifraOpreme, kolicina) values
(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 1), (1, 5, 1), (1, 6, 1),
(2, 1, 1), (2, 2, 1), (2, 3, 1), (2, 4, 1), (2, 5, 1), (2, 6, 1),
(3, 1, 1), (3, 2, 1), (3, 3, 1), (3, 4, 1), (3, 5, 1), (3, 6, 1),
(4, 1, 1), (4, 2, 1), (4, 3, 1), (4, 4, 1), (4, 5, 1), (4, 6, 1),
(5, 1, 1), (5, 2, 1), (5, 3, 1), (5, 4, 1), (5, 5, 1), (5, 6, 1),
(6, 1, 1), (6, 2, 1), (6, 3, 1), (6, 4, 1), (6, 5, 1), (6, 6, 1),
(7, 1, 1), (7, 2, 1), (7, 3, 1), (7, 4, 1), (7, 5, 1), (7, 6, 1),
(8, 1, 1), (8, 2, 1), (8, 3, 1), (8, 4, 1), (8, 5, 1), (8, 6, 1),
(9, 1, 1), (9, 2, 1), (9, 3, 1), (9, 4, 1), (9, 5, 1), (9, 6, 1),
(10, 1, 1), (10, 2, 1), (10, 3, 1), (10, 4, 1), (10, 5, 1), (10, 6, 1),
(11, 1, 1), (11, 2, 1), (11, 3, 1), (11, 4, 1), (11, 5, 1), (11, 6, 1),
(12, 1, 1), (12, 2, 1), (12, 3, 1), (12, 4, 1), (12, 5, 1), (12, 6, 1),
(13, 1, 1), (13, 2, 1), (13, 3, 1), (13, 4, 1), (13, 5, 1), (13, 6, 1),
(14, 1, 1), (14, 2, 1), (14, 3, 1), (14, 4, 1), (14, 5, 1), (14, 6, 1),
(15, 1, 1), (15, 2, 1), (15, 3, 1), (15, 4, 1), (15, 5, 1), (15, 6, 1),
(16, 1, 1), (16, 2, 1), (16, 3, 1), (16, 4, 1), (16, 5, 1), (16, 6, 1),
(17, 1, 1), (17, 2, 1), (17, 3, 1), (17, 4, 1), (17, 5, 1), (17, 6, 1),
(18, 1, 1), (18, 2, 1), (18, 3, 1), (18, 4, 1), (18, 5, 1), (18, 6, 1),
(19, 1, 1), (19, 2, 1), (19, 3, 1), (19, 4, 1), (19, 5, 1), (19, 6, 1),
(20, 1, 1), (20, 2, 1), (20, 3, 1), (20, 4, 1), (20, 5, 1), (20, 6, 1),
(21, 1, 1), (21, 2, 1), (21, 3, 1), (21, 4, 1), (21, 5, 1), (21, 6, 1),
(22, 1, 1), (22, 2, 1), (22, 3, 1), (22, 4, 1), (22, 5, 1), (22, 6, 1);


 insert into vozila (naziv, brojSjedala, registracija, datumProizvodnje, datumZadnjeRegistracije, vrstaVozilaSifra) values 
	('140CP', 6, 'OS-140-CP', '1995-02-01', '2025-01-05', 4),
	('110CP', 10, 'OS-110-CP', '1973-01-03', '2024-07-05', 2),
	('105CP', 8, 'OS-105-CP', '2000-02-11', '2024-10-15', 2),
	('150CP', 3, 'OS-150-CP', '1990-03-01', '2024-08-09', 3),
	('120CP', 3, 'OS-120-CP', '1975-05-01', '2025-02-01', 1)
;

insert into skladiste (naziv) values ('Spremište'), ('Malo spremište 1');


insert into opremaSkladista (sifraSkladista, sifraOpreme, kolicina) values 
(1,1,5),(1,2,5),(1,3,5),(1,4,5),(1,5,5),(1,6,5),(1,9,4),(1,8,4),
(2,10,20),(2,11,20),(2,12,20),(2,13,2)
;



insert into spremnik (naziv) values 
('140 Spremnik 1'), ('140 Spremnik 2'),('140 Spremnik 3'),('140 Spremnik 4'),('140 Spremnik 5'), ('140 Spremnik 6'), ('140 Spremnik 7'),
('110 Spremnik 1'), ('110 Spremnik 1 pretinac'),('110 Spremnik 2'), ('110 Spremnik 2 pretinac'),('110 Spremnik 3'), ('110 Spremnik 3 pretinac'),('110 Spremnik 4'), ('110 Spremnik 4 pretinac'),('110 Spremnik 5'), ('110 Spremnik 5 pretinac'),
('150 Spremnik 1'),('150 Spremnik 2'),('150 Spremnik 3'), ('150 Spremnik 4'),
('120 Spremnik 1'), ('120 Spremnik 2')
;

---10 11 12

insert into opremaSpremnika (sifraSpremnika, sifraOpreme,kolicina) values
(1,10,5),(1,11,5),(1,12,5),
(2 ,2 ,2 ),(2 ,3 ,4 ),(2 ,5 ,2),
(3 ,45 ,6 ),(3 , 31, 2),(3 ,4 ,2 ),
(4 ,9 ,1 ),(4 ,25 , 1),(4 ,22 ,2 ),
(5 ,33 , 2),(5 ,35 , 2),(5 ,34 , 2),
(6 ,28 , 2),(6 ,36 , 2),(6 , 23, 2),
(7,24 , 1),(7,20 ,1 ),(7, 21, 1 ),

(8, 10,5),(8, 11,5),(8, 12,5),
(9, 45 ,5),(9, 39,5),(9, 35,2),
(10, 46,1),(10, 29,2),(10, 36,2),
(11, 27,2),(11, 14,2),(11, 18,2),
(12, 2, 3),(12, 1,2),(12, 5,3),
(13, 21,2),(13, 19,2),(13, 22,3),
(14, 31,3),(14, 32,2),(14, 34,2),
(15, 33,2),(15, 40,3),(15, 43,3),
(16, 41,2),(16, 42,2),(16, 44,1),
(17, 30,5),(17, 28,2),(17, 16,2),


(18,5,3),(18,2,2),(18,34,2),
(19,30,5),(19,19,2),(19,14,2),
(20,40,5),(20,38,3),(20,33,2),
(21,46,2),(21,29,2),(21,39,5),

(22,10,5),(22,12,5),(22,13,5),
(23,22,3),(23,21,3),(23,25,1)
;


insert into spremnikVozila (sifraVozila, sifraSpremnika) values 
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),
(4,18),(4,19),(4,20),(4,21),(5,22),(5,23)
;