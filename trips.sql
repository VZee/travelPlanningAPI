-- Louisa Katlubeck
-- MySQL file for trip planning API
--
-- Use schema
USE trip_planning;
--
-- --------------------------------------------------------------
-- Create tables
-- --------------------------------------------------------------
-- Table structure for table `city`
--
DROP TABLE IF EXISTS `city`;
CREATE TABLE `city`(
	`city_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `self` varchar(255) NOT NULL,
    `visited` tinyint DEFAULT 0,
    `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
--
-- Table structure for table `restaurant`
--
DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE `restaurant`(
	`restaurant_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
    `self` varchar(255) NOT NULL,
    `type` varchar(255) NOT NULL,
    `city_id` int(11) NOT NULL,
    `visited` tinyint DEFAULT 0,
    `user_id` int(11) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
--
-- Table structure for table `activity`
--
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`(
	`activity_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
    `self` varchar(255) NOT NULL,
    `type` varchar(255) NOT NULL,
    `city_id` int(11) NOT NULL,
    `visited` tinyint DEFAULT 0,
    `user_id` int(11) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
--
-- Authorization table to track users
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`(
    `user_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `sub` varchar(255) NOT NULL UNIQUE,
    `email` varchar (255),
    `first_name` varchar (255),
    `last_name` varchar (255)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
--
-- Constraints for table `city`
ALTER TABLE `city`
ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`user_id`) 
REFERENCES `user` (`user_id`);
--
--
-- Constraints for table `resaurant`
ALTER TABLE `restaurant`
ADD CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`city_id`) 
REFERENCES `city` (`city_id`)
ON DELETE CASCADE;
--
ALTER TABLE `restaurant`
ADD CONSTRAINT `restaurant_ibfk_2` FOREIGN KEY (`user_id`) 
REFERENCES `user` (`user_id`)
ON DELETE CASCADE;
--
--
-- Constraints for table `activity`
ALTER TABLE `activity`
ADD CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`city_id`) 
REFERENCES `city` (`city_id`)
ON DELETE CASCADE;
--
ALTER TABLE `activity`
ADD CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`user_id`) 
REFERENCES `user` (`user_id`)
ON DELETE CASCADE;