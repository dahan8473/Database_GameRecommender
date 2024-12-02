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
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `rating_id` int NOT NULL,
  `user_id` int NOT NULL,
  `game_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `review` varchar(1000) DEFAULT NULL,
  `rating_date` date DEFAULT NULL,
  PRIMARY KEY (`rating_id`),
  KEY `game_id` (`game_id`),
  KEY `rating_ibfk_1` (`user_id`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `videogame` (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,1,3,5,'Best RPG ever made, hundreds of hours of content','2023-12-15'),(2,1,14,4,'Good game but has some bugs, typical Bethesda','2023-10-01'),(3,2,1,4,'Beautiful world design, combat could be better','2023-11-20'),(4,2,13,2,'Not as good as the original Overwatch','2023-09-15'),(7,6,5,3,'Fun but gets repetitive after a while','2023-12-10'),(8,6,11,5,'Most realistic FIFA yet!','2023-10-05'),(9,7,37,5,'Fantastic remake, stays true to the original','2023-02-28'),(10,7,41,5,'One of the best JRPGs ever made','2023-05-15'),(11,1,4,3,'Complex strategy game, steep learning curve','2023-11-01'),(12,2,28,2,'Interesting concept but feels empty','2023-08-20'),(14,6,42,4,'Great racing mechanics, love the art style','2023-12-20'),(15,7,27,5,'Amazing story and character development','2023-06-10'),(16,1,9,4,'Solid campaign, multiplayer needs work','2023-07-20'),(17,2,23,5,'Ancient Greece is beautifully realized','2023-04-15'),(19,6,36,4,'Fresh take on the Yakuza series','2023-09-01'),(20,7,40,5,'Stellar level design and powers','2023-08-05'),(21,1,24,3,'Fun card game but getting expensive','2023-10-10'),(22,2,26,4,'Great RTS with good campaigns','2023-03-20'),(24,6,31,3,'Detailed management sim but overwhelming','2023-11-10'),(25,7,22,5,'Perfect remaster of a classic trilogy','2023-07-01'),(26,1,43,5,'Masterpiece of open world design. The sense of discovery is unmatched.','2023-03-15'),(27,2,44,5,'Epic conclusion to the Norse saga. Outstanding narrative and combat.','2023-01-20'),(29,6,46,5,'Best CRPG ever made. Incredible depth and freedom of choice.','2023-09-05'),(30,7,47,1,'test','2024-12-01'),(31,1,48,4,'Excellent fighting mechanics and surprisingly good single player.','2023-06-20'),(32,2,49,4,'Unique soulslike with interesting premise and solid execution.','2023-10-01'),(34,6,51,5,'Incredible atmosphere and storytelling. Worth the 13 year wait.','2023-11-10'),(35,7,52,3,'Decent soulslike but doesn\'t quite reach its potential.','2023-10-25'),(36,1,53,4,'Great fighting game with interesting story mode.','2023-09-25'),(37,2,54,4,'Solid sequel with improved combat and exploration.','2023-05-10'),(39,6,56,4,'Complex mech combat with deep customization options.','2023-09-15'),(40,7,43,5,'Challenging but fair. The world design is breathtaking.','2023-04-01'),(41,1,46,5,'Sets new standards for choice and consequence in RPGs.','2023-08-20'),(42,2,50,4,'Great story and graphics but some technical issues.','2023-10-30'),(44,6,54,3,'Good but performance issues hold it back.','2023-05-15'),(45,7,55,5,'Fresh and innovative. Perfect mix of rhythm and action.','2023-02-01'),(46,7,38,5,'good game','2024-12-01');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
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
