import {MigrationInterface, QueryRunner} from "typeorm";

export class init1630183067579 implements MigrationInterface {
    name = 'init1630183067579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` ADD \`lastname\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` ADD \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` ADD \`updateAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` DROP COLUMN \`updateAt\``);
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` DROP COLUMN \`createAt\``);
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` DROP COLUMN \`lastname\``);
        await queryRunner.query(`ALTER TABLE \`my_db\`.\`user\` DROP COLUMN \`name\``);
    }

}
