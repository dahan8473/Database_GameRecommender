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
-- Table structure for table `recommendation`
--

DROP TABLE IF EXISTS `recommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendation` (
  `recommendation_id` int NOT NULL,
  `user_id` int NOT NULL,
  `game_id` int NOT NULL,
  `reason` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`recommendation_id`),
  KEY `game_id` (`game_id`),
  KEY `recommendation_ibfk_1` (`user_id`),
  CONSTRAINT `recommendation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `recommendation_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `videogame` (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendation`
--

LOCK TABLES `recommendation` WRITE;
/*!40000 ALTER TABLE `recommendation` DISABLE KEYS */;
INSERT INTO `recommendation` VALUES (6,9,18,'Recommended because you enjoyed action RPGs on PC, similar to Persona 5 - Diablo IV offers a dark fantasy setting and deep character customization, while also featuring fast-paced combat and a vast open world to explore'),(7,9,29,'Recommended because you enjoyed real-time strategy games on PC, similar to Yakuza: Like a Dragon - StarCraft II offers a similar blend of strategy and action, with a strong focus on competitive multiplayer and a rich sci-fi universe'),(8,9,40,'Recommended because you enjoyed stealth-action games on PC, similar to Yakuza: Like a Dragon - Dishonored 2 offers a similar blend of stealth, strategy, and action, with a strong focus on player choice and a richly detailed steampunk world'),(9,9,22,'Recommended because you enjoyed sci-fi RPGs on PC, similar to Persona 5 - Mass Effect Legendary Edition offers a similar blend of exploration, character customization, and engaging storytelling, set in a richly detailed sci-fi universe'),(10,9,26,'Recommended because you enjoyed real-time strategy games on PC, similar to Yakuza: Like a Dragon - Company of Heroes 3 offers a similar blend of strategy and action, with a strong focus on competitive multiplayer and a historical setting');
/*!40000 ALTER TABLE `recommendation` ENABLE KEYS */;
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
