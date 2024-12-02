-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: videogamereccomender
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `studio`
--

DROP TABLE IF EXISTS `studio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studio` (
  `studio_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `head_location` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`studio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studio`
--

LOCK TABLES `studio` WRITE;
/*!40000 ALTER TABLE `studio` DISABLE KEYS */;
INSERT INTO `studio` VALUES (1,'Ubisoft','Lake Raymondside','Address me population knowledge remember wonder front American need.'),(2,'Activision Blizzard','North Jasonfurt','Strong relationship see cup Mr rock newspaper Republican light responsibility painting.'),(3,'Bethesda Softworks','Bullockchester','Finish son everyone keep past tree meet.'),(4,'Creative Assembly','Khanport','Return compare movie some research scientist military camera involve paper several audience.'),(5,'Maxis','South Lynnmouth','Data half yourself center believe culture.'),(6,'Blizzard Entertainment','Benjaminhaven','Different TV north itself major end natural deep.'),(7,'Rockstar Games','Silvaton','Challenge hold although service all radio son probably contain camera professor mean prove.'),(8,'NetherRealm Studios','Hallshire','Congress approach against too plan baby exactly recently.'),(9,'Infinity Ward','Charlesland','Concern decide above reach fill whole environment participant wife.'),(10,'Codemasters','West Stephen','Cell inside quickly director myself color year garden responsibility office.'),(11,'Paradox Interactive','Michaelhaven','Budget pull development test early impact woman.'),(12,'Frictional Games','Timothyland','Daughter short author tree radio summer glass government determine term home effect machine throughout.'),(13,'Capcom','Ethanchester','Education attorney wind include wall property push item language program record.'),(14,'Bloober Team','East Rachel','Relationship score per country this early sister stand deal.'),(15,'Respawn Entertainment','New Julie','Find bank court part unit face certain but north action six level factor take.'),(16,'Firaxis Games','Youngmouth','Financial team event strategy growth process particular expect great particularly write.'),(17,'Mojang Studios','Camachoview','Tonight fine oil region nothing security fast customer study young simply leg.'),(18,'Polyphony Digital','Loweshire','Team good significant guess stay detail notice material such know share administration outside.'),(19,'Konami','Carrollside','May outside doctor beat bank explain feeling perform.'),(20,'Sony Interactive Entertainment','East Marthachester','Like natural grow true mind throw probably trial model democratic.'),(21,'SNK','Leeborough','Care easy street hear difference challenge task positive yes his follow.'),(22,'Nitroplus','Letown','Book different plan hope part form my choice fly cause.'),(23,'Kojima Productions','Morrisville','Moment article allow chair door structure radio late information.'),(24,'Frontier Developments','Port Jasonton','Letter city manager business walk major every against item white body politics Congress.'),(25,'Criterion Games','Lake Jason','Range cultural whose blue house enter.'),(26,'Bioware','Ashleyfurt','Rule gun nice top decision north feel evening bank significant experience.'),(27,'CD Projekt','Aaronville','Democrat teach early TV likely impact short fall beyond.'),(28,'Klei Entertainment','Quinnborough','Relate or describe water number note oil picture history environment his set.'),(29,'Square Enix','Port Robertstad','Every throw around class yes trip president think.'),(30,'Electronic Arts','West Janice','Occur soldier tonight fly what together true law realize middle great.'),(31,'PopCap Games','New Raymond','Nice despite protect fact impact nice there especially wrong.'),(32,'Bungie','Lake Michael','Manage treat likely stop way left room history edge other.'),(33,'Epic Games','Floydside','Program behind game hair different dinner keep indeed industry simple sort especially let.'),(34,'Daybreak Game Company','Whiteview','Herself go alone speech tax avoid off court act top.'),(35,'Harmonix','East Alexisbury','Hospital what early even month customer level chance than actually save several.'),(36,'Nintendo','Randyfurt','Side form my personal quality Mr past situation.'),(37,'2K Sports','Lake Patriciafurt','Any perform time during age race lead responsibility politics.'),(38,'IO Interactive','North Tiffanyberg','Discussion season style yet leave member occur form type hear true practice and.'),(39,'Spike Chunsoft','New Katie','Stuff hard green effect someone exist kind loss.'),(40,'Sega','East Michael','Whose environmental bed along address spend their suggest security throw.');
/*!40000 ALTER TABLE `studio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-01 19:59:22
