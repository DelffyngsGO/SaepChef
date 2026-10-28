-- SAEPChef: script completo (estrutura + dados iniciais)
-- Rode UMA vez, em um banco "SAEPChef" vazio, pelo Query Tool do pgAdmin.
-- Ele substitui o SAEPChef.sql antigo e o migracao.sql: não precisa rodar mais nada.

BEGIN;

-- ---------------------------------------------------------------
-- Tipo enumerado usado em tb_usuario.tipo
-- ---------------------------------------------------------------
DO $$
BEGIN
    CREATE TYPE tipo AS ENUM ('comum', 'chef');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

-- ---------------------------------------------------------------
-- Tabelas (geradas pelo ERD do pgAdmin)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tb_favoritar
(
    id_favorito serial NOT NULL,
    id_usuario integer NOT NULL,
    id_receita integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    CONSTRAINT tb_favoritar_pkey PRIMARY KEY (id_favorito)
);

CREATE TABLE IF NOT EXISTS public.tb_receita
(
    id_receita serial NOT NULL,
    titulo_receita character varying(30) COLLATE pg_catalog."default" NOT NULL,
    origem_receita character varying(100) COLLATE pg_catalog."default" NOT NULL,
    id_usuario integer NOT NULL,
    url_imagem text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    tipo character varying(20) COLLATE pg_catalog."default" NOT NULL,
    ingredientes text[] COLLATE pg_catalog."default" NOT NULL DEFAULT '{}'::text[],
    preparo text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_receita_pkey PRIMARY KEY (id_receita)
);

CREATE TABLE IF NOT EXISTS public.tb_usuario
(
    id_usuario serial NOT NULL,
    nome character varying(50) COLLATE pg_catalog."default" NOT NULL,
    nome_usuario character varying(20) COLLATE pg_catalog."default" NOT NULL,
    email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    senha character varying(255) COLLATE pg_catalog."default" NOT NULL,
    imagem_usuario character varying(255) COLLATE pg_catalog."default",
    tipo tipo NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    CONSTRAINT tb_usuario_pkey PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_email UNIQUE (email)
);

-- ---------------------------------------------------------------
-- Chaves estrangeiras
-- ---------------------------------------------------------------
ALTER TABLE IF EXISTS public.tb_favoritar
    ADD CONSTRAINT tb_favoritar_id_receita_fkey FOREIGN KEY (id_receita)
    REFERENCES public.tb_receita (id_receita) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.tb_favoritar
    ADD CONSTRAINT tb_favoritar_id_usuario_fkey FOREIGN KEY (id_usuario)
    REFERENCES public.tb_usuario (id_usuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.tb_receita
    ADD CONSTRAINT tb_receita_id_usuario_fkey FOREIGN KEY (id_usuario)
    REFERENCES public.tb_usuario (id_usuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

-- ---------------------------------------------------------------
-- Dados iniciais: usuários (senha de todos: 123456)
-- ---------------------------------------------------------------
INSERT INTO public.tb_usuario (nome, nome_usuario, email, senha, imagem_usuario, tipo) VALUES
('Chef Marco Bianchi', 'chef1',    'chef1@saepchef.com',    '123456', 'chef1.jpg',    'chef'),
('Chef Ana Ferreira',  'chef2',    'chef2@saepchef.com',    '123456', 'chef2.jpg',    'chef'),
('Chef Lucas Tanaka',  'chef3',    'chef3@saepchef.com',    '123456', 'chef3.jpg',    'chef'),
('Mariana Costa',      'usuario1', 'usuario1@gmail.com',    '123456', 'usuario1.jpg', 'comum'),
('Rafael Souza',       'usuario2', 'usuario2@gmail.com',    '123456', 'usuario2.jpg', 'comum'),
('Beatriz Lima',       'usuario3', 'usuario3@gmail.com',    '123456', 'usuario3.jpg', 'comum');

-- ---------------------------------------------------------------
-- Dados iniciais: receitas
-- ---------------------------------------------------------------
INSERT INTO public.tb_receita (titulo_receita, origem_receita, id_usuario, url_imagem, tipo, ingredientes, preparo) VALUES
(
    'Sopa de cogumelo', 'Tailândia', 1, 'receita1.jpg', 'Salgado',
    ARRAY['300 g de cogumelos fatiados', '1 lata de leite de coco', '500 ml de caldo de legumes', '2 dentes de alho', 'Suco de 1 limão', 'Coentro e pimenta a gosto'],
    E'1. Refogue o alho e os cogumelos por 5 minutos.\n2. Adicione o caldo e deixe ferver por 10 minutos.\n3. Acrescente o leite de coco e o suco de limão.\n4. Sirva quente com coentro e pimenta.'
),
(
    'Sushi', 'Japão', 3, 'receita2.jpg', 'Salgado',
    ARRAY['2 xícaras de arroz japonês', '3 colheres de vinagre de arroz', '1 colher de açúcar', 'Folhas de nori', 'Salmão fresco', 'Pepino em tiras'],
    E'1. Cozinhe o arroz e tempere com vinagre e açúcar.\n2. Deixe esfriar e espalhe sobre a folha de nori.\n3. Coloque o salmão e o pepino e enrole firme.\n4. Corte em rodelas e sirva com shoyu.'
),
(
    'Feijoada', 'Brasil', 2, 'receita3.jpg', 'Salgado',
    ARRAY['500 g de feijão preto', '200 g de linguiça calabresa', '200 g de bacon', '300 g de carne seca dessalgada', '1 cebola picada', '4 dentes de alho'],
    E'1. Deixe o feijão de molho de um dia para o outro.\n2. Cozinhe o feijão com a carne seca na panela de pressão por 40 minutos.\n3. Refogue o bacon, a linguiça, a cebola e o alho e junte ao feijão.\n4. Cozinhe em fogo baixo por mais 30 minutos e sirva com arroz e couve.'
),
(
    'Sopa de legumes', 'Índia', 2, 'receita4.jpg', 'Salgado',
    ARRAY['2 batatas', '2 cenouras', '1 abobrinha', '1 cebola', '1 colher de curry', '1 litro de água'],
    E'1. Refogue a cebola com o curry.\n2. Adicione os legumes picados e a água.\n3. Cozinhe por 25 minutos até ficarem macios.\n4. Tempere com sal e sirva.'
),
(
    'Gyoza', 'China', 3, 'receita5.jpg', 'Salgado',
    ARRAY['1 pacote de massa de gyoza', '300 g de carne de porco moída', '2 folhas de repolho picadas', '1 colher de gengibre ralado', '2 colheres de shoyu', 'Óleo de gergelim'],
    E'1. Misture a carne, o repolho, o gengibre e o shoyu.\n2. Recheie as massas e feche com as bordas dobradas.\n3. Doure os gyozas em uma frigideira com óleo.\n4. Adicione um pouco de água, tampe e cozinhe por 5 minutos.'
),
(
    'Ratatouille', 'França', 1, 'receita6.jpg', 'Salgado',
    ARRAY['1 berinjela', '2 abobrinhas', '3 tomates', '1 pimentão vermelho', '1 cebola', 'Ervas de Provence', 'Azeite'],
    E'1. Corte todos os legumes em rodelas finas.\n2. Cubra o fundo de uma forma com molho de tomate e cebola refogada.\n3. Disponha os legumes em círculos, regue com azeite e salpique as ervas.\n4. Asse coberto a 180 °C por 45 minutos.'
),
(
    'Strogonoffe', 'Rússia', 3, 'receita7.jpg', 'Salgado',
    ARRAY['500 g de carne em tiras', '1 cebola picada', '200 g de champignon', '1 colher de extrato de tomate', '1 caixa de creme de leite', 'Mostarda e ketchup'],
    E'1. Doure a carne com a cebola.\n2. Junte o champignon, o extrato de tomate, a mostarda e o ketchup.\n3. Cozinhe por 10 minutos.\n4. Desligue o fogo, misture o creme de leite e sirva com arroz e batata palha.'
),
(
    'Pizza de burrata', 'Itália', 1, 'receita8.jpg', 'Salgado',
    ARRAY['1 massa de pizza', '1/2 xícara de molho de tomate', '1 burrata', 'Tomates-cereja', 'Manjericão fresco', 'Azeite'],
    E'1. Abra a massa e cubra com o molho de tomate.\n2. Asse em forno bem quente por 12 minutos.\n3. Retire do forno e acrescente a burrata rasgada e os tomates-cereja.\n4. Finalize com manjericão e um fio de azeite.'
),
(
    'Spaghetti aglio e olio', 'Itália', 1, 'receita9.jpg', 'Salgado',
    ARRAY['400 g de espaguete', '6 dentes de alho fatiados', '1/2 xícara de azeite', 'Pimenta calabresa', 'Salsinha picada', 'Sal'],
    E'1. Cozinhe o espaguete em água com sal até ficar al dente.\n2. Aqueça o azeite e doure o alho com a pimenta, sem queimar.\n3. Misture o macarrão ao azeite com um pouco da água do cozimento.\n4. Finalize com salsinha.'
),
(
    'Brigadeiro', 'Brasil', 2, NULL, 'Doce',
    ARRAY['1 lata de leite condensado', '2 colheres de chocolate em pó', '1 colher de manteiga', 'Granulado para enrolar'],
    E'1. Misture o leite condensado, o chocolate e a manteiga em uma panela.\n2. Cozinhe em fogo baixo, mexendo sempre, até desgrudar do fundo.\n3. Deixe esfriar, enrole em bolinhas e passe no granulado.'
),
(
    'Frango agridoce', 'China', 3, NULL, 'Agridoce',
    ARRAY['500 g de peito de frango em cubos', '1 pimentão cortado', '1/2 abacaxi em pedaços', '4 colheres de ketchup', '2 colheres de vinagre', '2 colheres de açúcar', '2 colheres de shoyu'],
    E'1. Doure o frango em uma frigideira.\n2. Misture o ketchup, o vinagre, o açúcar e o shoyu para fazer o molho.\n3. Junte o pimentão, o abacaxi e o molho ao frango.\n4. Cozinhe por 8 minutos e sirva com arroz.'
);

END;

-- Conferir os dados
SELECT id_usuario, nome, email, tipo FROM tb_usuario;
SELECT id_receita, titulo_receita, tipo, id_usuario FROM tb_receita;