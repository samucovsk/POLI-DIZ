-- MySQL dump 10.13  Distrib 8.0.15-5, for Linux (x86_64)
--
-- Host: localhost    Database: btjdya5hsncgmmwcxqik
-- ------------------------------------------------------
-- Server version	8.0.15-5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!50717 SELECT COUNT(*) INTO @rocksdb_has_p_s_session_variables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'performance_schema' AND TABLE_NAME = 'session_variables' */;
/*!50717 SET @rocksdb_get_is_supported = IF (@rocksdb_has_p_s_session_variables, 'SELECT COUNT(*) INTO @rocksdb_is_supported FROM performance_schema.session_variables WHERE VARIABLE_NAME=\'rocksdb_bulk_load\'', 'SELECT 0') */;
/*!50717 PREPARE s FROM @rocksdb_get_is_supported */;
/*!50717 EXECUTE s */;
/*!50717 DEALLOCATE PREPARE s */;
/*!50717 SET @rocksdb_enable_bulk_load = IF (@rocksdb_is_supported, 'SET SESSION rocksdb_bulk_load = 1', 'SET @rocksdb_dummy_bulk_load = 0') */;
/*!50717 PREPARE s FROM @rocksdb_enable_bulk_load */;
/*!50717 EXECUTE s */;
/*!50717 DEALLOCATE PREPARE s */;

--
-- Table structure for table `Eleitos`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Eleitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE btjdya5hsncgmmwcxqik.`Eleitos` (
  `idEleitos` int NOT NULL,
  `cargoEleitos` varchar(45) DEFAULT NULL,
  `ini_mandEleitos` varchar(45) DEFAULT NULL,
  `fim_mandEleitos` varchar(45) DEFAULT NULL,
  `Politicos_idPoliticos` int NOT NULL,
  PRIMARY KEY (`idEleitos`),
  KEY `fk_Eleitos_Politicos1_idx` (`Politicos_idPoliticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Eleitos`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Eleitos` WRITE;
/*!40000 ALTER TABLE `Eleitos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Eleitos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Lives`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Lives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Lives` (
  `idLives` int NOT NULL AUTO_INCREMENT,
  `Politicos_idPoliticos` int NOT NULL,
  `dataLive` varchar(45) DEFAULT NULL,
  `horaInicioLive` varchar(45) DEFAULT NULL,
  `horaFinalLive` varchar(45) DEFAULT NULL,
  `tituloLive` varchar(45) DEFAULT NULL,
  `assuntoLive` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idLives`),
  KEY `fk_Lives_Politicos1_idx` (`Politicos_idPoliticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Lives`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Lives` WRITE;
/*!40000 ALTER TABLE `Lives` DISABLE KEYS */;
/*!40000 ALTER TABLE `Lives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Politicos`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Politicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Politicos` (
  `idPoliticos` int NOT NULL AUTO_INCREMENT,
  `nomePoliticos` varchar(45) DEFAULT NULL,
  `perfilPoliticos` varchar(45) DEFAULT NULL,
  `senhaPoliticos` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `cidadePoliticos` varchar(45) DEFAULT NULL,
  `ufPoliticos` char(2) DEFAULT NULL,
  `dataNascPoliticos` date DEFAULT NULL,
  `contatoPoliticos` varchar(255) NOT NULL,
  `descPoliticos` varchar(255) NOT NULL DEFAULT 'Usuário sem biografia.',
  `fotoPerfilPoliticos` varchar(255) NOT NULL DEFAULT 'fotoPerfilPadrao.jpg',
  `bannerPoliticos` varchar(255) NOT NULL DEFAULT 'bannerPadrao.jpg',
  `candidaturaPoliticos` varchar(255) NOT NULL DEFAULT 'Candidatura não definida',
  `status_politico` tinyint(1) NOT NULL DEFAULT 0,
  `linkReuniao` varchar(255) NULL,
  `dataExpiracaoReuniao` datetime NULL, 
  PRIMARY KEY (`idPoliticos`),
  UNIQUE KEY `idCandidatos_UNIQUE` (`idPoliticos`),
  UNIQUE KEY `perfilCandidato_UNIQUE` (`perfilPoliticos`),
  UNIQUE KEY `contatoCandidato_UNIQUE` (`contatoPoliticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Politicos`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Politicos` WRITE;
/*!40000 ALTER TABLE `Politicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Politicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Politicos_has_partidos`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Politicos_has_partidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Politicos_has_partidos` (
  `Politicos_idPoliticos` int NOT NULL,
  `partidos_idPartido` int NOT NULL,
  `ini_filiacao` varchar(45) DEFAULT NULL,
  `fim_filiacao` varchar(45) DEFAULT NULL,
  `nomePartido` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Politicos_idPoliticos`,`partidos_idPartido`),
  KEY `fk_Politicos_has_partidos_partidos1_idx` (`partidos_idPartido`),
  KEY `fk_Politicos_has_partidos_Politicos1_idx` (`Politicos_idPoliticos`),
  CONSTRAINT `fk_Politicos_has_partidos_Politicos1` FOREIGN KEY (`Politicos_idPoliticos`) REFERENCES `Politicos` (`idPoliticos`),
  CONSTRAINT `fk_Politicos_has_partidos_partidos1` FOREIGN KEY (`partidos_idPartido`) REFERENCES `partidos` (`idPartido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Politicos_has_partidos`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Politicos_has_partidos` WRITE;
/*!40000 ALTER TABLE `Politicos_has_partidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Politicos_has_partidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Postagem`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Postagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Postagem` (
  `idPostagem` int NOT NULL AUTO_INCREMENT,
  `data_postagem` varchar(45) DEFAULT NULL,
  `Postagem` text,
  `Politicos_idPoliticos` int(11) NOT NULL,
  `Titulo_postagem` varchar(150) DEFAULT NULL,
  `Imagem_postagem1` varchar(45) DEFAULT NULL,
  `Imagem_postagem2` varchar(45) DEFAULT NULL,
  `Imagem_postagem3` varchar(45) DEFAULT NULL,
  `Imagem_postagem4` varchar(45) DEFAULT NULL,
  `Imagem_postagem5` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idPostagem`),
  KEY `fk_Postagem_Politicos1_idx` (`Politicos_idPoliticos`),
  CONSTRAINT `fk_Postagem_Politicos1` FOREIGN KEY (`Politicos_idPoliticos`) REFERENCES `Politicos` (`idPoliticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Postagem`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Postagem` WRITE;
/*!40000 ALTER TABLE `Postagem` DISABLE KEYS */;
/*!40000 ALTER TABLE `Postagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Propostas`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Propostas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Propostas` (
  `idPropostasEleito` int NOT NULL,
  `tituloPropEleito` varchar(45) DEFAULT NULL,
  `statusPropEleito` varchar(45) DEFAULT NULL,
  `dataPropEleito` varchar(45) DEFAULT NULL,
  `descricaoPropEleito` varchar(45) DEFAULT NULL,
  `Politicos_idPoliticos` int(11) NOT NULL,
  PRIMARY KEY (`idPropostasEleito`),
  UNIQUE KEY `idProjetosEleito_UNIQUE` (`idPropostasEleito`),
  KEY `fk_Propostas_eleitos_Politicos1_idx` (`Politicos_idPoliticos`),
  CONSTRAINT `fk_Propostas_eleitos_Politicos1` FOREIGN KEY (`Politicos_idPoliticos`) REFERENCES `Politicos` (`idPoliticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Propostas`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Propostas` WRITE;
/*!40000 ALTER TABLE `Propostas` DISABLE KEYS */;
/*!40000 ALTER TABLE `Propostas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seguindo`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Seguindo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Seguindo` (
  `Politicos_idPoliticos` int NOT NULL,
  `Usuario_idUsuario` int NOT NULL,
  `Data_inicio_seguindo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Politicos_idPoliticos`,`Usuario_idUsuario`),
  KEY `fk_Politicos_has_Usuario_Usuario1_idx` (`Usuario_idUsuario`),
  KEY `fk_Politicos_has_Usuario_Politicos1_idx` (`Politicos_idPoliticos`),
  CONSTRAINT `fk_Politicos_has_Usuario_Politicos1` FOREIGN KEY (`Politicos_idPoliticos`) REFERENCES `Politicos` (`idPoliticos`),
  CONSTRAINT `fk_Politicos_has_Usuario_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `Usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seguindo`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Seguindo` WRITE;
/*!40000 ALTER TABLE `Seguindo` DISABLE KEYS */;
/*!40000 ALTER TABLE `Seguindo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `cidadeUsuario` varchar(45) DEFAULT NULL,
  `numUsuario` varchar(45) DEFAULT NULL,
  `complementoUsuario` varchar(45) DEFAULT NULL,
  `endereçoUsuario` varchar(45) DEFAULT NULL,
  `nomeUsuario` varchar(45) DEFAULT NULL,
  `dataNascUsuario` date DEFAULT NULL,
  `emailUsuario` varchar(45) DEFAULT NULL,
  `CPFUsuario` char(11) DEFAULT NULL,
  `TelefoneUsuario` char(11) DEFAULT NULL,
  `SenhaUsuario` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `descUsuario` varchar(255) NOT NULL DEFAULT 'Usuário sem biografia.',
  `fotoPerfilUsuario` varchar(255) NOT NULL DEFAULT 'fotoPerfilPadrao.jpg',
  `bannerUsuario` varchar(255) NOT NULL DEFAULT 'bannerPadrao.jpg',
  `status_usuario` tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario_curte_postagem`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`Usuario_curte_postagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Usuario_curte_postagem` (
  `Usuario_idUsuario` int NOT NULL,
  `Postagem_idPostagem` int NOT NULL,
  `Data_curtida` date DEFAULT NULL,
  `Usuario_curte_postagem` varchar(45) DEFAULT NULL,
  KEY `fk_Usuario_has_Postagem_Postagem1_idx` (`Postagem_idPostagem`),
  KEY `fk_Usuario_has_Postagem_Usuario1_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_Usuario_has_Postagem_Postagem1` FOREIGN KEY (`Postagem_idPostagem`) REFERENCES `Postagem` (`idPostagem`),
  CONSTRAINT `fk_Usuario_has_Postagem_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `Usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario_curte_postagem`
--

LOCK TABLES `Usuario_curte_postagem` WRITE;
/*!40000 ALTER TABLE `Usuario_curte_postagem` DISABLE KEYS */;
/*!40000 ALTER TABLE `Usuario_curte_postagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagem`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`mensagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `mensagem` (
  `idmensagem` int NOT NULL AUTO_INCREMENT,
  `data_msg` date DEFAULT NULL,
  `mensagem` varchar(255) DEFAULT NULL,
  `Usuario_idUsuario` int NOT NULL,
  `Politicos_idPoliticos` int NOT NULL,
  `resposta_idresposta` int NOT NULL,
  `resposta_id_respondente` int NOT NULL,
  PRIMARY KEY (`idmensagem`),
  KEY `fk_mensagem_Usuario1_idx` (`Usuario_idUsuario`),
  KEY `fk_mensagem_Politicos1_idx` (`Politicos_idPoliticos`),
  KEY `fk_mensagem_resposta1_idx` (`resposta_idresposta`,`resposta_id_respondente`),
  CONSTRAINT `fk_mensagem_Politicos1` FOREIGN KEY (`Politicos_idPoliticos`) REFERENCES `Politicos` (`idPoliticos`),
  CONSTRAINT `fk_mensagem_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `Usuario` (`idUsuario`),
  CONSTRAINT `fk_mensagem_resposta1` FOREIGN KEY (`resposta_idresposta`, `resposta_id_respondente`) REFERENCES `resposta` (`idresposta`, `id_respondente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagem`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`mensagem` WRITE;
/*!40000 ALTER TABLE `mensagem` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`partidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `partidos` (
  `idPartido` int NOT NULL AUTO_INCREMENT,
  `nomePartido` varchar(45) DEFAULT NULL,
  `Eleitos_idEleito` int NOT NULL,
  PRIMARY KEY (`idPartido`),
  UNIQUE KEY `idPartido_UNIQUE` (`idPartido`),
  UNIQUE KEY `nomePartido_UNIQUE` (`nomePartido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`partidos` WRITE;
/*!40000 ALTER TABLE `partidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projetos_Politicos`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`projetos_Politicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `projetos_Politicos` (
  `idProjPoliticos` int NOT NULL AUTO_INCREMENT,
  `descricaoProjPoliticos` varchar(255) NOT NULL,
  `dataProjPoliticos` date DEFAULT NULL,
  `statusProjPoliticos` varchar(45) DEFAULT NULL,
  `tituloProjPoliticos` varchar(45) DEFAULT NULL,
  `Eleitos_idEleitos` int(11) NOT NULL,
  PRIMARY KEY (`idProjPoliticos`),
  KEY `fk_projetosPoliticos_Eleitos1_idx` (`Eleitos_idEleitos`),
  CONSTRAINT `fk_projetosPoliticos_Eleitos1` FOREIGN KEY (`Eleitos_idEleitos`) REFERENCES `Eleitos` (`idEleitos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projetos_Politicos`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`projetos_Politicos` WRITE;
/*!40000 ALTER TABLE `projetos_Politicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `projetos_Politicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resposta`
--

DROP TABLE IF EXISTS btjdya5hsncgmmwcxqik.`resposta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE btjdya5hsncgmmwcxqik.`resposta` (
  `idresposta` int NOT NULL AUTO_INCREMENT,
  `id_respondente` int NOT NULL,
  `tipo_respondente` int DEFAULT NULL,
  `resposta` varchar(255) DEFAULT NULL,
  `data_resposta` date DEFAULT NULL,
  `Politicos_idPoliticos` int NOT NULL,
  PRIMARY KEY (`idresposta`,`id_respondente`),
  KEY `fk_resposta_Politicos1_idx` (`Politicos_idPoliticos`),
  CONSTRAINT `fk_resposta_Politicos1` FOREIGN KEY (`Politicos_idPoliticos`) REFERENCES `Politicos` (`idPoliticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resposta`
--

LOCK TABLES btjdya5hsncgmmwcxqik.`resposta` WRITE;
/*!40000 ALTER TABLE `resposta` DISABLE KEYS */;
/*!40000 ALTER TABLE `resposta` ENABLE KEYS */;
UNLOCK TABLES;
/*!50112 SET @disable_bulk_load = IF (@is_rocksdb_supported, 'SET SESSION rocksdb_bulk_load = @old_rocksdb_bulk_load', 'SET @dummy_rocksdb_bulk_load = 0') */;
/*!50112 PREPARE s FROM @disable_bulk_load */;
/*!50112 EXECUTE s */;
/*!50112 DEALLOCATE PREPARE s */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-15 13:40:03
