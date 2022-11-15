CREATE SCHEMA `vms` ;
INSERT INTO `vms`.`department` (`id`, `name`, `is_deleted`) VALUES ('1', 'devlopment', '0');
INSERT INTO `vms`.`designation` (`id`, `name`, `is_deleted`) VALUES ('1', 'devloper', '0');
INSERT INTO `vms`.`id_proof_type` (`id`, `name`, `is_deleted`) VALUES ('1', 'UID', '0');
INSERT INTO `vms`.`zone` (`id`, `name`, `is_deleted`,`color`,`priority`) VALUES ('1', 'secure', '0','red','0');
INSERT INTO `vms`.`area` (`id`, `name`, `is_deleted`,`zoneId`) VALUES ('1', 'Devcell', '0','1');
INSERT INTO `vms`.`employee`
		(`id`, `id_card_number`, `name`, `role`, `unique_id`, `username`, `password`, `address`, `image`, `phone_number`, `is_accepted`, `is_deleted`, `designationId`, `departmentId`)
 VALUES ('1', '4561', 'abhay', '0', 'b2b1abf7-1e23-49b2-99c3-5675c81197c5', 'raja1', '$2b$10$4BuT/zllJzsNur1HPaIS0.tUmnRoKEc/HZ9og/snRLnueSR46pXSC', 'ds fsdf', 'b2b1abf7-1e23-49b2-99c3-5675c81197c5.jpg', '965339234', '0', '0', '1', '1');
SELECT * FROM vms.employee;
UPDATE `vms`.`employee` SET `role` = '0' WHERE (`id` = '1');
DELETE FROM `vms`.`employee` WHERE (`id` = '1');
SELECT * FROM vms.visitor;
DELETE FROM `vms`.`visitor` WHERE (`id` = '2');
SELECT * FROM vms.department;
SELECT * FROM vms.id_proof_type;