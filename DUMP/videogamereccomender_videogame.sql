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
-- Table structure for table `videogame`
--

DROP TABLE IF EXISTS `videogame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videogame` (
  `game_id` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `genre_id` int DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `platform` varchar(50) NOT NULL,
  `studio_id` int DEFAULT NULL,
  `publisher` varchar(50) NOT NULL,
  PRIMARY KEY (`game_id`),
  KEY `genre_id` (`genre_id`),
  KEY `studio_id` (`studio_id`),
  CONSTRAINT `videogame_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`),
  CONSTRAINT `videogame_ibfk_2` FOREIGN KEY (`studio_id`) REFERENCES `studio` (`studio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videogame`
--

LOCK TABLES `videogame` WRITE;
/*!40000 ALTER TABLE `videogame` DISABLE KEYS */;
INSERT INTO `videogame` VALUES (1,'Assassin\'s Creed Valhalla',1,'2020-11-10','PC, PS5, Xbox',1,'Ubisoft'),(2,'Call of Duty: Modern Warfare II',1,'2022-10-28','PC, PS5, Xbox',2,'Activision Blizzard'),(3,'The Elder Scrolls V: Skyrim',3,'2011-11-11','PC, PS3, Xbox 360',3,'Bethesda Softworks'),(4,'Total War: Warhammer III',5,'2022-02-17','PC',4,'SEGA'),(5,'The Sims 4',4,'2014-09-02','PC, PS4, Xbox',5,'Electronic Arts (EA)'),(6,'Far Cry 6',1,'2021-10-07','PC, PS5, Xbox',1,'Ubisoft'),(7,'World of Warcraft',3,'2004-11-23','PC',2,'Blizzard Entertainment'),(8,'Fallout 4',3,'2015-11-10','PC, PS4, Xbox One',3,'Bethesda Softworks'),(9,'Halo Infinite',1,'2021-12-08','PC, Xbox',2,'Xbox Game Studios'),(10,'Civilization VI',5,'2016-10-21','PC, PS4, Xbox',4,'2K Games'),(11,'FIFA 23',4,'2022-09-30','PC, PS5, Xbox',5,'Electronic Arts (EA)'),(12,'Tom Clancy\'s Rainbow Six Siege',1,'2015-12-01','PC, PS4, Xbox',1,'Ubisoft'),(13,'Overwatch 2',1,'2022-10-04','PC, PS5, Xbox',2,'Blizzard Entertainment'),(14,'Starfield',3,'2023-09-06','PC, Xbox',3,'Bethesda Softworks'),(15,'Age of Empires IV',5,'2021-10-28','PC',4,'Xbox Game Studios'),(16,'SimCity 5',4,'2013-03-05','PC',5,'Electronic Arts (EA)'),(17,'Ghost Recon: Wildlands',1,'2017-03-07','PC, PS4, Xbox',1,'Ubisoft'),(18,'Diablo IV',3,'2023-06-06','PC, PS5, Xbox',2,'Blizzard Entertainment'),(19,'DOOM Eternal',1,'2020-03-20','PC, PS4, Xbox',3,'Bethesda Softworks'),(20,'Total War: Shogun 2',5,'2011-03-15','PC',4,'SEGA'),(21,'Sims 3',4,'2009-06-02','PC, Mac',5,'Electronic Arts (EA)'),(22,'Mass Effect Legendary Edition',3,'2021-05-14','PC, PS4, Xbox',5,'Electronic Arts (EA)'),(23,'Assassin\'s Creed Odyssey',1,'2018-10-05','PC, PS4, Xbox',1,'Ubisoft'),(24,'Hearthstone',5,'2014-03-11','PC, Mobile',2,'Blizzard Entertainment'),(25,'The Evil Within 2',1,'2017-10-13','PC, PS4, Xbox',3,'Bethesda Softworks'),(26,'Company of Heroes 3',5,'2023-02-23','PC, PS5, Xbox',4,'SEGA'),(27,'Dragon Age: Inquisition',3,'2014-11-18','PC, PS4, Xbox',5,'Electronic Arts (EA)'),(28,'Watch Dogs: Legion',1,'2020-10-29','PC, PS5, Xbox',1,'Ubisoft'),(29,'StarCraft II',5,'2010-07-27','PC',2,'Blizzard Entertainment'),(30,'Wolfenstein II',1,'2017-10-27','PC, PS4, Xbox',3,'Bethesda Softworks'),(31,'Football Manager 2024',4,'2023-11-06','PC',4,'SEGA'),(32,'Battlefield 2042',1,'2021-11-19','PC, PS5, Xbox',5,'Electronic Arts (EA)'),(33,'For Honor',1,'2017-02-14','PC, PS4, Xbox',1,'Ubisoft'),(34,'Heroes of the Storm',5,'2015-06-02','PC',2,'Blizzard Entertainment'),(35,'Prey',1,'2017-05-05','PC, PS4, Xbox',3,'Bethesda Softworks'),(36,'Yakuza: Like a Dragon',3,'2020-11-10','PC, PS4, Xbox',4,'SEGA'),(37,'Dead Space Remake',1,'2023-01-27','PC, PS5, Xbox',5,'Electronic Arts (EA)'),(38,'Anno 1800',4,'2019-04-16','PC',1,'Ubisoft'),(39,'Warcraft III: Reforged',5,'2020-01-28','PC',2,'Blizzard Entertainment'),(40,'Dishonored 2',1,'2016-11-11','PC, PS4, Xbox',3,'Bethesda Softworks'),(41,'Persona 5',3,'2016-09-15','PS4, PC',4,'SEGA'),(42,'Need for Speed Unbound',4,'2022-12-02','PC, PS5, Xbox',5,'Electronic Arts (EA)'),(43,'Elden Ring',3,'2022-02-25','PC, PS5, Xbox',4,'Bandai Namco'),(44,'God of War Ragnarök',1,'2022-11-09','PS4, PS5',5,'Sony Interactive'),(45,'Resident Evil 4 Remake',1,'2023-03-24','PC, PS5, Xbox',1,'Capcom'),(46,'Baldur\'s Gate 3',3,'2023-08-03','PC, PS5',2,'Larian Studios'),(47,'Final Fantasy XVI',3,'2023-06-22','PS5',3,'Square Enix'),(48,'Street Fighter 6',4,'2023-06-02','PC, PS5, Xbox',1,'Capcom'),(49,'Lies of P',1,'2023-09-19','PC, PS5, Xbox',4,'Neowiz Games'),(50,'Marvel\'s Spider-Man 2',1,'2023-10-20','PS5',5,'Sony Interactive'),(51,'Alan Wake 2',1,'2023-10-27','PC, PS5, Xbox',2,'Epic Games'),(52,'Lords of the Fallen',3,'2023-10-13','PC, PS5, Xbox',3,'CI Games'),(53,'Mortal Kombat 1',4,'2023-09-19','PC, PS5, Xbox',1,'Warner Bros'),(54,'Star Wars Jedi: Survivor',1,'2023-04-28','PC, PS5, Xbox',5,'Electronic Arts (EA)'),(55,'Hi-Fi Rush',1,'2023-01-25','PC, Xbox',3,'Bethesda Softworks'),(56,'Armored Core VI',1,'2023-08-25','PC, PS5, Xbox',4,'Bandai Namco'),(57,'Persona 3 Reload',3,'2024-02-02','PC, PS5, Xbox',4,'SEGA'),(58,'Helldivers 2',1,'2024-02-08','PC, PS5',5,'Sony Interactive'),(59,'Like a Dragon: Infinite Wealth',3,'2024-01-26','PC, PS5, Xbox',4,'SEGA'),(60,'Tekken 8',4,'2024-01-26','PC, PS5, Xbox',2,'Bandai Namco'),(61,'Prince of Persia: The Lost Crown',1,'2024-01-18','PC, PS5, Xbox, Switch',1,'Ubisoft'),(62,'Dragon\'s Dogma 2',3,'2024-03-22','PC, PS5, Xbox',1,'Capcom'),(63,'Final Fantasy VII Rebirth',3,'2024-02-29','PS5',3,'Square Enix'),(64,'Palworld',3,'2024-01-19','PC, Xbox',2,'Pocketpair'),(65,'The Last of Us Part II Remastered',1,'2024-01-19','PS5',5,'Sony Interactive'),(66,'Monster Hunter Wilds',1,'2025-01-01','PC, PS5, Xbox',1,'Capcom');
/*!40000 ALTER TABLE `videogame` ENABLE KEYS */;
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
