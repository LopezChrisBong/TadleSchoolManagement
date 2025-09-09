-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: tadle_school_management
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `add_strand`
--

DROP TABLE IF EXISTS `add_strand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `add_strand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strand_name` varchar(255) NOT NULL,
  `trackId` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `add_strand`
--

LOCK TABLES `add_strand` WRITE;
/*!40000 ALTER TABLE `add_strand` DISABLE KEYS */;
INSERT INTO `add_strand` VALUES (1,'HUMMS','2','2024-12-06 11:07:08.519567','2024-12-06 11:07:08.519567'),(2,'FBS','1','2024-12-06 11:07:37.366718','2024-12-06 11:07:37.366718'),(3,'GAS','2','2025-08-11 14:36:23.176767','2025-08-11 22:13:17.000000');
/*!40000 ALTER TABLE `add_strand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `add_tracks`
--

DROP TABLE IF EXISTS `add_tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `add_tracks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tracks_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `add_tracks`
--

LOCK TABLES `add_tracks` WRITE;
/*!40000 ALTER TABLE `add_tracks` DISABLE KEYS */;
INSERT INTO `add_tracks` VALUES (1,'TVL','2024-12-06 11:06:45.059260','2025-08-11 14:13:36.000000'),(2,'ACADEMIC','2024-12-06 11:06:55.967067','2025-08-11 14:13:48.000000');
/*!40000 ALTER TABLE `add_tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assigned_module`
--

DROP TABLE IF EXISTS `assigned_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `selected_modules` text NOT NULL,
  `assign_mods` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e029475bec50243bf748359082` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_module`
--

LOCK TABLES `assigned_module` WRITE;
/*!40000 ALTER TABLE `assigned_module` DISABLE KEYS */;
INSERT INTO `assigned_module` VALUES (1,'Admin Default','2023-05-23 15:53:16.339189','2025-09-02 15:47:48.000000','[13,14,113,108,107,112,61,105,106,103,104,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":113,\"title\":\"Faculty List\",\"icon\":\"mdi-account-file\",\"route\":\"/faculty-list\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-02T07:47:38.285Z\",\"updatedAt\":\"2025-09-02T07:47:38.285Z\"},{\"id\":108,\"title\":\"Faculty Schedule\",\"icon\":\"mdi-list-status\",\"route\":\"/faculty-schedule\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T02:34:16.467Z\",\"updatedAt\":\"2024-12-04T02:34:16.467Z\"},{\"id\":107,\"title\":\"Classroom Program\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/classroom-programm\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-03T00:17:03.997Z\",\"updatedAt\":\"2025-08-11T13:56:07.000Z\"},{\"id\":112,\"title\":\"Transmuted Grade\",\"icon\":\"mdi-file-document-refresh-outline\",\"route\":\"/transmuted-grade\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2025-08-27T01:05:26.240Z\",\"updatedAt\":\"2025-08-27T01:05:26.240Z\"},{\"id\":61,\"title\":\"School Year\",\"icon\":\"mdi-square-edit-outline\",\"route\":\"/add-school-year\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2023-10-12T01:11:41.906Z\",\"updatedAt\":\"2025-08-11T07:37:14.000Z\"},{\"id\":105,\"title\":\"Tracks\",\"icon\":\"mdi-file-chart\",\"route\":\"/add-tracks\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-30T02:37:31.058Z\",\"updatedAt\":\"2025-08-11T13:57:29.000Z\"},{\"id\":106,\"title\":\"Strand\",\"icon\":\"mdi-file-code\",\"route\":\"/add-strands\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-30T05:33:44.978Z\",\"updatedAt\":\"2025-08-11T13:58:21.000Z\"},{\"id\":103,\"title\":\"Subjects\",\"icon\":\"mdi-file-compare\",\"route\":\"/create-subject\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T07:17:28.067Z\",\"updatedAt\":\"2025-08-11T13:59:18.000Z\"},{\"id\":104,\"title\":\"Rooms\",\"icon\":\"mdi-google-classroom\",\"route\":\"/high-school-rooms\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T15:07:14.841Z\",\"updatedAt\":\"2025-08-11T05:49:39.000Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]'),(2,'Teacher','2023-05-22 10:38:21.180318','2025-09-06 13:48:50.000000','[13,109,111,115,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":109,\"title\":\"My Schedule\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/my-scheduled-program\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T03:03:22.365Z\",\"updatedAt\":\"2024-12-04T03:03:22.365Z\"},{\"id\":111,\"title\":\"My Student Record\",\"icon\":\"mdi-book-account\",\"route\":\"/students-records\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-08-12T15:02:53.010Z\",\"updatedAt\":\"2025-08-12T15:02:53.010Z\"},{\"id\":115,\"title\":\"Prefect Records\",\"icon\":\"mdi-human-male-child\",\"route\":\"/student-discipline\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-06T05:47:41.289Z\",\"updatedAt\":\"2025-09-06T05:47:41.289Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]'),(4,'Superadmin','2023-05-22 10:40:40.474410','2025-08-11 13:22:34.000000','[13,14,42,35,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":42,\"title\":\"List\",\"icon\":\"mdi-text-box-outline\",\"route\":\"/modules-list\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-22T02:24:21.250Z\",\"updatedAt\":\"2023-05-22T04:00:28.769Z\"},{\"id\":35,\"title\":\"User Modules\",\"icon\":\"mdi-animation-outline\",\"route\":\"/user-modules\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.384Z\",\"updatedAt\":\"2023-05-22T04:00:28.765Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]'),(21,'Adviser','2025-08-12 16:57:09.990173','2025-09-06 21:28:41.000000','[13,109,102,101,111,107,115,110,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":109,\"title\":\"My Schedule\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/my-scheduled-program\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T03:03:22.365Z\",\"updatedAt\":\"2024-12-04T03:03:22.365Z\"},{\"id\":102,\"title\":\"Verify Student\",\"icon\":\"mdi-account-reactivate\",\"route\":\"/student_verify\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2024-11-29T02:27:05.567Z\",\"updatedAt\":\"2024-11-29T02:27:05.567Z\"},{\"id\":101,\"title\":\"Enroll Student\",\"icon\":\"mdi-email-fast\",\"route\":\"/enroll-student\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2024-11-29T02:25:49.119Z\",\"updatedAt\":\"2024-11-29T02:25:49.119Z\"},{\"id\":111,\"title\":\"My Student Record\",\"icon\":\"mdi-book-account\",\"route\":\"/students-records\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-08-12T15:02:53.010Z\",\"updatedAt\":\"2025-08-12T15:02:53.010Z\"},{\"id\":107,\"title\":\"Classroom Program\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/classroom-programm\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-03T00:17:03.997Z\",\"updatedAt\":\"2025-08-11T13:56:07.000Z\"},{\"id\":115,\"title\":\"Prefect Records\",\"icon\":\"mdi-human-male-child\",\"route\":\"/student-discipline\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-06T05:47:41.289Z\",\"updatedAt\":\"2025-09-06T05:47:41.289Z\"},{\"id\":110,\"title\":\"Advisory\",\"icon\":\"mdi-account-file-text\",\"route\":\"/advisory-rooms\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-08-12T10:57:06.700Z\",\"updatedAt\":\"2025-08-12T10:57:06.700Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-18T01:23:00.755Z\"}]'),(22,'Parents','2025-08-18 16:21:24.742816','2025-09-06 13:44:09.000000','[13,101,114,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":101,\"title\":\"Enroll Student\",\"icon\":\"mdi-email-fast\",\"route\":\"/enroll-student\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2024-11-29T02:25:49.119Z\",\"updatedAt\":\"2024-11-29T02:25:49.119Z\"},{\"id\":114,\"title\":\"My Children\",\"icon\":\"mdi-human-male-female-child\",\"route\":\"/parent-children\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-06T05:43:48.699Z\",\"updatedAt\":\"2025-09-06T05:43:48.699Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-18T01:23:00.755Z\"}]'),(23,'Prefect of Discipline','2025-09-08 22:04:00.417904','2025-09-08 22:37:11.000000','[13,109,111,115,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":109,\"title\":\"My Schedule\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/my-scheduled-program\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T03:03:22.365Z\",\"updatedAt\":\"2024-12-04T03:03:22.365Z\"},{\"id\":111,\"title\":\"My Student Record\",\"icon\":\"mdi-book-account\",\"route\":\"/students-records\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-08-12T15:02:53.010Z\",\"updatedAt\":\"2025-08-12T15:02:53.010Z\"},{\"id\":115,\"title\":\"Prefect Records\",\"icon\":\"mdi-human-male-child\",\"route\":\"/student-discipline\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-06T05:47:41.289Z\",\"updatedAt\":\"2025-09-06T05:47:41.289Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-18T01:23:00.755Z\"}]'),(24,'Prefect && Adviser','2025-09-09 09:54:03.539500','2025-09-09 09:54:03.539500','[13,109,101,102,107,111,115,110,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":109,\"title\":\"My Schedule\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/my-scheduled-program\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T03:03:22.365Z\",\"updatedAt\":\"2024-12-04T03:03:22.365Z\"},{\"id\":101,\"title\":\"Enroll Student\",\"icon\":\"mdi-email-fast\",\"route\":\"/enroll-student\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2024-11-29T02:25:49.119Z\",\"updatedAt\":\"2024-11-29T02:25:49.119Z\"},{\"id\":102,\"title\":\"Verify Student\",\"icon\":\"mdi-account-reactivate\",\"route\":\"/student_verify\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2024-11-29T02:27:05.567Z\",\"updatedAt\":\"2024-11-29T02:27:05.567Z\"},{\"id\":107,\"title\":\"Classroom Program\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/classroom-programm\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-03T00:17:03.997Z\",\"updatedAt\":\"2025-08-11T13:56:07.000Z\"},{\"id\":111,\"title\":\"My Student Record\",\"icon\":\"mdi-book-account\",\"route\":\"/students-records\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-08-12T15:02:53.010Z\",\"updatedAt\":\"2025-08-12T15:02:53.010Z\"},{\"id\":115,\"title\":\"Prefect Records\",\"icon\":\"mdi-human-male-child\",\"route\":\"/student-discipline\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-06T05:47:41.289Z\",\"updatedAt\":\"2025-09-06T05:47:41.289Z\"},{\"id\":110,\"title\":\"Advisory\",\"icon\":\"mdi-account-file-text\",\"route\":\"/advisory-rooms\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-08-12T10:57:06.700Z\",\"updatedAt\":\"2025-08-12T10:57:06.700Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-18T01:23:00.755Z\"}]');
/*!40000 ALTER TABLE `assigned_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `at_risk_student_for_faculty_notification`
--

DROP TABLE IF EXISTS `at_risk_student_for_faculty_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `at_risk_student_for_faculty_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` int NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `teacherID` int NOT NULL,
  `transmuted_grade` int NOT NULL,
  `school_yearID` int NOT NULL,
  `route` varchar(255) NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `remarks` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `subject_title` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `at_risk_student_for_faculty_notification`
--

LOCK TABLES `at_risk_student_for_faculty_notification` WRITE;
/*!40000 ALTER TABLE `at_risk_student_for_faculty_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `at_risk_student_for_faculty_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `at_risk_student_notification`
--

DROP TABLE IF EXISTS `at_risk_student_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `at_risk_student_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` int NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `teacherID` int NOT NULL,
  `transmuted_grade` int NOT NULL,
  `school_yearID` int NOT NULL,
  `route` varchar(255) NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `remarks` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `subject_title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `at_risk_student_notification`
--

LOCK TABLES `at_risk_student_notification` WRITE;
/*!40000 ALTER TABLE `at_risk_student_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `at_risk_student_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacherID` int NOT NULL,
  `subjectId` int NOT NULL,
  `roomId` int NOT NULL,
  `day` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `times_slot_from` varchar(255) NOT NULL,
  `times_slot_to` varchar(255) NOT NULL,
  `hours` varchar(255) NOT NULL,
  `school_yearId` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
INSERT INTO `availability` VALUES (2,17,3,1,'Monday','Grade 7','13:30','14:30','1',2,'2025-08-12 13:53:40.569607','2025-08-15 14:21:39.174212'),(3,17,1,4,'Monday','Grade 8','10:30','11:30','1',2,'2025-08-12 13:54:57.860221','2025-08-15 14:21:39.182369'),(4,17,1,1,'Monday','Grade 7','07:30','08:30','1',2,'2025-08-12 13:59:10.910687','2025-08-15 14:21:39.182710'),(5,17,3,1,'Tuesday','Grade 7','10:30','11:30','1',2,'2025-08-12 14:02:33.354824','2025-08-15 14:21:39.182903'),(6,17,1,4,'Friday','Grade 8','07:30','08:30','1',2,'2025-08-12 15:29:28.970296','2025-08-15 14:21:39.183081'),(7,18,2,1,'Monday','Grade 7','10:30','11:30','1',2,'2025-08-14 18:04:55.736668','2025-08-15 14:21:39.183265'),(8,17,1,5,'Friday','Grade 12','10:30','11:30','1',2,'2025-08-19 10:20:08.426620','2025-08-19 10:20:08.426620'),(9,17,3,5,'Wednesday','Grade 12','13:00','14:00','1',2,'2025-09-04 23:39:25.900821','2025-09-04 23:39:25.900821'),(10,17,6,1,'Monday','Grade 7','14:30','15:30','1',2,'2025-09-05 08:43:06.697458','2025-09-05 08:43:06.697458'),(11,18,6,4,'Monday','Grade 8','08:30','09:30','1',2,'2025-09-05 14:11:51.927719','2025-09-05 14:11:51.927719');
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enroll_student`
--

DROP TABLE IF EXISTS `enroll_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enroll_student` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `mname` varchar(255) DEFAULT NULL,
  `suffix` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `bdate` varchar(255) DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `seniorJunior` varchar(255) DEFAULT NULL,
  `transfered` tinyint NOT NULL DEFAULT '0',
  `is_IP` tinyint NOT NULL DEFAULT '0',
  `ip_Name` varchar(255) DEFAULT NULL,
  `track` varchar(255) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `strand` varchar(255) DEFAULT NULL,
  `fourPs` tinyint NOT NULL DEFAULT '0',
  `fourpis` varchar(255) DEFAULT NULL,
  `blood_type` varchar(255) DEFAULT NULL,
  `isFilipino` varchar(255) DEFAULT NULL,
  `residential_zip` varchar(255) DEFAULT NULL,
  `residential_house_no` varchar(255) DEFAULT NULL,
  `residential_street` varchar(255) DEFAULT NULL,
  `residential_subd` varchar(255) DEFAULT NULL,
  `residential_brgy` varchar(255) DEFAULT NULL,
  `residential_city` varchar(255) DEFAULT NULL,
  `residential_prov` varchar(255) DEFAULT NULL,
  `permanent_zip` varchar(255) DEFAULT NULL,
  `permanent_house_no` varchar(255) DEFAULT NULL,
  `permanent_street` varchar(255) DEFAULT NULL,
  `permanent_subd` varchar(255) DEFAULT NULL,
  `permanent_brgy` varchar(255) DEFAULT NULL,
  `permanent_city` varchar(255) DEFAULT NULL,
  `permanent_prov` varchar(255) DEFAULT NULL,
  `father_fname` varchar(255) DEFAULT NULL,
  `father_mname` varchar(255) DEFAULT NULL,
  `father_lname` varchar(255) DEFAULT NULL,
  `father_number` varchar(255) DEFAULT NULL,
  `mother_fname` varchar(255) DEFAULT NULL,
  `mother_mname` varchar(255) DEFAULT NULL,
  `mother_lname` varchar(255) DEFAULT NULL,
  `mother_number` varchar(255) DEFAULT NULL,
  `guardian_fname` varchar(255) DEFAULT NULL,
  `guardian_mname` varchar(255) DEFAULT NULL,
  `guardian_lname` varchar(255) DEFAULT NULL,
  `guardian_number` varchar(255) DEFAULT NULL,
  `last_grade_completed` varchar(255) DEFAULT NULL,
  `last_year_completed` varchar(255) DEFAULT NULL,
  `last_school_attended` varchar(255) DEFAULT NULL,
  `last_school_ID` varchar(255) DEFAULT NULL,
  `disability` tinyint NOT NULL DEFAULT '0',
  `disability_desc` varchar(255) DEFAULT NULL,
  `grade_level` varchar(255) DEFAULT NULL,
  `statusEnrolled` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `picture` varchar(255) DEFAULT NULL,
  `goodMoral` varchar(255) DEFAULT NULL,
  `birthPSA` varchar(255) DEFAULT NULL,
  `schoolCard` varchar(255) DEFAULT NULL,
  `mobile_no` varchar(255) DEFAULT NULL,
  `height` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `school_yearId` varchar(255) NOT NULL,
  `lrnNo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enroll_student`
--

LOCK TABLES `enroll_student` WRITE;
/*!40000 ALTER TABLE `enroll_student` DISABLE KEYS */;
INSERT INTO `enroll_student` VALUES (4,'Test','Test','Test',NULL,NULL,'1997-12-02',NULL,'Male',NULL,'Junior High',0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,'Filipino','Test','Test','Test','Test','Test','Test','Test','Test','Test','Test','Test','Test','Test','Test',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Test','Test','Test','2',NULL,NULL,NULL,NULL,0,NULL,'Grade 7',1,'2025-08-11 21:37:57.267075','2025-08-20 10:14:07.499345','DNSC_LOGO1754925087256-459578478.png','JUNE-222025-COCTP-PROGRAM(1)1754925087282-803656765.pdf','APPROVED-FACULTY-WORKLOAD-POLICY1754925087257-840526875.pdf','APPROVED-FACULTY-WORKLOAD-POLICY1754925087257-840526875.pdf',NULL,NULL,NULL,'2','1212'),(5,'Sample','Sample','Sample','Sample',NULL,'1997-12-02','Sample','Male','Single','Senior High',0,0,NULL,'2','2','2',0,NULL,NULL,'Filipino','Sample','Sample','Sample','Sample','Sample','Sample','Sample','Sample','Sample','Sample','Sample','Sample','Sample','Sample',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sample','Sample','Sample','67',NULL,NULL,NULL,NULL,0,NULL,'Grade 12',1,'2025-08-11 21:39:08.123958','2025-08-20 10:14:07.501194','default1754919548114-256552349.pdf','default1754919548114-298674718.pdf','default1754919548114-912763965.pdf','default1754919548114-741009262.pdf','21313',NULL,NULL,'2','1212122'),(7,'Trial','Trial','Trial',NULL,NULL,'1997-12-02','Trial','Male','Single','Junior High',0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,'Filipino','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial','Trial',NULL,NULL,NULL,NULL,NULL,'Trial','Trial','Trial',NULL,NULL,NULL,NULL,NULL,0,NULL,'Grade 7',1,'2025-08-12 08:59:15.774561','2025-08-20 10:14:07.501547','default1754960355755-69957535.pdf','default1754960355754-827001483.pdf','default1754960355755-339959571.pdf','default1754960355754-64490761.pdf',NULL,NULL,NULL,'2','121212121'),(11,'Loyal','Loyal','Loyal',NULL,NULL,'1997-12-02','Loyal','Male',NULL,'Senior High',0,0,NULL,'2','2','2',0,NULL,NULL,'Filipino','8101','filter','filter',NULL,NULL,'filter','filter','8101','filter','filter',NULL,NULL,'filter','filter','filter','filter','filter',NULL,'filter','filter','filter',NULL,'filter','filter','filter',NULL,NULL,NULL,NULL,NULL,0,NULL,'Grade 12',1,'2025-08-29 15:04:55.457219','2025-08-29 15:09:36.000000','default1756451095442-144502326.pdf','default1756451095441-672245759.pdf','default1756451095442-383835059.pdf','default1756451095442-100472279.pdf',NULL,NULL,NULL,'2','21313131');
/*!40000 ALTER TABLE `enroll_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_level`
--

DROP TABLE IF EXISTS `grade_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_level`
--

LOCK TABLES `grade_level` WRITE;
/*!40000 ALTER TABLE `grade_level` DISABLE KEYS */;
INSERT INTO `grade_level` VALUES (1,'Grade 1'),(2,'Grade 2'),(3,'Grade 3'),(4,'Grade 4'),(5,'Grade 5'),(6,'Grade 6'),(7,'Grade 7'),(8,'Grade 8'),(9,'Grade 9'),(10,'Grade 10'),(11,'Grade 11'),(12,'Grade 12');
/*!40000 ALTER TABLE `grade_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lardo_student_for_faculty_notification`
--

DROP TABLE IF EXISTS `lardo_student_for_faculty_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lardo_student_for_faculty_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` int NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `teacherID` int NOT NULL,
  `school_yearID` int NOT NULL,
  `route` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `remarks` varchar(255) NOT NULL,
  `subject_title` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lardo_student_for_faculty_notification`
--

LOCK TABLES `lardo_student_for_faculty_notification` WRITE;
/*!40000 ALTER TABLE `lardo_student_for_faculty_notification` DISABLE KEYS */;
INSERT INTO `lardo_student_for_faculty_notification` VALUES (1,4,'Test Test',17,2,'/advisory-rooms','Grade 7','SAMPAGUITA',0,'Student has been absent for 5 consecutive days on: 8-12-2025, 8-11-2025, 8-10-2025, 8-09-2025, 8-08-2025, 8-07-2025','English','2025-09-08 11:02:23.445795','2025-09-08 13:19:37.889164');
/*!40000 ALTER TABLE `lardo_student_for_faculty_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lardo_student_notification`
--

DROP TABLE IF EXISTS `lardo_student_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lardo_student_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` int NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `teacherID` int NOT NULL,
  `school_yearID` int NOT NULL,
  `route` varchar(255) NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `remarks` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `grade_level` varchar(255) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `subject_title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lardo_student_notification`
--

LOCK TABLES `lardo_student_notification` WRITE;
/*!40000 ALTER TABLE `lardo_student_notification` DISABLE KEYS */;
INSERT INTO `lardo_student_notification` VALUES (5,4,'Test Test',17,2,'/advisory-rooms',1,'Student has been absent for 5 consecutive days on: 8-12-2025, 8-11-2025, 8-10-2025, 8-09-2025, 8-08-2025, 8-07-2025','2025-09-08 11:02:23.445795','2025-09-08 21:12:07.000000','Grade 7','SAMPAGUITA','English');
/*!40000 ALTER TABLE `lardo_student_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` int NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `parentID` int NOT NULL,
  `transmuted_grade` int NOT NULL,
  `school_yearID` int NOT NULL,
  `route` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `read` tinyint NOT NULL DEFAULT '0',
  `remarks` varchar(255) NOT NULL,
  `subject_title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (11,4,'Test T. Test',20,86,2,'/parent-children','2025-09-08 15:28:05.887734','2025-09-08 15:28:05.887734',0,'Passing Grade','MAPEH');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_record`
--

DROP TABLE IF EXISTS `parent_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` int NOT NULL,
  `parentID` int NOT NULL,
  `school_yearID` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_record`
--

LOCK TABLES `parent_record` WRITE;
/*!40000 ALTER TABLE `parent_record` DISABLE KEYS */;
INSERT INTO `parent_record` VALUES (4,4,20,2,'2025-09-06 15:47:59.069839','2025-09-06 15:47:59.069839'),(5,5,20,2,'2025-09-06 22:06:47.983788','2025-09-06 22:06:47.983788');
/*!40000 ALTER TABLE `parent_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms_section`
--

DROP TABLE IF EXISTS `rooms_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_section` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `strandId` int DEFAULT NULL,
  `teacherId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms_section`
--

LOCK TABLES `rooms_section` WRITE;
/*!40000 ALTER TABLE `rooms_section` DISABLE KEYS */;
INSERT INTO `rooms_section` VALUES (1,'SAMPAGUITA','Grade 7','2024-12-06 11:07:51.366304','2025-08-14 19:10:37.000000',NULL,17),(2,'Gumamela','Grade 7','2025-08-11 15:13:50.624602','2025-08-18 16:40:28.000000',NULL,18),(3,'WALING WALING','Grade 7','2025-08-11 15:23:29.158910','2025-09-09 08:50:49.000000',NULL,19),(4,'Bonifacio','Grade 8','2025-08-11 15:26:28.328180','2025-08-11 15:26:28.328180',NULL,NULL),(5,'TVL','Grade 12','2025-08-12 09:14:25.456704','2025-08-12 09:14:25.456704',1,NULL),(6,'Aguinaldo','Grade 9','2025-08-12 11:58:01.376030','2025-08-12 11:58:01.376030',NULL,NULL),(7,'Rizal','Grade 10','2025-08-12 11:58:13.175987','2025-08-12 11:58:13.175987',NULL,NULL),(8,'Humm','Grade 11','2025-08-12 11:58:24.544005','2025-08-12 11:58:24.544005',3,NULL);
/*!40000 ALTER TABLE `rooms_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_year`
--

DROP TABLE IF EXISTS `school_year`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_year` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `school_year_from` varchar(255) NOT NULL,
  `school_year_to` varchar(255) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_year`
--

LOCK TABLES `school_year` WRITE;
/*!40000 ALTER TABLE `school_year` DISABLE KEYS */;
INSERT INTO `school_year` VALUES (1,'2024-12-04 13:22:49.982239','2025-08-15 15:02:40.074812','2024','2025',0),(2,'2024-12-04 14:13:12.548614','2025-08-15 15:02:40.000000','2025','2026',1),(3,'2024-12-04 14:14:56.913840','2025-08-15 11:47:29.055000','2026','2027',0),(6,'2025-08-11 22:12:27.314453','2025-08-11 22:12:27.314453','2027','2028',0);
/*!40000 ALTER TABLE `school_year` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_attendance`
--

DROP TABLE IF EXISTS `student_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomID` int NOT NULL,
  `school_yearID` int NOT NULL,
  `studentID` int NOT NULL,
  `subjectID` int NOT NULL,
  `attendanceDate` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `attendance` int NOT NULL DEFAULT '0',
  `teacherID` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_attendance`
--

LOCK TABLES `student_attendance` WRITE;
/*!40000 ALTER TABLE `student_attendance` DISABLE KEYS */;
INSERT INTO `student_attendance` VALUES (92,1,2,4,1,'2025-08-27','2025-08-27 08:28:27.144219','2025-09-08 10:06:07.414377',0,17),(93,1,2,7,1,'2025-08-27','2025-08-27 08:28:27.151834','2025-09-08 10:06:07.414195',1,17),(94,1,2,4,1,'2025-08-28','2025-08-28 16:06:54.316259','2025-09-08 10:06:07.413891',1,17),(95,1,2,7,1,'2025-08-28','2025-08-28 16:06:54.326883','2025-09-08 10:06:07.414040',3,17),(96,1,2,4,1,'2025-08-26','2025-08-28 16:07:18.882788','2025-09-08 10:06:07.413728',1,17),(97,1,2,7,1,'2025-08-26','2025-08-28 16:07:18.892916','2025-09-08 10:06:07.413585',1,17),(98,5,2,5,1,'2025-09-04','2025-09-04 09:06:11.870668','2025-09-08 10:06:07.413437',1,17),(99,5,2,11,1,'2025-09-04','2025-09-04 09:06:11.894525','2025-09-08 10:06:07.413280',1,17),(100,1,2,4,1,'2025-09-04','2025-09-04 09:34:38.303896','2025-09-08 10:06:07.413082',1,17),(101,1,2,7,1,'2025-09-04','2025-09-04 09:34:38.323834','2025-09-08 10:06:07.412935',2,17),(102,1,2,4,1,'2025-09-06','2025-09-06 17:30:42.832438','2025-09-08 10:06:07.412779',2,17),(103,1,2,7,1,'2025-09-06','2025-09-06 17:30:42.840681','2025-09-08 10:06:07.412613',2,17),(104,1,2,4,1,'2025-08-22','2025-09-07 21:08:33.826315','2025-09-08 10:06:07.412466',0,17),(105,1,2,7,1,'2025-08-22','2025-09-07 21:08:33.842615','2025-09-08 10:06:07.412307',0,17),(106,1,2,4,1,'2025-08-07','2025-09-07 21:09:22.223451','2025-09-08 10:06:07.412143',0,17),(107,1,2,7,1,'2025-08-07','2025-09-07 21:09:22.226736','2025-09-08 10:06:07.411975',1,17),(108,1,2,4,1,'2025-08-08','2025-09-07 21:09:31.706476','2025-09-08 10:06:07.411813',0,17),(109,1,2,7,1,'2025-08-08','2025-09-07 21:09:31.717613','2025-09-08 10:06:07.411658',1,17),(110,1,2,4,1,'2025-08-09','2025-09-07 21:09:45.287022','2025-09-08 10:06:07.411310',0,17),(111,1,2,7,1,'2025-08-09','2025-09-07 21:09:45.297567','2025-09-08 10:06:07.411486',1,17),(112,1,2,4,1,'2025-08-10','2025-09-07 21:09:55.460399','2025-09-08 10:06:07.411142',0,17),(113,1,2,7,1,'2025-08-10','2025-09-07 21:09:55.464598','2025-09-08 10:06:07.410922',1,17),(116,1,2,4,1,'2025-08-11','2025-09-07 22:21:13.389397','2025-09-08 10:06:07.410716',0,17),(117,1,2,7,1,'2025-08-11','2025-09-07 22:21:13.407148','2025-09-08 10:06:07.410186',0,17),(118,1,2,4,6,'2025-09-08','2025-09-08 10:05:31.845075','2025-09-08 10:05:31.845075',1,17),(119,1,2,7,6,'2025-09-08','2025-09-08 10:05:31.864730','2025-09-08 10:05:31.864730',1,17),(122,1,2,4,1,'2025-08-12','2025-09-08 11:02:23.445795','2025-09-08 11:02:23.445795',0,17),(123,1,2,7,1,'2025-08-12','2025-09-08 11:02:23.460904','2025-09-08 11:02:23.460904',0,17);
/*!40000 ALTER TABLE `student_attendance` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_attendance` AFTER INSERT ON `student_attendance` FOR EACH ROW BEGIN
    DECLARE v_student_name VARCHAR(255);
    DECLARE v_consecutive_absents INT;
    DECLARE v_absent_dates TEXT;
    DECLARE v_remarks TEXT;
     DECLARE v_subject_title VARCHAR(255);

    -- Only check if the new record is absent
    IF NEW.attendance = 0 THEN

        -- Count last 5 records where absent
        SELECT COUNT(*) INTO v_consecutive_absents
        FROM (
            SELECT attendance
            FROM student_attendance sa
            WHERE sa.studentID = NEW.studentID
              AND sa.attendanceDate <= NEW.attendanceDate
            ORDER BY sa.attendanceDate DESC
            LIMIT 5
        ) AS last_five
        WHERE last_five.attendance = 0;

        -- If all 5 are absent
        IF v_consecutive_absents = 5 THEN
            -- Get student full name
            SELECT CONCAT(es.fname, ' ', es.lname)
            INTO v_student_name
            FROM enroll_student es
            WHERE es.id = NEW.studentID
            LIMIT 1;
            
		-- Get subject title 
        SELECT sj.subject_title
        INTO v_subject_title
        FROM subject sj
        WHERE sj.id = NEW.subjectID
        LIMIT 1;

            -- Collect last 5 absent dates formatted as M-DD-YYYY
            SELECT GROUP_CONCAT(DATE_FORMAT(sa.attendanceDate, '%c-%d-%Y') ORDER BY sa.attendanceDate DESC SEPARATOR ', ')
            INTO v_absent_dates
            FROM student_attendance sa
            WHERE sa.studentID = NEW.studentID
              AND sa.attendance = 0
              AND sa.attendanceDate <= NEW.attendanceDate
            ORDER BY sa.attendanceDate DESC
            LIMIT 5;

            -- Build remarks message
            SET v_remarks = CONCAT('Student has been absent for 5 consecutive days on: ', v_absent_dates);

            -- Insert into lardo_student_notification
            INSERT INTO lardo_student_notification (
                studentID,
                student_name,
                teacherID,
                school_yearID,
                grade_level,
                room_name,
                route,
                `read`,
                remarks,
                subject_title
            )
            SELECT
                NEW.studentID,
                v_student_name,
                rs.teacherId,
                NEW.school_yearID,
                rs.grade_level,
                rs.room_section, -- map to room_name
                '/advisory-rooms',
                FALSE,
                v_remarks,
                v_subject_title
            FROM rooms_section rs
            WHERE rs.id = NEW.roomID
              AND rs.teacherId IS NOT NULL;
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `student_grade`
--

DROP TABLE IF EXISTS `student_grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_grade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomID` int NOT NULL,
  `school_yearID` int NOT NULL,
  `studentID` int NOT NULL,
  `subjectID` int NOT NULL,
  `quarterScore` int NOT NULL DEFAULT '0',
  `quarter` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `semester` varchar(255) NOT NULL,
  `highest_posible_score` int NOT NULL DEFAULT '0',
  `type` int NOT NULL DEFAULT '0',
  `sub_subject` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_grade`
--

LOCK TABLES `student_grade` WRITE;
/*!40000 ALTER TABLE `student_grade` DISABLE KEYS */;
INSERT INTO `student_grade` VALUES (15,1,2,4,3,78,'1st Quarter','2025-08-19 15:55:00.450492','2025-09-05 09:38:53.767264','Junior High',80,1,NULL),(16,1,2,7,3,60,'1st Quarter','2025-08-19 15:55:00.453389','2025-09-05 09:38:53.768940','Junior High',80,1,NULL),(17,1,2,4,3,89,'1st Quarter','2025-08-19 15:57:00.938159','2025-09-05 09:38:53.768696','Junior High',100,3,NULL),(18,1,2,7,3,98,'1st Quarter','2025-08-19 15:57:00.948913','2025-09-05 09:38:53.769162','Junior High',100,3,NULL),(19,1,2,4,3,40,'1st Quarter','2025-08-20 09:58:05.638437','2025-09-05 09:38:53.769369','Junior High',40,2,NULL),(20,1,2,7,3,40,'1st Quarter','2025-08-20 09:58:05.653083','2025-09-05 09:38:53.769597','Junior High',40,2,NULL),(21,1,2,4,3,49,'1st Quarter','2025-08-20 09:58:21.679285','2025-09-05 09:38:53.769808','Junior High',50,2,NULL),(22,1,2,7,3,50,'1st Quarter','2025-08-20 09:58:21.688449','2025-09-05 09:38:53.770019','Junior High',50,2,NULL),(23,1,2,4,3,40,'1st Quarter','2025-08-20 10:00:27.511942','2025-09-05 09:38:53.770223','Junior High',50,2,NULL),(24,1,2,7,3,38,'1st Quarter','2025-08-20 10:00:27.522551','2025-09-05 09:38:53.770421','Junior High',50,2,NULL),(25,1,2,4,1,20,'1st Quarter','2025-08-20 10:21:24.742127','2025-09-05 09:38:53.770577','Junior High',20,1,NULL),(26,1,2,7,1,16,'1st Quarter','2025-08-20 10:21:24.752399','2025-09-05 09:38:53.770777','Junior High',20,1,NULL),(27,1,2,4,1,24,'1st Quarter','2025-08-20 10:21:42.351348','2025-09-05 09:38:53.770942','Junior High',30,1,NULL),(28,1,2,7,1,23,'1st Quarter','2025-08-20 10:21:42.364606','2025-09-05 09:38:53.771102','Junior High',30,1,NULL),(29,1,2,4,1,15,'1st Quarter','2025-08-20 10:22:04.174297','2025-09-05 09:38:53.771279','Junior High',20,1,NULL),(30,1,2,7,1,18,'1st Quarter','2025-08-20 10:22:04.183927','2025-09-05 09:38:53.771429','Junior High',20,1,NULL),(31,1,2,4,1,24,'1st Quarter','2025-08-20 10:22:27.374000','2025-09-05 09:38:53.771682','Junior High',30,2,NULL),(32,1,2,7,1,25,'1st Quarter','2025-08-20 10:22:27.383751','2025-09-05 09:38:53.771911','Junior High',30,2,NULL),(33,1,2,4,1,25,'1st Quarter','2025-08-20 10:22:51.759182','2025-09-05 09:38:53.772073','Junior High',30,2,NULL),(34,1,2,7,1,24,'1st Quarter','2025-08-20 10:22:51.769311','2025-09-05 09:38:53.772224','Junior High',30,2,NULL),(35,1,2,4,1,25,'1st Quarter','2025-08-20 10:23:06.269964','2025-09-05 09:38:53.772385','Junior High',30,2,NULL),(36,1,2,7,1,25,'1st Quarter','2025-08-20 10:23:06.280354','2025-09-05 09:38:53.772615','Junior High',30,2,NULL),(37,1,2,4,1,27,'1st Quarter','2025-08-20 10:23:28.741900','2025-09-05 09:38:53.772848','Junior High',40,3,NULL),(38,1,2,7,1,30,'1st Quarter','2025-08-20 10:23:28.752450','2025-09-05 09:38:53.773045','Junior High',40,3,NULL),(39,1,2,4,3,30,'1st Quarter','2025-08-27 10:53:06.465731','2025-09-05 09:38:53.773210','Junior High',40,1,NULL),(40,1,2,7,3,36,'1st Quarter','2025-08-27 10:53:06.480351','2025-09-05 09:38:53.773382','Junior High',40,1,NULL),(41,1,2,4,1,35,'2nd Quarter','2025-08-29 09:35:48.807934','2025-09-05 09:38:53.773541','Junior High',40,1,NULL),(42,1,2,7,1,33,'2nd Quarter','2025-08-29 09:35:48.823192','2025-09-05 09:38:53.773688','Junior High',40,1,NULL),(43,1,2,4,1,20,'2nd Quarter','2025-08-29 09:36:37.335430','2025-09-05 09:38:53.773852','Junior High',20,1,NULL),(44,1,2,7,1,20,'2nd Quarter','2025-08-29 09:36:37.345925','2025-09-05 09:38:53.774040','Junior High',20,1,NULL),(45,1,2,4,1,50,'2nd Quarter','2025-08-29 09:37:13.151872','2025-09-05 09:38:53.774208','Junior High',60,2,NULL),(46,1,2,7,1,50,'2nd Quarter','2025-08-29 09:37:13.163191','2025-09-05 09:38:53.774357','Junior High',60,2,NULL),(47,1,2,4,1,25,'2nd Quarter','2025-08-29 09:37:30.742821','2025-09-05 09:38:53.774507','Junior High',30,2,NULL),(48,1,2,7,1,25,'2nd Quarter','2025-08-29 09:37:30.752534','2025-09-05 09:38:53.774671','Junior High',30,2,NULL),(49,1,2,4,1,90,'2nd Quarter','2025-08-29 09:37:57.768233','2025-09-05 09:38:53.774844','Junior High',100,3,NULL),(50,1,2,7,1,88,'2nd Quarter','2025-08-29 09:37:57.778607','2025-09-05 09:38:53.774998','Junior High',100,3,NULL),(51,5,2,5,1,89,'1st Quarter','2025-08-29 15:12:54.557935','2025-09-05 09:38:53.775159','1st Semester',90,1,NULL),(52,5,2,11,1,89,'1st Quarter','2025-08-29 15:12:54.568935','2025-09-05 09:38:53.775337','1st Semester',90,1,NULL),(53,5,2,5,1,99,'1st Quarter','2025-08-29 15:13:08.796157','2025-09-05 09:38:53.775520','1st Semester',100,2,NULL),(54,5,2,11,1,80,'1st Quarter','2025-08-29 15:13:08.800298','2025-09-05 09:38:53.775699','1st Semester',100,2,NULL),(55,5,2,5,1,45,'1st Quarter','2025-08-29 15:13:26.724102','2025-09-05 09:38:53.775860','1st Semester',50,3,NULL),(56,5,2,11,1,44,'1st Quarter','2025-08-29 15:13:26.728151','2025-09-05 09:38:53.776041','1st Semester',50,3,NULL),(57,5,2,5,3,35,'1st Quarter','2025-09-04 23:39:59.232060','2025-09-05 09:38:53.776193','1st Semester',40,1,NULL),(58,5,2,11,3,33,'1st Quarter','2025-09-04 23:39:59.238104','2025-09-05 09:38:53.776338','1st Semester',40,1,NULL),(59,5,2,5,3,35,'1st Quarter','2025-09-04 23:40:52.029473','2025-09-05 09:38:53.776505','1st Semester',40,2,NULL),(60,5,2,11,3,25,'1st Quarter','2025-09-04 23:40:52.033418','2025-09-05 09:38:53.776675','1st Semester',40,2,NULL),(61,5,2,5,3,88,'1st Quarter','2025-09-04 23:41:16.330613','2025-09-05 09:38:53.776874','1st Semester',100,3,NULL),(62,5,2,11,3,79,'1st Quarter','2025-09-04 23:41:16.340948','2025-09-05 09:38:53.777042','1st Semester',100,3,NULL),(63,1,2,4,6,30,'1st Quarter','2025-09-05 09:37:12.887886','2025-09-08 15:24:46.000000','Junior High',30,1,1),(64,1,2,7,6,22,'1st Quarter','2025-09-05 09:37:12.895159','2025-09-05 09:37:12.895159','Junior High',30,1,1),(73,1,2,4,6,35,'1st Quarter','2025-09-05 10:46:25.264601','2025-09-08 15:24:58.000000','Junior High',50,1,2),(74,1,2,7,6,45,'1st Quarter','2025-09-05 10:46:25.278395','2025-09-05 10:46:25.278395','Junior High',50,1,2),(75,1,2,4,6,20,'1st Quarter','2025-09-05 10:50:36.664007','2025-09-08 15:25:29.000000','Junior High',30,1,3),(76,1,2,7,6,19,'1st Quarter','2025-09-05 10:50:36.675128','2025-09-05 10:50:36.675128','Junior High',30,1,3),(77,1,2,4,6,33,'1st Quarter','2025-09-05 10:50:54.263268','2025-09-05 10:50:54.263268','Junior High',45,1,4),(78,1,2,7,6,33,'1st Quarter','2025-09-05 10:50:54.266890','2025-09-05 10:50:54.266890','Junior High',45,1,4),(79,5,2,5,3,12,'2nd Quarter','2025-09-05 11:02:57.023537','2025-09-05 11:02:57.023537','1st Semester',15,1,NULL),(80,5,2,11,3,12,'2nd Quarter','2025-09-05 11:02:57.034691','2025-09-05 11:02:57.034691','1st Semester',15,1,NULL),(81,1,2,4,6,15,'1st Quarter','2025-09-05 11:48:18.654825','2025-09-05 11:48:18.654825','Junior High',20,2,1),(82,1,2,7,6,11,'1st Quarter','2025-09-05 11:48:18.660212','2025-09-05 11:48:18.660212','Junior High',20,2,1),(83,1,2,4,6,34,'1st Quarter','2025-09-05 13:26:02.041239','2025-09-05 13:26:02.041239','Junior High',50,2,1),(84,1,2,7,6,45,'1st Quarter','2025-09-05 13:26:02.058326','2025-09-05 13:26:02.058326','Junior High',50,2,1),(85,1,2,4,6,33,'1st Quarter','2025-09-05 13:26:20.557433','2025-09-05 13:26:20.557433','Junior High',40,2,1),(86,1,2,7,6,30,'1st Quarter','2025-09-05 13:26:20.561246','2025-09-05 13:26:20.561246','Junior High',40,2,1),(87,1,2,4,6,34,'1st Quarter','2025-09-05 13:26:43.229944','2025-09-05 13:26:43.229944','Junior High',50,2,2),(88,1,2,7,6,44,'1st Quarter','2025-09-05 13:26:43.240527','2025-09-05 13:26:43.240527','Junior High',50,2,2),(89,1,2,4,6,24,'1st Quarter','2025-09-05 13:27:06.198190','2025-09-05 13:27:06.198190','Junior High',30,2,3),(90,1,2,7,6,22,'1st Quarter','2025-09-05 13:27:06.208351','2025-09-05 13:27:06.208351','Junior High',30,2,3),(91,1,2,4,6,33,'1st Quarter','2025-09-05 13:27:21.070323','2025-09-05 13:27:21.070323','Junior High',40,2,4),(92,1,2,7,6,30,'1st Quarter','2025-09-05 13:27:21.083429','2025-09-05 13:42:15.000000','Junior High',40,2,4),(93,1,2,4,6,34,'1st Quarter','2025-09-05 13:27:54.709377','2025-09-05 13:27:54.709377','Junior High',45,3,4),(94,1,2,7,6,33,'1st Quarter','2025-09-05 13:27:54.712507','2025-09-05 13:27:54.712507','Junior High',45,3,4),(95,1,2,4,6,34,'1st Quarter','2025-09-05 13:38:11.781519','2025-09-05 13:38:11.781519','Junior High',50,3,1),(96,1,2,7,6,34,'1st Quarter','2025-09-05 13:38:11.793170','2025-09-05 13:38:11.793170','Junior High',50,3,1),(97,1,2,4,6,33,'1st Quarter','2025-09-05 13:38:26.493485','2025-09-05 13:38:26.493485','Junior High',35,3,2),(98,1,2,7,6,23,'1st Quarter','2025-09-05 13:38:26.503776','2025-09-05 13:38:26.503776','Junior High',35,3,2),(99,1,2,4,6,30,'1st Quarter','2025-09-05 13:38:46.485666','2025-09-05 13:38:46.485666','Junior High',30,3,3),(100,1,2,7,6,30,'1st Quarter','2025-09-05 13:38:46.489193','2025-09-05 13:38:46.489193','Junior High',30,3,3);
/*!40000 ALTER TABLE `student_grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_list`
--

DROP TABLE IF EXISTS `student_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `roomId` int NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `school_yearId` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `strandId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_list`
--

LOCK TABLES `student_list` WRITE;
/*!40000 ALTER TABLE `student_list` DISABLE KEYS */;
INSERT INTO `student_list` VALUES (35,4,1,'Grade 7',2,'2025-08-12 22:09:23.228876','2025-08-12 22:09:23.228876',NULL),(36,7,1,'Grade 7',2,'2025-08-12 22:09:23.239516','2025-08-12 22:09:23.239516',NULL),(38,5,5,'Grade 12',2,'2025-08-19 09:47:40.916336','2025-08-19 09:47:40.916336',NULL),(39,11,5,'Grade 12',2,'2025-08-29 15:09:46.107436','2025-08-29 15:09:46.107436',NULL);
/*!40000 ALTER TABLE `student_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_quarter_final_grade`
--

DROP TABLE IF EXISTS `student_quarter_final_grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_quarter_final_grade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomID` int NOT NULL,
  `school_yearID` int NOT NULL,
  `studentID` int NOT NULL,
  `subjectID` int NOT NULL,
  `transmuted_grade` int NOT NULL DEFAULT '0',
  `quarter` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `studentLRN` varchar(255) NOT NULL DEFAULT '0',
  `initial_grade` varchar(255) NOT NULL DEFAULT '0',
  `sub_subject` longtext,
  `teacherID` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_quarter_final_grade`
--

LOCK TABLES `student_quarter_final_grade` WRITE;
/*!40000 ALTER TABLE `student_quarter_final_grade` DISABLE KEYS */;
INSERT INTO `student_quarter_final_grade` VALUES (7,1,2,4,1,87,'1st Quarter','Junior High','2025-08-28 10:42:35.578375','2025-09-08 10:01:12.908493','1212','79.90',NULL,17),(8,1,2,7,1,87,'1st Quarter','Junior High','2025-08-28 10:42:35.589215','2025-09-08 10:01:12.908210','121212121','80.54',NULL,17),(9,1,2,4,3,94,'1st Quarter','Junior High','2025-08-29 08:11:37.712636','2025-09-08 10:01:12.908008','1212','90.66',NULL,17),(10,1,2,7,3,92,'1st Quarter','Junior High','2025-08-29 08:11:37.732558','2025-09-08 10:01:12.907853','121212121','88.17',NULL,17),(11,1,2,4,1,91,'2nd Quarter','Junior High','2025-08-29 09:38:14.831746','2025-09-08 10:01:12.907689','1212','87.17',NULL,17),(12,1,2,7,1,91,'2nd Quarter','Junior High','2025-08-29 09:38:14.835140','2025-09-08 10:01:12.907499','121212121','85.77',NULL,17),(17,5,2,11,1,92,'1st Quarter','1st Semester','2025-08-29 16:09:57.459855','2025-09-08 10:01:12.907336','21313131','87.27',NULL,17),(18,5,2,5,1,98,'1st Quarter','1st Semester','2025-08-29 16:09:57.475497','2025-09-08 10:01:12.907167','1212122','97.17',NULL,17),(19,5,2,11,1,92,'1st Quarter','2nd Semester','2025-08-29 16:09:57.459855','2025-09-08 10:01:12.906979','21313131','87.27',NULL,17),(20,5,2,5,1,98,'1st Quarter','2nd Semester','2025-08-29 16:09:57.475497','2025-09-08 10:01:12.906783','1212122','97.17',NULL,17),(21,5,2,11,3,83,'1st Quarter','1st Semester','2025-09-04 23:42:56.672006','2025-09-08 10:01:12.906591','21313131','73.80',NULL,17),(22,5,2,5,3,92,'1st Quarter','1st Semester','2025-09-04 23:42:56.683979','2025-09-08 10:01:12.905887','1212122','87.60',NULL,17),(50,1,2,4,6,86,'1st Quarter','Junior High','2025-09-08 15:28:05.887734','2025-09-08 15:28:05.887734','1212','78.97','{\"Music\":{\"initial_grade\":\"77.67\",\"transmuted_grade\":86},\"Arts\":{\"initial_grade\":\"76.29\",\"transmuted_grade\":85},\"Physical Education\":{\"initial_grade\":\"83.33\",\"transmuted_grade\":89},\"Health\":{\"initial_grade\":\"78.58\",\"transmuted_grade\":86}}',17),(51,1,2,7,6,85,'1st Quarter','Junior High','2025-09-08 15:28:05.905562','2025-09-08 15:28:05.905562','121212121','77.34','{\"Music\":{\"initial_grade\":\"74.16\",\"transmuted_grade\":83},\"Arts\":{\"initial_grade\":\"81.71\",\"transmuted_grade\":88},\"Physical Education\":{\"initial_grade\":\"79.33\",\"transmuted_grade\":87},\"Health\":{\"initial_grade\":\"74.17\",\"transmuted_grade\":83}}',17);
/*!40000 ALTER TABLE `student_quarter_final_grade` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_at_risk` AFTER INSERT ON `student_quarter_final_grade` FOR EACH ROW BEGIN
    DECLARE v_student_name VARCHAR(255);
    DECLARE v_remarks VARCHAR(255);
    DECLARE v_subject_title VARCHAR(255);

    -- Only proceed if grade is below 80
    IF NEW.transmuted_grade < 80 THEN

        -- Get student full name from enroll_student
        SELECT CONCAT(es.fname, ' ', es.lname)
        INTO v_student_name
        FROM enroll_student es
        WHERE es.id = NEW.studentID
        LIMIT 1;
        
		-- Get subject title 
        SELECT sj.subject_title
        INTO v_subject_title
        FROM subject sj
        WHERE sj.id = NEW.subjectID
        LIMIT 1;


        -- Build remarks message
        SET v_remarks = CONCAT(
            'Failed to meet the passing grade of 80; the student got ',
            NEW.transmuted_grade
        );

        -- Insert notification for the teacher of the student's room
        INSERT INTO at_risk_student_notification (
            studentID,
            student_name,
            teacherID,
            transmuted_grade,
            school_yearID,
            grade_level,
            room_name,
            route,
            `read`,
            remarks,
            subject_title
        )
        SELECT
            NEW.studentID,
            v_student_name,
            rs.teacherId,
            NEW.transmuted_grade,
            NEW.school_yearID,
            rs.grade_level,
            rs.room_section, -- mapped to room_name
            '/advisory-rooms',
            FALSE,
            v_remarks,
            v_subject_title
            
        FROM rooms_section rs
        WHERE rs.id = NEW.roomID
          AND rs.teacherId IS NOT NULL; -- only if room has an assigned teacher

    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_grade` AFTER INSERT ON `student_quarter_final_grade` FOR EACH ROW BEGIN
    DECLARE v_student_name VARCHAR(255);
    DECLARE v_remarks VARCHAR(50);
    DECLARE v_subject_title VARCHAR(255);

    -- Determine remarks based on transmuted grade
    IF NEW.transmuted_grade >= 80 THEN
        SET v_remarks = 'Passing Grade';
    ELSEIF NEW.transmuted_grade >= 75 AND NEW.transmuted_grade < 80 THEN
        SET v_remarks = 'At-Risk to Fail';
    ELSE
        SET v_remarks = 'Fail to Pass';
    END IF;

    -- Get student name (assuming you have a students table)
    SELECT CONCAT(fname, ' ', LEFT(mname,1), '. ', lname)
    INTO v_student_name
    FROM enroll_student
    WHERE id = NEW.studentID
    LIMIT 1;
    
    	-- Get subject title 
        SELECT sj.subject_title
        INTO v_subject_title
        FROM subject sj
        WHERE sj.id = NEW.subjectID
        LIMIT 1;

    -- Insert notifications for all parents linked to the student
    INSERT INTO notification (
        studentID,
        student_name,
        parentID,
        transmuted_grade,
        school_yearID,
        route,
        `read`,
        remarks,
        subject_title
    )
    SELECT
        NEW.studentID,
        v_student_name,
        pr.parentID,
        NEW.transmuted_grade,
        NEW.school_yearID,
        '/parent-children',
        FALSE,
        v_remarks,
        v_subject_title
    FROM parent_record pr
    WHERE pr.studentID = NEW.studentID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_at_risk_for_faculty` AFTER INSERT ON `student_quarter_final_grade` FOR EACH ROW BEGIN
    DECLARE v_student_name VARCHAR(255);
    DECLARE v_remarks VARCHAR(255);
    DECLARE v_subject_title VARCHAR(255);

    -- Only proceed if grade is below 80
    IF NEW.transmuted_grade < 80 THEN

        -- Get student full name from enroll_student
        SELECT CONCAT(es.fname, ' ', es.lname)
        INTO v_student_name
        FROM enroll_student es
        WHERE es.id = NEW.studentID
        LIMIT 1;
        
		-- Get subject title 
        SELECT sj.subject_title
        INTO v_subject_title
        FROM subject sj
        WHERE sj.id = NEW.subjectID
        LIMIT 1;


        -- Build remarks message
        SET v_remarks = CONCAT(
            'Failed to meet the passing grade of 80; the student got ',
            NEW.transmuted_grade
        );

        -- Insert notification for the teacher of the student's room
        INSERT INTO at_risk_student_for_faculty_notification (
            studentID,
            student_name,
            teacherID,
            transmuted_grade,
            school_yearID,
            grade_level,
            room_name,
            route,
            `read`,
            remarks,
            subject_title
        )
        SELECT
            NEW.studentID,
            v_student_name,
            NEW.teacherID,
            NEW.transmuted_grade,
            NEW.school_yearID,
            rs.grade_level,
            rs.room_section, -- mapped to room_name
            '/advisory-rooms',
            FALSE,
            v_remarks,
            v_subject_title
            
        FROM rooms_section rs
        WHERE rs.id = NEW.roomID
          AND rs.teacherId IS NOT NULL; -- only if room has an assigned teacher

    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `student_report_disciplinary`
--

DROP TABLE IF EXISTS `student_report_disciplinary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_report_disciplinary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` int NOT NULL,
  `teacherID` int NOT NULL,
  `roomID` int NOT NULL,
  `report_type` int NOT NULL,
  `report_description` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `school_yearID` int NOT NULL,
  `subjectID` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_report_disciplinary`
--

LOCK TABLES `student_report_disciplinary` WRITE;
/*!40000 ALTER TABLE `student_report_disciplinary` DISABLE KEYS */;
INSERT INTO `student_report_disciplinary` VALUES (1,4,17,1,1,'Sample','Grade 7',2,1,'2025-09-08 16:56:08.763406','2025-09-08 21:47:55.339226',0),(2,7,17,1,1,'maldito nga bataa','Grade 7',2,1,'2025-09-08 16:58:06.795903','2025-09-09 09:40:57.000000',2),(3,5,17,5,1,'maldita kaayo','Grade 12',2,1,'2025-09-08 16:58:41.491533','2025-09-08 16:58:41.491533',0),(4,11,17,5,1,'dwqdada','Grade 12',2,1,'2025-09-08 16:59:11.866652','2025-09-08 16:59:11.866652',0),(5,5,17,5,1,'2342323','Grade 12',2,1,'2025-09-08 16:59:33.874977','2025-09-08 16:59:33.874977',0),(6,11,17,5,1,'3215234532','Grade 12',2,1,'2025-09-08 17:00:29.954230','2025-09-08 17:00:29.954230',0);
/*!40000 ALTER TABLE `student_report_disciplinary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_values`
--

DROP TABLE IF EXISTS `student_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `roomId` int NOT NULL,
  `quarter` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `school_yearId` int NOT NULL,
  `md1_values` varchar(255) NOT NULL,
  `md2_values` varchar(255) NOT NULL,
  `mt1_values` varchar(255) NOT NULL,
  `mt2_values` varchar(255) NOT NULL,
  `mk1_values` varchar(255) NOT NULL,
  `mb1_values` varchar(255) NOT NULL,
  `mb2_values` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_values`
--

LOCK TABLES `student_values` WRITE;
/*!40000 ALTER TABLE `student_values` DISABLE KEYS */;
INSERT INTO `student_values` VALUES (1,36,1,'1st Quarter','Junior High',2,'AO','AO','AO','AO','AO','AO','AO','2025-08-28 13:33:41.734473','2025-08-28 14:32:37.000000'),(2,36,1,'2nd Quarter','Junior High',2,'SO','RO','AO','AO','AO','AO','AO','2025-08-28 14:39:30.664541','2025-08-28 14:39:30.664541'),(3,35,1,'1st Quarter','Junior High',2,'AO','AO','AO','AO','AO','AO','AO','2025-08-28 14:53:58.228935','2025-08-28 14:53:58.228935'),(4,36,1,'4th Quarter','Junior High',2,'AO','AO','AO','AO','AO','AO','AO','2025-08-28 15:34:59.494667','2025-08-28 15:34:59.494667'),(5,36,1,'3rd Quarter','Junior High',2,'RO','RO','RO','SO','RO','SO','NO','2025-08-28 15:35:31.939541','2025-08-28 15:35:31.939541'),(6,35,1,'3rd Quarter','Junior High',2,'AO','AO','AO','SO','NO','NO','NO','2025-08-28 15:39:04.124775','2025-08-28 15:39:04.124775');
/*!40000 ALTER TABLE `student_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_title` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` int NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `writen_works` int NOT NULL,
  `performance_task` int NOT NULL,
  `quarter_assessment` int NOT NULL,
  `indicator` varchar(255) DEFAULT NULL,
  `sub_subject` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (1,'English','2025-08-11 14:50:29.178131','2025-09-05 16:24:57.898344',2,'Junior High',30,50,20,'',NULL),(2,'Filipino','2025-08-11 14:51:31.056777','2025-09-05 16:24:57.898056',2,'Junior High',30,50,20,'',NULL),(3,'Math','2025-08-11 14:53:43.423757','2025-09-05 16:24:57.897326',2,'Junior High',40,40,20,'',NULL),(4,'Science','2025-08-19 09:33:16.338337','2025-09-05 16:24:57.886916',2,'Junior High',40,40,20,'',NULL),(5,'TVL 1','2025-08-19 10:43:01.997543','2025-09-04 10:32:45.000000',2,'Senior High',30,30,40,'CORE',NULL),(6,'MAPEH','2025-09-05 08:34:11.623368','2025-09-05 10:55:39.563509',2,'Junior High',20,50,30,NULL,'[{\"id\":1,\"description\":\"Music\"},{\"id\":2,\"description\":\"Art\"},{\"id\":3,\"description\":\"Physical Education\"},{\"id\":4,\"description\":\"Health\"}]'),(7,'Values','2025-09-05 10:58:00.401299','2025-09-05 10:58:00.401299',2,'Junior High',40,20,40,NULL,'[]');
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_module`
--

DROP TABLE IF EXISTS `sys_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `route` varchar(255) DEFAULT NULL,
  `isParent` tinyint NOT NULL DEFAULT '0',
  `parentID` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a2691c23f13e01cdce3e4d5775` (`title`,`parentID`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_module`
--

LOCK TABLES `sys_module` WRITE;
/*!40000 ALTER TABLE `sys_module` DISABLE KEYS */;
INSERT INTO `sys_module` VALUES (13,'Dashboard','mdi-monitor-dashboard','/dashboard',0,NULL,'2023-05-19 15:09:26.311827','2024-11-28 08:51:26.000000'),(14,'Accounts','mdi-account-multiple-check','/acc_verify',0,NULL,'2023-05-19 15:09:26.314742','2024-11-28 09:02:53.000000'),(15,'LS Approval','mdi-text-box-multiple','/locators',0,NULL,'2023-05-19 15:09:26.315015','2023-05-22 11:58:24.295852'),(16,'Travel Orders','mdi-train-car','/travel-orders',0,NULL,'2023-05-19 15:09:26.315295','2023-05-22 11:58:24.296010'),(17,'CTD Approval','mdi-timer-cog-outline','/ctd-approval',0,NULL,'2023-05-19 15:17:14.380710','2023-05-22 11:58:24.296163'),(18,'TO Approval','mdi-bus-clock','/to-approval',0,NULL,'2023-05-19 15:17:14.381137','2023-05-22 11:58:24.296460'),(19,'My Account','mdi-account',NULL,1,NULL,'2023-05-19 15:17:14.381372','2023-05-22 11:58:24.296314'),(20,'PDS','mdi-file-document-plus','/my-pds',0,NULL,'2023-05-19 15:17:14.381547','2023-09-18 09:23:00.859742'),(21,'Leave','mdi-calendar-multiselect-outline','/my-leave',0,NULL,'2023-05-19 15:17:14.381699','2023-09-18 09:23:00.800125'),(22,'Locator Slip','mdi-walk','/my-locator-slip',0,NULL,'2023-05-19 15:17:14.381828','2023-09-18 09:23:00.788577'),(23,'Travel Order','mdi-train-car','/my-travel-order',0,NULL,'2023-05-19 15:17:14.381950','2023-09-18 09:23:00.776464'),(24,'Core-Time and Designations','mdi-timer-cog-outline','/my-coretime-designation',0,NULL,'2023-05-19 15:17:14.382073','2023-09-18 09:23:00.766102'),(25,'Modules','mdi-account-supervisor',NULL,1,NULL,'2023-05-19 15:17:14.382191','2024-11-26 13:49:03.000000'),(26,'PDS','mdi-account-details-outline','/employee-pds',0,NULL,'2023-05-19 15:17:14.382325','2023-05-22 12:00:28.763692'),(27,'Employee Profile','mdi-card-account-details-outline','/employee-details',0,NULL,'2023-05-19 15:17:14.382558','2023-05-22 12:00:28.764139'),(28,'Utilities','mdi-format-list-bulleted',NULL,1,NULL,'2023-05-19 15:17:14.382697','2023-05-22 12:00:28.764484'),(29,'Schedule PDS Update','mdi-calendar','/allow-update',0,NULL,'2023-05-19 15:17:14.383440','2023-05-22 12:00:28.764699'),(30,'Offices','mdi-folder-home-outline','/offices',0,NULL,'2023-05-19 15:17:14.383604','2023-05-22 12:00:28.764867'),(31,'Positions','mdi-account-box-outline','/positions',0,NULL,'2023-05-19 15:17:14.383735','2023-05-22 12:00:28.765062'),(32,'Designation','mdi-account-tie','/designations',0,NULL,'2023-05-19 15:17:14.383864','2023-05-22 12:00:28.765223'),(33,'Institutes','mdi-home-city-outline','/institutes',0,NULL,'2023-05-19 15:17:14.384140','2023-05-22 12:00:28.765390'),(34,'Salary Grades','mdi-cash-sync','/salary-grades',0,NULL,'2023-05-19 15:17:14.384433','2023-05-22 12:00:28.765638'),(35,'User Modules','mdi-animation-outline','/user-modules',0,NULL,'2023-05-19 15:17:14.384815','2023-05-22 12:00:28.765818'),(36,'Settings','mdi-cog-outline',NULL,1,NULL,'2023-05-19 15:17:14.385117','2023-05-22 12:00:28.765974'),(37,'Profile','mdi-account-circle-outline','/profile',0,NULL,'2023-05-19 15:17:14.385462','2023-09-18 09:23:00.755516'),(38,'Direct Head','mdi-account-group-outline','/my-direct-head',0,NULL,'2023-05-19 15:17:14.385651','2023-09-18 09:23:00.688880'),(39,'Locator Slip QR Code Scanner','mdi-qrcode-scan','/qr-scanner',0,NULL,'2023-05-19 15:17:14.385804','2023-05-22 12:00:28.766418'),(40,'Locator Slip QR Logs','mdi-text-box-outline','/qr-logs',0,NULL,'2023-05-19 15:17:14.385948','2023-05-22 12:00:28.766563'),(41,'Modules','mdi-account-group-outline',NULL,1,NULL,'2023-05-22 10:24:21.248736','2024-11-26 13:46:36.000000'),(42,'List','mdi-text-box-outline','/modules-list',0,NULL,'2023-05-22 10:24:21.250311','2023-05-22 12:00:28.769674'),(45,'ILDP Calendar Year','mdi-list-box-outline','/ildp-calendar',0,NULL,'2023-05-23 13:37:42.451876','2023-05-23 13:37:42.451876'),(46,'ILDP','mdi-book-open-outline','/my-ildp',0,'19','2023-05-23 15:42:50.420470','2023-09-18 09:23:00.672798'),(47,'ILDP Approval','mdi-clipboard-check-multiple-outline','/ildp-approval',0,NULL,'2023-05-25 14:26:55.047275','2023-05-25 14:26:55.047275'),(48,'ILDP','mdi-book-check-outline','/ildp',0,NULL,'2023-05-26 13:19:39.888121','2023-05-26 13:20:13.000000'),(49,'Locator Slips','mdi-file-check-outline','/locator-slips',0,NULL,'2023-06-19 08:41:09.524060','2023-06-19 08:41:09.524060'),(50,'Requests','mdi-email-fast-outline','/my-requests',0,'19','2023-07-18 09:50:42.299465','2023-09-18 09:23:00.659927'),(51,'Document Request','mdi-file-document-arrow-right-outline','/document-requests',0,'41','2023-07-18 11:56:39.120897','2023-07-18 11:56:39.120897'),(52,'E-Signature','mdi-file-sign','/my-esign',0,'36','2023-08-17 10:11:30.084474','2023-09-18 09:23:00.647518'),(53,'Service Records','mdi-file-outline','/service-record',0,'41','2023-08-24 09:04:57.372930','2023-08-24 09:04:57.372930'),(54,'SALN','mdi-list-box-outline','/my-saln',0,'19','2023-08-31 10:29:28.767464','2023-09-18 09:23:00.586484'),(55,'TAR Approval','mdi-file-check-outline','/tar-approval',0,'41','2023-08-31 14:35:39.308640','2023-08-31 14:35:39.308640'),(56,'HR TAR Approval','mdi-file-check-outline','/hrtar-approval',0,'41','2023-09-02 18:52:33.027163','2023-09-02 18:52:33.027163'),(57,'Approvals','mdi-folder-question-outline',NULL,1,NULL,'2023-10-06 09:44:15.099223','2023-10-06 09:44:15.099223'),(59,'Approvals','mdi-folder-question-outline',NULL,1,NULL,'2023-10-06 09:44:15.099223','2023-10-06 09:44:15.099223'),(60,'Employee Assessment Rating','mdi-account-star','/employee-assessment-rating',0,'59','2023-10-10 10:31:59.875147','2023-10-10 10:31:59.875147'),(61,'School Year','mdi-square-edit-outline','/add-school-year',0,'28','2023-10-12 09:11:41.906216','2025-08-11 15:37:14.000000'),(62,'Assessment','mdi-file-sign','/employee-assessment',0,NULL,'2023-10-17 15:03:38.747519','2023-10-17 15:03:38.747519'),(66,'Leave','mdi-file-document-multiple-outline','/leaves',0,'25','2023-11-10 08:23:49.655946','2023-11-22 09:22:19.000000'),(67,'Leave Approval','mdi-file-document','/leave-approval',0,'59','2023-11-14 14:19:39.057845','2023-11-22 09:22:34.000000'),(68,'HR Leave Certification','mdi-file-outline','/hr-leave-approval',0,'59','2023-11-22 09:25:17.330040','2023-12-12 15:54:43.000000'),(69,'Core-Time Approval','mdi-badge-account-outline','/coretime-approval',0,'59','2024-01-04 15:26:13.658577','2024-01-04 15:26:13.658577'),(70,'Designation Approval','mdi-account-multiple-check','/designation-approval',0,'59','2024-01-04 15:27:20.908718','2024-01-04 15:27:20.908718'),(71,'DTR','mdi-clipboard-text-clock','/dtr',0,'41','2024-02-29 09:13:59.838412','2024-02-29 09:13:59.838412'),(72,'DTR','mdi-clipboard-text-clock','/my-dtr',0,'19','2024-02-29 09:14:28.542867','2024-02-29 09:14:28.542867'),(73,'Job Posting','mdi-file','/jobposting',0,'41','2024-05-28 08:18:15.524710','2024-05-28 08:21:59.000000'),(74,'My OIC','mdi-account-badge-outline','/my-oic',0,'41','2024-06-13 15:03:13.565393','2024-06-13 15:03:13.565393'),(75,'Hired Employee','mdi-file','/employee-hired',0,'41','2024-07-08 09:48:39.946365','2024-07-08 09:48:39.946365'),(76,'Recruitment','mdi-account-multiple-plus',NULL,1,NULL,'2024-07-09 08:50:10.255982','2024-07-09 08:50:10.255982'),(77,'Resolutions','mdi-file','/tagged-resolutions',0,'76','2024-07-16 13:40:52.960587','2024-07-16 13:40:52.960587'),(78,'System Audit','mdi-account-eye-outline',NULL,1,NULL,'2024-07-17 13:50:29.607737','2024-07-17 13:50:29.607737'),(79,'Locator Slip','mdi-file','/audit-ls',0,'78','2024-07-17 13:51:25.574619','2024-07-17 13:51:25.574619'),(80,'Travel Order','mdi-file','/audit-to',0,'78','2024-07-17 13:52:06.840705','2024-07-17 13:52:06.840705'),(81,'Leave of Absence','mdi-file','/audit-leave',0,'78','2024-07-17 13:53:21.308182','2024-07-17 13:53:21.308182'),(82,'DTR','mdi-file','/audit-dtr',0,'78','2024-07-17 13:53:57.986064','2024-07-17 13:53:57.986064'),(83,'IPCR','mdi-file','/ipcr',0,'97','2024-08-12 09:08:44.031439','2024-11-19 09:53:21.000000'),(84,'IPCR Support Utility','mdi-wrench','/ipcr-support-util',0,'28','2024-08-16 09:44:40.115069','2024-08-16 09:44:40.115069'),(85,'MPOR Approval','mdi-file','/mpor-approval',0,'57','2024-08-20 14:10:09.380401','2024-08-20 14:10:09.380401'),(86,'IPCR Approval','mdi-file','/ipcr-approval',0,'57','2024-08-28 13:38:24.600526','2024-08-28 13:38:24.600526'),(87,'IPCR Targets Approval','mdi-file','/ipcr-targets-approval',0,'57','2024-08-29 13:50:48.690989','2024-08-29 13:50:48.690989'),(88,'IPCR Summary Approval','mdi-file','/ipcr-summary-approval',0,'57','2024-08-30 15:00:29.443009','2024-08-30 15:04:16.000000'),(92,'List of Applicants','mdi-file','/short-list',0,'41','2024-10-08 10:05:11.040457','2024-10-15 15:54:22.000000'),(93,'IPCR Quality Utility','mdi-file','/ipcr-quality-util',0,'28','2024-10-28 15:55:26.933832','2024-10-28 15:55:26.933832'),(94,'IPCR Support Function','mdi-file','/ipcr-support-function',0,'41','2024-11-07 09:20:57.563616','2024-11-07 09:22:32.000000'),(95,'Planning','mdi-file',NULL,1,NULL,'2024-11-19 08:36:35.099824','2024-11-19 08:36:35.099824'),(96,'Strategic Planning','mdi-file','/strategic-planning',0,'41','2024-11-19 08:34:20.676187','2024-11-19 08:34:20.676187'),(97,'Performance Evaluation','mdi-poll',NULL,1,NULL,'2024-11-19 09:52:46.494564','2024-11-19 09:52:46.494564'),(98,'OPCR','mdi-file','/opcr',0,'97','2024-11-19 09:53:11.589946','2024-11-19 09:53:11.589946'),(99,'IPCR Timeliness Utility','mdi-file','/ipcr-timeliness-util',0,'28','2024-11-20 09:34:50.791210','2024-11-20 09:34:50.791210'),(100,'Faculty','mdi-account-supervisor',NULL,1,NULL,'2024-11-26 13:49:30.799107','2024-11-26 13:49:30.799107'),(101,'Enroll Student','mdi-email-fast','/enroll-student',0,'41','2024-11-29 10:25:49.119496','2024-11-29 10:25:49.119496'),(102,'Verify Student','mdi-account-reactivate','/student_verify',0,'41','2024-11-29 10:27:05.567342','2024-11-29 10:27:05.567342'),(103,'Subjects','mdi-file-compare','/create-subject',0,'28','2024-11-29 15:17:28.067806','2025-08-11 21:59:18.000000'),(104,'Rooms','mdi-google-classroom','/high-school-rooms',0,'28','2024-11-29 23:07:14.841414','2025-08-11 13:49:39.000000'),(105,'Tracks','mdi-file-chart','/add-tracks',0,'28','2024-11-30 10:37:31.058863','2025-08-11 21:57:29.000000'),(106,'Strand','mdi-file-code','/add-strands',0,'28','2024-11-30 13:33:44.978682','2025-08-11 21:58:21.000000'),(107,'Classroom Program','mdi-microsoft-excel','/classroom-programm',0,'28','2024-12-03 08:17:03.997912','2025-08-11 21:56:07.000000'),(108,'Faculty Schedule','mdi-list-status','/faculty-schedule',0,'25','2024-12-04 10:34:16.467151','2024-12-04 10:34:16.467151'),(109,'My Schedule','mdi-microsoft-excel','/my-scheduled-program',0,'25','2024-12-04 11:03:22.365765','2024-12-04 11:03:22.365765'),(110,'Advisory','mdi-account-file-text','/advisory-rooms',0,'41','2025-08-12 18:57:06.700358','2025-08-12 18:57:06.700358'),(111,'My Student Record','mdi-book-account','/students-records',0,'41','2025-08-12 23:02:53.010848','2025-08-12 23:02:53.010848'),(112,'Transmuted Grade','mdi-file-document-refresh-outline','/transmuted-grade',0,'25','2025-08-27 09:05:26.240712','2025-08-27 09:05:26.240712'),(113,'Faculty List','mdi-account-file','/faculty-list',0,'41','2025-09-02 15:47:38.285052','2025-09-02 15:47:38.285052'),(114,'My Children','mdi-human-male-female-child','/parent-children',0,'41','2025-09-06 13:43:48.699074','2025-09-06 13:43:48.699074'),(115,'Prefect Records','mdi-human-male-child','/student-discipline',0,'41','2025-09-06 13:47:41.289931','2025-09-06 13:47:41.289931');
/*!40000 ALTER TABLE `sys_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_grade_level`
--

DROP TABLE IF EXISTS `teacher_grade_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_grade_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grade_level` varchar(255) NOT NULL,
  `teachersId` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_grade_level`
--

LOCK TABLES `teacher_grade_level` WRITE;
/*!40000 ALTER TABLE `teacher_grade_level` DISABLE KEYS */;
INSERT INTO `teacher_grade_level` VALUES (1,'7','17','2025-08-11 16:01:43.697304','2025-08-11 16:01:43.697304'),(9,'8','17','2025-08-11 16:46:15.125574','2025-08-11 16:46:15.125574'),(11,'7','19','2025-08-13 01:51:24.284151','2025-08-13 01:51:24.284151'),(12,'9','19','2025-08-13 01:51:24.298071','2025-08-13 01:51:24.298071'),(13,'7','18','2025-08-14 18:03:20.320030','2025-08-14 18:03:20.320030'),(14,'8','18','2025-08-14 18:03:20.334245','2025-08-14 18:03:20.334245'),(15,'12','17','2025-08-19 10:19:34.634526','2025-08-19 10:19:34.634526');
/*!40000 ALTER TABLE `teacher_grade_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_subject`
--

DROP TABLE IF EXISTS `teacher_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subjectId` varchar(255) NOT NULL,
  `teachersId` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_subject`
--

LOCK TABLES `teacher_subject` WRITE;
/*!40000 ALTER TABLE `teacher_subject` DISABLE KEYS */;
INSERT INTO `teacher_subject` VALUES (1,'1','17','2025-08-11 16:42:24.911002','2025-08-11 16:42:24.911002'),(4,'3','17','2025-08-11 16:46:37.974700','2025-08-11 16:46:37.974700'),(6,'1','19','2025-08-13 02:10:13.376955','2025-08-13 02:10:13.376955'),(7,'1','18','2025-08-14 17:54:34.717659','2025-08-14 17:54:34.717659'),(8,'2','18','2025-08-14 17:54:34.725442','2025-08-14 17:54:34.725442'),(9,'3','18','2025-08-14 17:54:34.728008','2025-08-14 17:54:34.728008'),(11,'6','17','2025-09-05 08:41:54.826269','2025-09-05 08:41:54.826269'),(12,'6','18','2025-09-05 14:10:41.271347','2025-09-05 14:10:41.271347');
/*!40000 ALTER TABLE `teacher_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transmuted_grade`
--

DROP TABLE IF EXISTS `transmuted_grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transmuted_grade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transmuted_grade` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `start_range` varchar(255) NOT NULL,
  `end_range` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transmuted_grade`
--

LOCK TABLES `transmuted_grade` WRITE;
/*!40000 ALTER TABLE `transmuted_grade` DISABLE KEYS */;
INSERT INTO `transmuted_grade` VALUES (2,60,'2025-08-20 13:45:22.355933','2025-08-20 13:45:22.355933','0','3.99'),(24,61,'2025-08-20 13:59:04.433022','2025-08-20 13:59:04.433022','4','7.99'),(25,62,'2025-08-20 13:59:22.520534','2025-08-20 13:59:22.520534','8','11.99'),(26,63,'2025-08-20 13:59:38.129708','2025-08-20 13:59:38.129708','12','15.99'),(27,64,'2025-08-20 14:00:08.920943','2025-08-20 14:00:08.920943','16','19.99'),(28,65,'2025-08-20 14:00:39.505314','2025-08-20 14:00:39.505314','20','23.99'),(29,66,'2025-08-20 14:01:03.744902','2025-08-20 14:01:03.744902','24','27.99'),(30,67,'2025-08-20 14:01:18.913668','2025-08-20 14:01:18.913668','28','31.99'),(31,68,'2025-08-20 14:01:45.080574','2025-08-20 14:01:45.080574','32','35.99'),(32,69,'2025-08-20 14:02:02.361668','2025-08-20 14:02:02.361668','36','39.99'),(33,70,'2025-08-20 14:02:17.976779','2025-08-20 14:02:17.976779','40','43.99'),(34,71,'2025-08-20 14:02:31.529787','2025-08-20 14:02:31.529787','44','47.99'),(35,72,'2025-08-20 14:02:47.394119','2025-08-20 14:02:47.394119','48','51.99'),(36,73,'2025-08-20 14:03:06.808859','2025-08-20 14:03:06.808859','52','55.99'),(37,74,'2025-08-20 14:03:33.608486','2025-08-20 14:03:33.608486','56','59.99'),(38,75,'2025-08-20 14:04:29.321251','2025-08-20 14:04:29.321251','60','61.59'),(39,76,'2025-08-20 14:04:51.161835','2025-08-20 14:04:51.161835','61.60','63.19'),(40,77,'2025-08-20 14:05:19.400793','2025-08-20 14:05:19.400793','63.20','64.79'),(41,78,'2025-08-20 14:06:03.519998','2025-08-20 14:06:03.519998','64.80','66.39'),(42,79,'2025-08-20 14:06:31.312201','2025-08-20 14:06:31.312201','66.40','67.99'),(43,80,'2025-08-20 13:46:20.739800','2025-08-20 13:46:20.739800','68','69.59'),(44,81,'2025-08-20 13:47:30.844855','2025-08-20 13:47:30.844855','69.60','71.19'),(45,82,'2025-08-20 13:47:58.196123','2025-08-20 13:47:58.196123','71.20','72.79'),(46,83,'2025-08-20 13:48:48.571182','2025-08-20 13:48:48.571182','72.80','74.39'),(47,84,'2025-08-20 13:49:14.594164','2025-08-20 13:49:14.594164','74.40','75.99'),(48,85,'2025-08-20 13:49:33.579156','2025-08-20 13:49:33.579156','76','77.59'),(49,86,'2025-08-20 13:50:11.802056','2025-08-20 13:50:11.802056','77.60','79.19'),(50,87,'2025-08-20 13:50:52.130182','2025-08-20 13:50:52.130182','79.20','80.79'),(51,88,'2025-08-20 13:51:11.170815','2025-08-20 13:51:11.170815','80.80','82.39'),(52,89,'2025-08-20 13:51:34.201938','2025-08-20 13:51:34.201938','82.40','83.99'),(53,90,'2025-08-20 13:52:05.505371','2025-08-20 13:52:05.505371','84','85.59'),(54,91,'2025-08-20 13:52:39.348387','2025-08-20 13:52:39.348387','85.60','87.19'),(55,92,'2025-08-20 13:52:54.681815','2025-08-20 13:52:54.681815','87.20','88.79'),(56,93,'2025-08-20 13:53:21.921750','2025-08-20 13:53:21.921750','88.80','90.39'),(57,94,'2025-08-20 13:53:49.201194','2025-08-20 13:53:49.201194','90.40','91.99'),(58,95,'2025-08-20 13:54:23.900686','2025-08-20 13:54:23.900686','92','93.59'),(59,96,'2025-08-20 13:55:03.417440','2025-08-20 13:55:03.417440','93.60','95.19'),(60,97,'2025-08-20 13:55:53.976481','2025-08-20 13:55:53.976481','95.20','96.79'),(61,98,'2025-08-20 13:56:16.985106','2025-08-20 13:56:16.985106','96.80','98.39'),(62,99,'2025-08-20 13:56:38.192730','2025-08-20 13:56:38.192730','98.40','99.99'),(63,100,'2025-08-20 13:56:54.633498','2025-08-20 15:51:35.000000','100','100');
/*!40000 ALTER TABLE `transmuted_grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_detail`
--

DROP TABLE IF EXISTS `user_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) NOT NULL,
  `mname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `bdate` varchar(10) DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `sex` varchar(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `TIN` varchar(100) DEFAULT NULL,
  `mobile_no` varchar(13) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `userID` int DEFAULT NULL,
  `profile_img` varchar(150) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `hired` varchar(10) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `civil_status_others` varchar(50) DEFAULT NULL,
  `GSIS` varchar(255) DEFAULT NULL,
  `PHILHEALTH` varchar(255) DEFAULT NULL,
  `PAGIBIG` varchar(255) DEFAULT NULL,
  `SSS` varchar(255) DEFAULT NULL,
  `agency_employee_num` varchar(255) DEFAULT NULL,
  `is_dual_citizen` tinyint NOT NULL DEFAULT '0',
  `citizenship` varchar(100) DEFAULT NULL,
  `citizenship_type` int DEFAULT NULL,
  `country` int DEFAULT NULL,
  `tel_no` varchar(100) DEFAULT NULL,
  `residential_zip` varchar(255) DEFAULT NULL,
  `residential_house_no` varchar(255) DEFAULT NULL,
  `residential_street` varchar(255) DEFAULT NULL,
  `residential_subd` varchar(255) DEFAULT NULL,
  `residential_brgy` varchar(255) DEFAULT NULL,
  `residential_city` varchar(255) DEFAULT NULL,
  `residential_prov` varchar(255) DEFAULT NULL,
  `permanent_zip` varchar(255) DEFAULT NULL,
  `permanent_house_no` varchar(255) DEFAULT NULL,
  `permanent_street` varchar(255) DEFAULT NULL,
  `permanent_subd` varchar(255) DEFAULT NULL,
  `permanent_brgy` varchar(255) DEFAULT NULL,
  `permanent_city` varchar(255) DEFAULT NULL,
  `permanent_prov` varchar(255) DEFAULT NULL,
  `isApproved` tinyint DEFAULT '0',
  `isSameAddress` tinyint DEFAULT NULL,
  `date_approved` datetime DEFAULT NULL,
  `allowedPDSUpdateID` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_detail`
--

LOCK TABLES `user_detail` WRITE;
/*!40000 ALTER TABLE `user_detail` DISABLE KEYS */;
INSERT INTO `user_detail` VALUES (3,'admin','admin','admin','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,'09070804101',2,3,'Asuncion National High Scholl1732615871725-979202079.png','2024-11-25 20:50:36.460980','2024-11-27 10:46:53.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(6,'super','admin','superadmin','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,'09070804101',2,34,NULL,'2024-11-25 21:08:03.715788','2024-11-28 09:42:54.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(17,'teacher','','teacher','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,'09090909099',1,45,NULL,'2024-11-28 08:12:45.250612','2025-09-02 13:16:18.000000','2018-02-28','Teacher I',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(18,'Head','','Teacher','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,46,NULL,'2024-11-28 09:56:38.068963','2025-08-18 16:39:48.000000','2022-08-23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(19,'Sample','Sample','Sample',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,47,NULL,'2025-08-12 16:18:06.948419','2025-08-12 16:47:46.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(20,'Parent','Parent','Parent',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,48,NULL,'2025-09-06 13:13:44.301595','2025-09-06 13:30:27.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(21,'disciplinary','discipilinary','discipilinary',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,49,NULL,'2025-09-08 21:48:58.160197','2025-09-09 09:36:15.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(22,'Prefect',NULL,'Prefect',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,50,NULL,'2025-09-09 09:50:59.354888','2025-09-09 09:55:23.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,'Admin'),(2,'Teacher'),(3,'Parent'),(5,'Superadmin'),(6,'Junior High Prefect'),(7,'Senior High Prefect');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_5921d39f238500cd132fcf2b3a` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (1,'Admin'),(2,'Users');
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `usertypeID` int DEFAULT NULL,
  `user_roleID` int DEFAULT NULL,
  `assignedModuleID` int DEFAULT '2',
  `otp` text,
  `isValidated` tinyint NOT NULL DEFAULT '1',
  `isAdminApproved` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'admin@gmail.com','$2b$10$ueN1El.7qLigz3xIBBa3DOK2VxXQGfq8fqufq/va6yuOwCX3skh.i',1,1,1,'$2b$10$p1N5VM.MTk9svXucVFn/m.NI80Y00pyfagUDOSVUuEeuV9JOPRAwK',1,1,'2024-11-25 20:50:36.455566','2025-08-11 14:10:26.000000'),(34,'superadmin@gmail.com','$2b$10$kxnP6z3g8VTsjLJOuM4k1uFspjpPMjwW9RVtmu7hkKBLn8ETQOLYe',1,5,4,NULL,1,1,'2024-11-25 21:08:03.709020','2025-09-08 22:29:33.694569'),(45,'teacher@gmail.com','$2b$10$nStOFhTWvFsIrB8qM6K54ul6aLXS5oRYK0gZFk2bQ0JIP4FZKzcPS',2,2,21,'$2b$10$KEVnaBzeK177VGdiWr3PauSjXk4QFP3IJxlTjzNZDHWT1gBdaiAGq',1,1,'2024-11-28 08:12:45.244260','2025-08-12 16:57:20.000000'),(46,'headteacher@gmail.com','$2b$10$cNcoD5fz2W68CrzqJNtMEuWM8KPAeJRcPG4A8b4GfSiazGAHD7p7W',2,2,2,'$2b$10$zSyrkBw5lbU8Vpnb65b8CelETm7QOPqsiMHgnvqoOYcyhB8u35buu',1,1,'2024-11-28 09:56:38.065496','2025-08-18 16:39:48.000000'),(47,'sample@gmail.com','$2b$10$J/WzTzQ3X3DjeZvdt6ZD.e2oNjMMSMNOLwDgcIIi4Rb3Sl4OMSeOG',2,2,2,'$2b$10$jsXwvSn08o5Yzr8vD8jfauc0z/fPQOnteglPj9H1SCzNhLk4pbVFW',1,1,'2025-08-12 16:18:06.942872','2025-09-06 09:44:47.000000'),(48,'parent@gmail.com','$2b$10$AM55QYtkUPQni4cLqxbyTOR5o0TXdY4cWpbtgzkBSN6sulwwfNtR.',2,3,22,'$2b$10$UtJxhcqAw0SlsbPTREz5Ye6SBBkKQo75ud/7pcm6Xa7v9K904scfm',1,1,'2025-09-06 13:13:44.296197','2025-09-06 13:30:27.000000'),(49,'disciplinary@gmail.com','$2b$10$YfQj1pNHek0xzwvgOLXoDuzJrJrsvtyf5wiGcuEhBNpSid860D6uW',2,6,23,'$2b$10$1/FuO.KU8BYU5Wvu7qUf4.kkUQWZj53CxE3u7T1HKALYZxkZ4wvIa',1,1,'2025-09-08 21:48:58.156850','2025-09-09 09:36:15.000000'),(50,'prefect@gmail.com','$2b$10$ScIaG/IT/SKDCaHdMd4O5.8vUn7/ujdac5rdukuWJWIrigcgpHMAq',2,7,24,'$2b$10$J18HPwzDRGMGVT0O7LI/0O0B7OzfbQwb.ewG5b2kyieTwNH7UDeHy',1,1,'2025-09-09 09:50:59.348893','2025-09-09 09:55:23.000000');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'tadle_school_management'
--

--
-- Dumping routines for database 'tadle_school_management'
--
/*!50003 DROP PROCEDURE IF EXISTS `getquarterlygrades` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getquarterlygrades`(
    IN p_roomID INT,
    IN p_schoolYearID INT,
    IN p_quarter VARCHAR(50),
    IN p_semester VARCHAR(50),
    IN p_subjectID INT
)
BEGIN
    SELECT 
        es.id AS studentID,
        es.lrnNo AS studentLRN,
        CONCAT(es.lname, ', ', es.fname, ' ', IFNULL(es.mname,''), ' ', IFNULL(es.suffix,'')) AS name,
        s.subject_title,

        -- Written Work
        SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) AS ww_score,
        SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END) AS ww_highest,
        ROUND(
            (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
             NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
        ) AS ww_percentage,
        ROUND(
            ( (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
              NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
              * (s.writen_works / 100), 2
        ) AS ww_weighted,

        -- Performance Task
        SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) AS pt_score,
        SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END) AS pt_highest,
        ROUND(
            (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
             NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
        ) AS pt_percentage,
        ROUND(
            ( (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
              NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
              * (s.performance_task / 100), 2
        ) AS pt_weighted,

        -- Quarterly Assessment
        SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) AS qa_score,
        SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END) AS qa_highest,
        ROUND(
            (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
             NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
        ) AS qa_percentage,
        ROUND(
            ( (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
              NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
              * (s.quarter_assessment / 100), 2
        ) AS qa_weighted,

        -- Final Grade
        ROUND(
            COALESCE(
                ( (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
                   NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                   * (s.writen_works / 100), 0
            ) +
            COALESCE(
                ( (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
                   NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                   * (s.performance_task / 100), 0
            ) +
            COALESCE(
                ( (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
                   NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                   * (s.quarter_assessment / 100), 0
            )
        , 2) AS initial_grade
        
       -- ROUND((ww_percentage * ww_weight) + (pt_percentage * pt_weight) +(qa_percentage * qa_weight), 2) AS final_grade

    FROM student_grade sg
    JOIN enroll_student es ON es.id = sg.studentID
    JOIN subject s ON s.id = sg.subjectID
    WHERE sg.roomID = p_roomID
      AND sg.school_yearID = p_schoolYearID
      AND lower(sg.quarter) = lower(p_quarter)
      AND lower(sg.semester) = lower(p_semester)
      AND sg.subjectID = p_subjectID
    GROUP BY es.id, s.id
    ORDER BY es.lname, es.fname;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getquarterlygrades_mapeh` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getquarterlygrades_mapeh`(
    IN p_roomID INT,
    IN p_schoolYearID INT,
    IN p_quarter VARCHAR(50),
    IN p_semester VARCHAR(50),
    IN p_subjectID INT  -- should be MAPEH subject id (6)
)
BEGIN
    -- We compute per-subject first in a derived table
    SELECT * 
    FROM (
        SELECT 
            es.id AS studentID,
            es.lrnNo AS studentLRN,
            CONCAT(es.lname, ', ', es.fname, ' ', IFNULL(es.mname,''), ' ', IFNULL(es.suffix,'')) AS name,
            CASE sg.sub_subject
                WHEN 1 THEN 'Music'
                WHEN 2 THEN 'Arts'
                WHEN 3 THEN 'Physical Education'
                WHEN 4 THEN 'Health'
                ELSE 'Unknown'
            END AS subject_title,

            -- Written Work
            SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) AS ww_score,
            SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END) AS ww_highest,
            ROUND(
                (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
                 NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
            ) AS ww_percentage,
            ROUND(
                ( (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
                  NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                  * (s.writen_works / 100), 2
            ) AS ww_weighted,

            -- Performance Task
            SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) AS pt_score,
            SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END) AS pt_highest,
            ROUND(
                (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
                 NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
            ) AS pt_percentage,
            ROUND(
                ( (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
                  NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                  * (s.performance_task / 100), 2
            ) AS pt_weighted,

            -- Quarterly Assessment
            SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) AS qa_score,
            SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END) AS qa_highest,
            ROUND(
                (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
                 NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
            ) AS qa_percentage,
            ROUND(
                ( (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
                  NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                  * (s.quarter_assessment / 100), 2
            ) AS qa_weighted,

            -- Initial Grade
            ROUND(
                COALESCE(
                    ( (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
                       NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                       * (s.writen_works / 100), 0
                ) +
                COALESCE(
                    ( (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
                       NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                       * (s.performance_task / 100), 0
                ) +
                COALESCE(
                    ( (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
                       NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                       * (s.quarter_assessment / 100), 0
                )
            , 2) AS initial_grade
        FROM student_grade sg
        JOIN enroll_student es ON es.id = sg.studentID
        JOIN subject s ON s.id = sg.subjectID
        WHERE sg.roomID = p_roomID
          AND sg.school_yearID = p_schoolYearID
          AND lower(sg.quarter) = lower(p_quarter)
          AND lower(sg.semester) = lower(p_semester)
          AND sg.subjectID = p_subjectID  -- only MAPEH
        GROUP BY es.id, sg.sub_subject
    ) AS sub_grades

    UNION ALL

    -- Now compute overall MAPEH row safely
    SELECT 
        sg.studentID,
        sg.studentLRN,
        sg.name,
        'MAPEH' AS subject_title,
        NULL,NULL,NULL,NULL,  -- ww
        NULL,NULL,NULL,NULL,  -- pt
        NULL,NULL,NULL,NULL,  -- qa
        ROUND(AVG(sg.initial_grade),2) AS initial_grade
    FROM (
        SELECT 
            es.id AS studentID,
            es.lrnNo AS studentLRN,
            CONCAT(es.lname, ', ', es.fname, ' ', IFNULL(es.mname,''), ' ', IFNULL(es.suffix,'')) AS name,
            sg.sub_subject,
            ROUND(
                COALESCE(
                    ( (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
                       NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                       * (s.writen_works / 100), 0
                ) +
                COALESCE(
                    ( (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
                       NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                       * (s.performance_task / 100), 0
                ) +
                COALESCE(
                    ( (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
                       NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                       * (s.quarter_assessment / 100), 0
                )
            , 2) AS initial_grade
        FROM student_grade sg
        JOIN enroll_student es ON es.id = sg.studentID
        JOIN subject s ON s.id = sg.subjectID
        WHERE sg.roomID = p_roomID
          AND sg.school_yearID = p_schoolYearID
          AND lower(sg.quarter) = lower(p_quarter)
          AND lower(sg.semester) = lower(p_semester)
          AND sg.subjectID = p_subjectID
        GROUP BY es.id, sg.sub_subject
    ) sg
    GROUP BY sg.studentID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_quarterly_grades` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_quarterly_grades`(
    IN p_roomID INT,
    IN p_schoolYearID INT,
    IN p_quarter VARCHAR(50),
    IN p_semester VARCHAR(50),
    IN p_subjectID INT
)
BEGIN
    SELECT 
        es.id AS studentID,
        es.lrnNo AS studentLRN,
        CONCAT(es.lname, ', ', es.fname, ' ', IFNULL(es.mname,''), ' ', IFNULL(es.suffix,'')) AS name,
        s.subject_title,
        s.id as subjectID,

        -- Written Work
        SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) AS ww_score,
        SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END) AS ww_highest,
        ROUND(
            (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
             NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
        ) AS ww_percentage,
        ROUND(
            ( (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
              NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
              * (s.writen_works / 100), 2
        ) AS ww_weighted,

        -- Performance Task
        SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) AS pt_score,
        SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END) AS pt_highest,
        ROUND(
            (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
             NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
        ) AS pt_percentage,
        ROUND(
            ( (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
              NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
              * (s.performance_task / 100), 2
        ) AS pt_weighted,

        -- Quarterly Assessment
        SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) AS qa_score,
        SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END) AS qa_highest,
        ROUND(
            (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
             NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100, 2
        ) AS qa_percentage,
        ROUND(
            ( (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
              NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
              * (s.quarter_assessment / 100), 2
        ) AS qa_weighted,

        -- Final Grade
        ROUND(
            COALESCE(
                ( (SUM(CASE WHEN sg.type = 1 THEN sg.quarterScore ELSE 0 END) /
                   NULLIF(SUM(CASE WHEN sg.type = 1 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                   * (s.writen_works / 100), 0
            ) +
            COALESCE(
                ( (SUM(CASE WHEN sg.type = 2 THEN sg.quarterScore ELSE 0 END) /
                   NULLIF(SUM(CASE WHEN sg.type = 2 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                   * (s.performance_task / 100), 0
            ) +
            COALESCE(
                ( (SUM(CASE WHEN sg.type = 3 THEN sg.quarterScore ELSE 0 END) /
                   NULLIF(SUM(CASE WHEN sg.type = 3 THEN sg.highest_posible_score ELSE 0 END),0)) * 100 )
                   * (s.quarter_assessment / 100), 0
            )
        , 2) AS initial_grade
        
       -- ROUND((ww_percentage * ww_weight) + (pt_percentage * pt_weight) +(qa_percentage * qa_weight), 2) AS final_grade

    FROM student_grade sg
    JOIN enroll_student es ON es.id = sg.studentID
    JOIN subject s ON s.id = sg.subjectID
    WHERE sg.roomID = p_roomID
      AND sg.school_yearID = p_schoolYearID
      AND lower(sg.quarter) = lower(p_quarter)
      AND lower(sg.semester) = lower(p_semester)
      AND sg.subjectID = p_subjectID
    GROUP BY es.id, s.id
    ORDER BY es.lname, es.fname;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-09 10:33:47
