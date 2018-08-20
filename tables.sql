-- Populate the data tables
INSERT INTO `user` (`user_id`, `sub`, `email`, `first_name`, `last_name`) VALUES
(1, 'auth0|5b746c17b1132548cd87e751', 'user1@email.com', 'User', 'One'),
(2, 'auth0|5b746ccaaf1e9a7b604d03b9', 'user2@email.com', 'User', 'Two');
--
--
INSERT INTO `city`(`city_id`, `name`, `self`, `visited`, `user_id`) VALUES
(1, 'London', 'https://travelplanning-212822.appspot.com/city/1', 1, 1),
(2, 'Seattle', 'https://travelplanning-212822.appspot.com/city/2', 1, 2),
(3, 'Paris', 'https://travelplanning-212822.appspot.com/city/3', 1, 1),
(4, 'Oslo', 'https://travelplanning-212822.appspot.com/city/4', 0, 2);
--
--
INSERT INTO `restaurant` (`restaurant_id`, `name`, `self`, `type`, `city_id`, `visited`, `user_id`) VALUES
(1, 'Fishers', 'https://travelplanning-212822.appspot.com/restaurant/1', 'chippy', 1, 0, 1),
(2, 'Top Pot Doughnuts', 'https://travelplanning-212822.appspot.com/restaurant/2', 'donuts', 2, 0, 2),
(3, 'Hall''s Beer Tavern', 'https://travelplanning-212822.appspot.com/restaurant/3', 'tavern', 3, 0, 1);
--
--
INSERT INTO `activity` (`activity_id`, `name`, `self`, `type`, `city_id`, `visited`, `user_id`) VALUES
(1, 'Viking Museum', 'https://travelplanning-212822.appspot.com/activity/1', 'museum', 4, 0, 2),
(2, 'Louvre', 'https://travelplanning-212822.appspot.com/activity/2', 'museum', 3, 1, 1),
(3, 'British Museum', 'https://travelplanning-212822.appspot.com/activity/3', 'museum', 1, 1, 1),
(4, 'Space Needle', 'https://travelplanning-212822.appspot.com/activity/4', 'observation deck', 2, 1, 2);