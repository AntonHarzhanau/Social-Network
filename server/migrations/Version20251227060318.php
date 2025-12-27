<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251227060318 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE chat_media_bindings (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, chat_id UUID NOT NULL, message_id UUID NOT NULL, media_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_49CEEDD41A9A7125 ON chat_media_bindings (chat_id)');
        $this->addSql('CREATE INDEX IDX_49CEEDD4537A1329 ON chat_media_bindings (message_id)');
        $this->addSql('CREATE INDEX IDX_49CEEDD4EA9FDD75 ON chat_media_bindings (media_id)');
        $this->addSql('CREATE TABLE education (id UUID NOT NULL, institution_name VARCHAR(150) NOT NULL, program_name VARCHAR(150) DEFAULT NULL, degree VARCHAR(100) DEFAULT NULL, start_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, user_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_DB0A5ED29D86650F ON education (user_id_id)');
        $this->addSql('CREATE TABLE "group" (id UUID NOT NULL, name VARCHAR(100) NOT NULL, slug VARCHAR(120) DEFAULT NULL, description TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, owner_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_6DC044C57E3C61F9 ON "group" (owner_id)');
        $this->addSql('CREATE TABLE group_media_binding (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, media_id UUID NOT NULL, group_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_6D687F2EEA9FDD75 ON group_media_binding (media_id)');
        $this->addSql('CREATE INDEX IDX_6D687F2E2F68B530 ON group_media_binding (group_id_id)');
        $this->addSql('CREATE TABLE group_member (id UUID NOT NULL, role VARCHAR(255) NOT NULL, joined_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user_id_id UUID NOT NULL, group_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_A36222A89D86650F ON group_member (user_id_id)');
        $this->addSql('CREATE INDEX IDX_A36222A82F68B530 ON group_member (group_id_id)');
        $this->addSql('CREATE TABLE user_block (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, blocker_id UUID NOT NULL, blocked_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_61D96C7A548D5975 ON user_block (blocker_id)');
        $this->addSql('CREATE INDEX IDX_61D96C7A21FF5136 ON user_block (blocked_id)');
        $this->addSql('CREATE TABLE user_privacy_settings (id UUID NOT NULL, posts_visibility VARCHAR(255) NOT NULL, media_visibility VARCHAR(255) NOT NULL, friends_visibility VARCHAR(255) NOT NULL, profile_visibility VARCHAR(255) NOT NULL, groups_visibility VARCHAR(255) NOT NULL, user_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_85998D9B9D86650F ON user_privacy_settings (user_id_id)');
        $this->addSql('CREATE TABLE work_experience (id UUID NOT NULL, company VARCHAR(150) NOT NULL, position_title VARCHAR(150) DEFAULT NULL, start_at DATE NOT NULL, end_at DATE DEFAULT NULL, user_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_1EF36CD09D86650F ON work_experience (user_id_id)');
        $this->addSql('ALTER TABLE chat_media_bindings ADD CONSTRAINT FK_49CEEDD41A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_media_bindings ADD CONSTRAINT FK_49CEEDD4537A1329 FOREIGN KEY (message_id) REFERENCES message (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_media_bindings ADD CONSTRAINT FK_49CEEDD4EA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE education ADD CONSTRAINT FK_DB0A5ED29D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "group" ADD CONSTRAINT FK_6DC044C57E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_media_binding ADD CONSTRAINT FK_6D687F2EEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_media_binding ADD CONSTRAINT FK_6D687F2E2F68B530 FOREIGN KEY (group_id_id) REFERENCES "group" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT FK_A36222A89D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT FK_A36222A82F68B530 FOREIGN KEY (group_id_id) REFERENCES "group" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_block ADD CONSTRAINT FK_61D96C7A548D5975 FOREIGN KEY (blocker_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_block ADD CONSTRAINT FK_61D96C7A21FF5136 FOREIGN KEY (blocked_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_privacy_settings ADD CONSTRAINT FK_85998D9B9D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE work_experience ADD CONSTRAINT FK_1EF36CD09D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE chat_media_bindings DROP CONSTRAINT FK_49CEEDD41A9A7125');
        $this->addSql('ALTER TABLE chat_media_bindings DROP CONSTRAINT FK_49CEEDD4537A1329');
        $this->addSql('ALTER TABLE chat_media_bindings DROP CONSTRAINT FK_49CEEDD4EA9FDD75');
        $this->addSql('ALTER TABLE education DROP CONSTRAINT FK_DB0A5ED29D86650F');
        $this->addSql('ALTER TABLE "group" DROP CONSTRAINT FK_6DC044C57E3C61F9');
        $this->addSql('ALTER TABLE group_media_binding DROP CONSTRAINT FK_6D687F2EEA9FDD75');
        $this->addSql('ALTER TABLE group_media_binding DROP CONSTRAINT FK_6D687F2E2F68B530');
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT FK_A36222A89D86650F');
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT FK_A36222A82F68B530');
        $this->addSql('ALTER TABLE user_block DROP CONSTRAINT FK_61D96C7A548D5975');
        $this->addSql('ALTER TABLE user_block DROP CONSTRAINT FK_61D96C7A21FF5136');
        $this->addSql('ALTER TABLE user_privacy_settings DROP CONSTRAINT FK_85998D9B9D86650F');
        $this->addSql('ALTER TABLE work_experience DROP CONSTRAINT FK_1EF36CD09D86650F');
        $this->addSql('DROP TABLE chat_media_bindings');
        $this->addSql('DROP TABLE education');
        $this->addSql('DROP TABLE "group"');
        $this->addSql('DROP TABLE group_media_binding');
        $this->addSql('DROP TABLE group_member');
        $this->addSql('DROP TABLE user_block');
        $this->addSql('DROP TABLE user_privacy_settings');
        $this->addSql('DROP TABLE work_experience');
    }
}
