CREATE TYPE tipo AS ENUM('comum', 'chef' );

CREATE TABLE tb_usuario(
id_usuario SERIAL PRIMARY KEY,
nome VARCHAR(50) NOT NULL,
nome_usuario VARCHAR(20) NOT NULL,
email VARCHAR(150) NOT NULL,
senha INT NOT NULL,
imagem_usuario VARCHAR(255),
tipo tipo NOT NULL,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE tb_receita (
id_receita SERIAL PRIMARY KEY,
titulo_receita VARCHAR(30) NOT NULL,
origem_receita VARCHAR(100) NOT NULL,
id_usuario INT REFERENCES tb_usuario(id_usuario) NOT NULL,
url_imagem VARCHAR(255),
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE tb_favoritar(
id_favorito SERIAL PRIMARY KEY,
id_usuario INT REFERENCES tb_usuario(id_usuario) NOT NULL,
id_receita INT REFERENCES tb_receita(id_receita) NOT NULL,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITHOUT TIME ZONE
);


SELECT * FROM tb_usuario;
SELECT * FROM tb_receita;
SELECT * FROM tb_favoritar; 


INSERT INTO tb_usuario(nome, nome_usuario, email, senha, imagem_usuario,
tipo, created_at, updated_at) VALUES
('Chef Marco Bianchi', 'chef1', 'chef1@saepchef.com', 123456, 'chef1.jpg', 'chef', '2026-01-10 09:15:00', '2026-01-10 09:15:00'),
('Chef Ana Ferreira', 'chef2','chef2@saepchef.com', 123456,'chef2.jpg','chef','2026-01-12 10:30:00','2026-01-12 10:30:00'),
('Chef Lucas Tanaka', 'chef3', 'chef3@saepchef.com', 123456,'chef3.jpg','chef','2026-01-14 14:20:00','2026-01-14 14:20:00'
),
('Mariana Costa', 'usuario1', 'usuario1@gmail.com', 123456,'usuario1.jpg','comum','2026-01-16 08:45:00','2026-01-16 08:45:00'
),
('Rafael Souza', 'usuario2', 'usuario2@gmail.com', 123456,'usuario2.jpg','comum','2026-01-18 11:00:00','2026-01-18 11:00:00'
),
('Beatriz Lima', 'usuario3', 'usuario3@gmail.com', 123456,'usuario3.jpg','comum','2026-01-20 16:10:00','2026-01-20 16:10:00'
);



INSERT INTO tb_receita( titulo_receita, origem_receita, id_usuario, url_imagem, created_at, updated_at)VALUES
('Sopa de cogumelo', 'Tailândia', 1, 'receita1.jpg', '2026-07-10 08:50:00', '2026-07-10 08:50:00' ),
('Sushi', 'Japão', 3, 'receita2.jpg', '2026-07-10 16:30:00', '2026-07-10 16:30:00'),
('Feijoada', 'Brasil', 2, 'receita3.jpg', '2026-07-10 10:00:00', '2026-07-10 10:00:00'),
('Sopa de legumes', 'Índia', 2, 'receita4.jpg', '2026-07-10 01:20:00', '2026-07-10 01:20:00'),
('Gyoza', 'China', 3, 'receita5.jpg', '2026-01-14 14:20:00', '2026-01-14 14:20:00'),
('Ratatoulle', 'França', 1, 'receita6.jpg', '2026-07-10 16:30:00', '2026-07-10 16:30:00'),
('Strogonoffe', 'Russia', 3, 'receita7.jpg', '2026-07-10 08:50:00', '2026-07-10 08:50:00'),
('Pizza de burrata', 'Itália', 1, 'receita8.jpg', '2026-07-10 10:00:00', '2026-07-10 10:00:00'),
('Spaghetti aglio e olio', 'Itália', 1, 'receita8.jpg', '2026-07-10 10:00:00', '2026-07-10 10:00:00');

