import {MigrationInterface, QueryRunner} from "typeorm";

export class basics1643978135990 implements MigrationInterface {
    name = 'basics1643978135990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`designation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employee_backup\` (\`id\` int NOT NULL AUTO_INCREMENT, \`id_card_number\` varchar(255) NOT NULL, \`name\` varchar(100) NOT NULL, \`role\` int NOT NULL DEFAULT '3', \`unique_id\` text NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, \`phone_number\` int NOT NULL, \`is_accepted\` tinyint NOT NULL DEFAULT 0, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`designationId\` int NULL, \`departmentId\` int NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`department\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`security_question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`statement\` varchar(100) NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_answer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`answer\` varchar(255) NOT NULL DEFAULT 0, \`questionId\` int NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`id_card_number\` varchar(255) NOT NULL, \`name\` varchar(100) NOT NULL, \`role\` int NOT NULL DEFAULT '3', \`unique_id\` text NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`is_accepted\` tinyint NOT NULL DEFAULT 0, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`is_temporary_password\` tinyint NOT NULL DEFAULT 0, \`designationId\` int NULL, \`departmentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`id_proof_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`visitor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`organization\` varchar(255) NOT NULL, \`id_proof_number\` varchar(255) NOT NULL, \`purpose\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, \`id_proof_file\` varchar(255) NOT NULL, \`in_date\` varchar(255) NOT NULL, \`out_date\` varchar(255) NOT NULL, \`is_recommend\` tinyint NOT NULL DEFAULT 0, \`is_approved\` tinyint NOT NULL DEFAULT 0, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`designation\` varchar(255) NOT NULL, \`remarks\` varchar(255) NOT NULL, \`update_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_date\` datetime(6) NULL, \`zoneId\` int NULL, \`personToMeetId\` int NULL, \`approvedById\` int NULL, \`recommendById\` int NULL, \`addedById\` int NULL, \`idProofTypeId\` int NULL, \`deletedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`zone\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`color\` varchar(100) NOT NULL, \`priority\` int NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`area\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`zoneId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`visitor_area_permitted_area\` (\`visitorId\` int NOT NULL, \`areaId\` int NOT NULL, INDEX \`IDX_67a4c6048bdc57b690b2d841ef\` (\`visitorId\`), INDEX \`IDX_1d6a82517c6b2ba84701c95474\` (\`areaId\`), PRIMARY KEY (\`visitorId\`, \`areaId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_backup\` ADD CONSTRAINT \`FK_4e2d4c8f040e50a05466cef02a9\` FOREIGN KEY (\`designationId\`) REFERENCES \`designation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_backup\` ADD CONSTRAINT \`FK_4ba1a0776b9660742495eaa4516\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_backup\` ADD CONSTRAINT \`FK_0cd350e1d6cbc560d6659c4a014\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_answer\` ADD CONSTRAINT \`FK_1adf9ebd234bfde6fb88f0da94e\` FOREIGN KEY (\`questionId\`) REFERENCES \`security_question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_answer\` ADD CONSTRAINT \`FK_050d868d74943aa146351d40828\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_e41e10c17872cdf2f511e5d0097\` FOREIGN KEY (\`designationId\`) REFERENCES \`designation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_9ad20e4029f9458b6eed0b0c454\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor\` ADD CONSTRAINT \`FK_0adb4796b912b74351fcc8707e1\` FOREIGN KEY (\`zoneId\`) REFERENCES \`zone\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor\` ADD CONSTRAINT \`FK_601d15ab19640e702022c1f7a8b\` FOREIGN KEY (\`personToMeetId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor\` ADD CONSTRAINT \`FK_3794316c1a95baefcf7ccf0dde8\` FOREIGN KEY (\`approvedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor\` ADD CONSTRAINT \`FK_b5544eaa26f3e1a9a154ec53245\` FOREIGN KEY (\`recommendById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor\` ADD CONSTRAINT \`FK_89feed9e385a364dd246ea9f214\` FOREIGN KEY (\`addedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor\` ADD CONSTRAINT \`FK_ddddfd5122e542e8587f9dd55bc\` FOREIGN KEY (\`idProofTypeId\`) REFERENCES \`id_proof_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor\` ADD CONSTRAINT \`FK_9afbeec2a428dba92b42ef151e1\` FOREIGN KEY (\`deletedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`area\` ADD CONSTRAINT \`FK_2079b42689a531aaa0d3f3bb3dd\` FOREIGN KEY (\`zoneId\`) REFERENCES \`zone\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`material\` ADD CONSTRAINT \`FK_fdd3c87b67a6c2e7e0fbc9ed43f\` FOREIGN KEY (\`zoneId\`) REFERENCES \`zone\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`material\` ADD CONSTRAINT \`FK_8cd4de150d6a166cd4db068dc6a\` FOREIGN KEY (\`carryById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`material\` ADD CONSTRAINT \`FK_adf7efb9ef704e644aeae7b69f0\` FOREIGN KEY (\`recommendById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`material\` ADD CONSTRAINT \`FK_81092cb1facd319238d08f47b0e\` FOREIGN KEY (\`approvedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`material\` ADD CONSTRAINT \`FK_e34c6562a41b0fb187a7adfe395\` FOREIGN KEY (\`deletedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`material\` ADD CONSTRAINT \`FK_9bf82168167f52a2f685b4546c2\` FOREIGN KEY (\`addedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor_area_permitted_area\` ADD CONSTRAINT \`FK_67a4c6048bdc57b690b2d841ef8\` FOREIGN KEY (\`visitorId\`) REFERENCES \`visitor\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`visitor_area_permitted_area\` ADD CONSTRAINT \`FK_1d6a82517c6b2ba84701c95474c\` FOREIGN KEY (\`areaId\`) REFERENCES \`area\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`material_area_permitted_area\` ADD CONSTRAINT \`FK_15e6cbbebced5281c9c3070dd66\` FOREIGN KEY (\`materialId\`) REFERENCES \`material\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`material_area_permitted_area\` ADD CONSTRAINT \`FK_af0742e22bd3f548f97519fe424\` FOREIGN KEY (\`areaId\`) REFERENCES \`area\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`material_area_permitted_area\` DROP FOREIGN KEY \`FK_af0742e22bd3f548f97519fe424\``);
        await queryRunner.query(`ALTER TABLE \`material_area_permitted_area\` DROP FOREIGN KEY \`FK_15e6cbbebced5281c9c3070dd66\``);
        await queryRunner.query(`ALTER TABLE \`visitor_area_permitted_area\` DROP FOREIGN KEY \`FK_1d6a82517c6b2ba84701c95474c\``);
        await queryRunner.query(`ALTER TABLE \`visitor_area_permitted_area\` DROP FOREIGN KEY \`FK_67a4c6048bdc57b690b2d841ef8\``);
        await queryRunner.query(`ALTER TABLE \`material\` DROP FOREIGN KEY \`FK_9bf82168167f52a2f685b4546c2\``);
        await queryRunner.query(`ALTER TABLE \`material\` DROP FOREIGN KEY \`FK_e34c6562a41b0fb187a7adfe395\``);
        await queryRunner.query(`ALTER TABLE \`material\` DROP FOREIGN KEY \`FK_81092cb1facd319238d08f47b0e\``);
        await queryRunner.query(`ALTER TABLE \`material\` DROP FOREIGN KEY \`FK_adf7efb9ef704e644aeae7b69f0\``);
        await queryRunner.query(`ALTER TABLE \`material\` DROP FOREIGN KEY \`FK_8cd4de150d6a166cd4db068dc6a\``);
        await queryRunner.query(`ALTER TABLE \`material\` DROP FOREIGN KEY \`FK_fdd3c87b67a6c2e7e0fbc9ed43f\``);
        await queryRunner.query(`ALTER TABLE \`area\` DROP FOREIGN KEY \`FK_2079b42689a531aaa0d3f3bb3dd\``);
        await queryRunner.query(`ALTER TABLE \`visitor\` DROP FOREIGN KEY \`FK_9afbeec2a428dba92b42ef151e1\``);
        await queryRunner.query(`ALTER TABLE \`visitor\` DROP FOREIGN KEY \`FK_ddddfd5122e542e8587f9dd55bc\``);
        await queryRunner.query(`ALTER TABLE \`visitor\` DROP FOREIGN KEY \`FK_89feed9e385a364dd246ea9f214\``);
        await queryRunner.query(`ALTER TABLE \`visitor\` DROP FOREIGN KEY \`FK_b5544eaa26f3e1a9a154ec53245\``);
        await queryRunner.query(`ALTER TABLE \`visitor\` DROP FOREIGN KEY \`FK_3794316c1a95baefcf7ccf0dde8\``);
        await queryRunner.query(`ALTER TABLE \`visitor\` DROP FOREIGN KEY \`FK_601d15ab19640e702022c1f7a8b\``);
        await queryRunner.query(`ALTER TABLE \`visitor\` DROP FOREIGN KEY \`FK_0adb4796b912b74351fcc8707e1\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_9ad20e4029f9458b6eed0b0c454\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_e41e10c17872cdf2f511e5d0097\``);
        await queryRunner.query(`ALTER TABLE \`question_answer\` DROP FOREIGN KEY \`FK_050d868d74943aa146351d40828\``);
        await queryRunner.query(`ALTER TABLE \`question_answer\` DROP FOREIGN KEY \`FK_1adf9ebd234bfde6fb88f0da94e\``);
        await queryRunner.query(`ALTER TABLE \`employee_backup\` DROP FOREIGN KEY \`FK_0cd350e1d6cbc560d6659c4a014\``);
        await queryRunner.query(`ALTER TABLE \`employee_backup\` DROP FOREIGN KEY \`FK_4ba1a0776b9660742495eaa4516\``);
        await queryRunner.query(`ALTER TABLE \`employee_backup\` DROP FOREIGN KEY \`FK_4e2d4c8f040e50a05466cef02a9\``);
        await queryRunner.query(`DROP INDEX \`IDX_1d6a82517c6b2ba84701c95474\` ON \`visitor_area_permitted_area\``);
        await queryRunner.query(`DROP INDEX \`IDX_67a4c6048bdc57b690b2d841ef\` ON \`visitor_area_permitted_area\``);
        await queryRunner.query(`DROP TABLE \`visitor_area_permitted_area\``);
        await queryRunner.query(`DROP TABLE \`area\``);
        await queryRunner.query(`DROP TABLE \`zone\``);
        await queryRunner.query(`DROP TABLE \`visitor\``);
        await queryRunner.query(`DROP TABLE \`id_proof_type\``);
        await queryRunner.query(`DROP TABLE \`employee\``);
        await queryRunner.query(`DROP TABLE \`question_answer\``);
        await queryRunner.query(`DROP TABLE \`security_question\``);
        await queryRunner.query(`DROP TABLE \`department\``);
        await queryRunner.query(`DROP TABLE \`employee_backup\``);
        await queryRunner.query(`DROP TABLE \`designation\``);
    }

}
