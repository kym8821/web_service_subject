-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` mediumtext,
  `price` int DEFAULT NULL,
  `remain` int DEFAULT '0',
  `comment` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (6,'movie1',1000,100,'detail about movie'),(7,'movie2',1500,100,'서러운 맘을 못 이겨\n잠 못 들던 어둔 밤을\n또 견디고\n내 절망관 상관없이\n무심하게도 아침은\n날 깨우네\n상처는 생각보다 쓰리고\n아픔은 생각보다 깊어가\n널 원망하던 수많은 밤이\n내겐 지옥같아\n내 곁에 있어줘\n내게 머물러줘\n네 손을 잡은\n날 놓치지 말아줘\n이렇게 니가 한걸음\n멀어지면\n내가 한걸음\n더 가면 되잖아\n하루에도 수천번씩\n니 모습을 되뇌이고\n생각했어\n내게 했던 모진 말들\n그 싸늘한 눈빛\n차가운 표정들\n넌 참 예쁜 사람 이었잖아\n넌 참 예쁜 사람 이었잖아\n제발 내게 이러지 말아줘\n넌 날 잘 알잖아\n내 곁에 있어줘\n내게 머물러줘\n네 손을 잡은 날\n놓치지 말아줘\n이렇게 니가 한걸음\n멀어지면\n내가 한걸음\n더 가면 되잖아\n내겐 내가 없어 난\n자신이 없어\n니가 없는 하루\n견딜 수가 없어\n이젠 뭘 어떻게 해야 할지\n모르겠어 니가 없는 난\n그냥 날 안아줘\n나를 좀 안아줘\n아무 말 말고서\n내게 달려와줘\n외롭고 불안하기만\n한 맘으로\n이렇게 널 기다리고 있잖아\n난 너를 사랑해 난\n너를 사랑해\n긴 침묵 속에서 소리\n내 외칠게\n어리석고 나약하기만 한\n내 마음을'),(8,'movie3',1200,100,'detail about movie3'),(9,'movie4',1200,100,'detail about movie4'),(10,'movie5',1200,100,'detail about movie5'),(11,'movie6',1200,100,'detail about movie6');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-10  1:56:42
