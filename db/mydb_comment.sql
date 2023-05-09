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
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `idcomment` int NOT NULL AUTO_INCREMENT,
  `title` mediumtext,
  `comments` longtext,
  `author` varchar(45) DEFAULT NULL,
  `restaurant` mediumtext,
  `prefer` int DEFAULT '0',
  `restaurant_id` int NOT NULL,
  `web_user_id` int NOT NULL,
  PRIMARY KEY (`idcomment`,`restaurant_id`,`web_user_id`),
  KEY `fk_comment_restaurant_idx` (`restaurant_id`),
  KEY `fk_comment_web_user1_idx` (`web_user_id`),
  CONSTRAINT `fk_comment_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`),
  CONSTRAINT `fk_comment_web_user1` FOREIGN KEY (`web_user_id`) REFERENCES `web_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (41,'긴 문장 텍스트','애국가 가사입니다.    애국가 가사 1절   동해물과 백두산이 마르고 닳도록   하느님이 보우하사 우리나라 만세   무궁화 삼천리 화려강산   대한 사람 대한으로 길이 보전하세      애국가 가사 2절   남산 위에 저 소나무 철갑을 두른 듯   바람 서리 불변함은 우리 기상일세   무궁화 삼천리 화려강산   대한 사람 대한으로 길이 보전하세     애국가 가사 3절   가을 하늘 공활한데 높고 구름 없이   밝은 달은 우리 가슴 일편단심일세   무궁화 삼천리 화려강산   대한 사람 대한으로 길이 보전하세     애국가 가사 4절   이 기상과 이 맘으로 충성을 다하여   괴로우나 즐거우나 나라 사랑하세   무궁화 삼천리 화려강산   대한 사람 대한으로 길이 보전하세     애국가 유튜브 영상입니다.','user2','청년문간',2,1000,1002),(54,'청년 문간 미쳤습니다.','양도 많고 맛있고 친절하십니당 :) 좋은 일 많이하시는 것 같아요 연탄 나눔 기부도 가능하더라구요! 신부님과 봉사자분들 감사합니다!','user1','청년문간',2,1000,1001),(55,'청록원 리뷰','볶음밥 찐맛집입니다 같이 나오는 짬뽕국물도 맛있습니다','user1','청록원',0,1005,1001),(56,'청년 문간 김치찌개','고기 추가 2000원, 라면 추가 1000원...이거 히트다!!','user5','청년문간',1,1000,1005),(57,'길이 마라탕','마라탕 국물이 일품입니다. 꿔바로우도 맛있다고 하는데 나중에 한번 먹어보겠습니다!!','user1','길이마라탕',0,1003,1001),(58,'마마우동','엄마의 손맛','user1','마마우동',0,1001,1001),(59,'청년 문간 꿀팁',' 밥 무힌리필 + 콩나물 무침 무한리필입니다. 김치찌개 가격은 아주 저렴합니다.','James','청년문간',1,1000,1004);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-10  1:56:39
