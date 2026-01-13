<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260112221543 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE chat (id UUID NOT NULL, type VARCHAR(255) NOT NULL, title VARCHAR(100) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, avatar_url TEXT DEFAULT NULL, created_by_id UUID NOT NULL, last_message_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_659DF2AAB03A8386 ON chat (created_by_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_659DF2AABA0E79C3 ON chat (last_message_id)');
        $this->addSql('CREATE TABLE chat_media_bindings (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, chat_id UUID NOT NULL, message_id UUID NOT NULL, media_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_49CEEDD41A9A7125 ON chat_media_bindings (chat_id)');
        $this->addSql('CREATE INDEX IDX_49CEEDD4537A1329 ON chat_media_bindings (message_id)');
        $this->addSql('CREATE INDEX IDX_49CEEDD4EA9FDD75 ON chat_media_bindings (media_id)');
        $this->addSql('CREATE TABLE chat_participant (id UUID NOT NULL, role VARCHAR(255) NOT NULL, is_muted BOOLEAN NOT NULL, last_read_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, joined_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, chat_id UUID NOT NULL, user_id UUID NOT NULL, last_read_message_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_E8ED9C891A9A7125 ON chat_participant (chat_id)');
        $this->addSql('CREATE INDEX IDX_E8ED9C89A76ED395 ON chat_participant (user_id)');
        $this->addSql('CREATE INDEX IDX_E8ED9C89384BCFBF ON chat_participant (last_read_message_id)');
        $this->addSql('CREATE TABLE comment (id UUID NOT NULL, like_count INT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, author_id UUID NOT NULL, thread_id UUID NOT NULL, parent_comment_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_9474526CF675F31B ON comment (author_id)');
        $this->addSql('CREATE INDEX IDX_9474526CE2904019 ON comment (thread_id)');
        $this->addSql('CREATE INDEX IDX_9474526CBF2AF943 ON comment (parent_comment_id)');
        $this->addSql('CREATE TABLE comment_user (comment_id UUID NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (comment_id, user_id))');
        $this->addSql('CREATE INDEX IDX_ABA574A5F8697D13 ON comment_user (comment_id)');
        $this->addSql('CREATE INDEX IDX_ABA574A5A76ED395 ON comment_user (user_id)');
        $this->addSql('CREATE TABLE comment_thread (id UUID NOT NULL, comment_count INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE TABLE direct_chat (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user1_id UUID NOT NULL, user2_id UUID NOT NULL, chat_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_3451526356AE248B ON direct_chat (user1_id)');
        $this->addSql('CREATE INDEX IDX_34515263441B8B65 ON direct_chat (user2_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_user_pair ON direct_chat (user1_id, user2_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_direct_chat ON direct_chat (chat_id)');
        $this->addSql('CREATE TABLE education (id UUID NOT NULL, institution_name VARCHAR(150) NOT NULL, program_name VARCHAR(150) DEFAULT NULL, degree VARCHAR(100) DEFAULT NULL, start_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, user_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_DB0A5ED29D86650F ON education (user_id_id)');
        $this->addSql('CREATE TABLE email_verification (id UUID NOT NULL, token_hash TEXT NOT NULL, sent_email VARCHAR(255) NOT NULL, ip VARCHAR(30) DEFAULT NULL, user_agent TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, consumed_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, user_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_FE22358A76ED395 ON email_verification (user_id)');
        $this->addSql('CREATE INDEX idx_ev_user_expires ON email_verification (user_id, expires_at)');
        $this->addSql('CREATE UNIQUE INDEX uniq_ev_token_hash ON email_verification (token_hash)');
        $this->addSql('CREATE TABLE friendship (id UUID NOT NULL, status VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, requester_id UUID NOT NULL, addressee_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_7234A45FED442CF4 ON friendship (requester_id)');
        $this->addSql('CREATE INDEX IDX_7234A45F2261B4C3 ON friendship (addressee_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_friendship_request ON friendship (requester_id, addressee_id)');
        $this->addSql('CREATE TABLE "group" (id UUID NOT NULL, name VARCHAR(100) NOT NULL, slug VARCHAR(120) DEFAULT NULL, description TEXT DEFAULT NULL, avatar_url VARCHAR(255) DEFAULT NULL, subscribers_count INT DEFAULT 0 NOT NULL, cover_url VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, owner_id UUID NOT NULL, wall_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_6DC044C57E3C61F9 ON "group" (owner_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6DC044C5C33923F1 ON "group" (wall_id)');
        $this->addSql('CREATE TABLE group_media_binding (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, media_id UUID NOT NULL, group_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_6D687F2EEA9FDD75 ON group_media_binding (media_id)');
        $this->addSql('CREATE INDEX IDX_6D687F2E2F68B530 ON group_media_binding (group_id_id)');
        $this->addSql('CREATE TABLE group_member (id UUID NOT NULL, role VARCHAR(255) NOT NULL, joined_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user_id UUID NOT NULL, group_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_A36222A8A76ED395 ON group_member (user_id)');
        $this->addSql('CREATE INDEX IDX_A36222A8FE54D947 ON group_member (group_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_group_member_user_per_group ON group_member (user_id, group_id)');
        $this->addSql('CREATE TABLE media_asset (id UUID NOT NULL, like_count INT NOT NULL, file_type VARCHAR(255) NOT NULL, mime_type VARCHAR(255) DEFAULT NULL, size_byte INT DEFAULT NULL, storage_key TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, width INT DEFAULT NULL, height INT DEFAULT NULL, duration_seconds DOUBLE PRECISION DEFAULT NULL, owner_id UUID NOT NULL, comment_thread_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_1DB69EED7E3C61F9 ON media_asset (owner_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1DB69EEDBEEA14F ON media_asset (comment_thread_id)');
        $this->addSql('CREATE TABLE media_likes (media_id UUID NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (media_id, user_id))');
        $this->addSql('CREATE INDEX IDX_56D38ACCEA9FDD75 ON media_likes (media_id)');
        $this->addSql('CREATE INDEX IDX_56D38ACCA76ED395 ON media_likes (user_id)');
        $this->addSql('CREATE TABLE message (id UUID NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, sender_id UUID NOT NULL, chat_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_B6BD307FF624B39D ON message (sender_id)');
        $this->addSql('CREATE INDEX IDX_B6BD307F1A9A7125 ON message (chat_id)');
        $this->addSql('CREATE TABLE post_likes (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, post_id UUID NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX idx_post_likes_post ON post_likes (post_id)');
        $this->addSql('CREATE INDEX idx_post_likes_user ON post_likes (user_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_post_like ON post_likes (post_id, user_id)');
        $this->addSql('CREATE TABLE post_media_binding (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, post_id UUID NOT NULL, media_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_2DF00F7F4B89032C ON post_media_binding (post_id)');
        $this->addSql('CREATE INDEX IDX_2DF00F7FEA9FDD75 ON post_media_binding (media_id)');
        $this->addSql('CREATE TABLE posts (id UUID NOT NULL, content TEXT DEFAULT NULL, visibility VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL, kind VARCHAR(20) NOT NULL, quote TEXT DEFAULT NULL, like_count INT DEFAULT 0 NOT NULL, comment_count INT DEFAULT 0 NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, wall_id UUID NOT NULL, author_id UUID NOT NULL, original_post_id UUID DEFAULT NULL, comment_thread_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_885DBAFAC33923F1 ON posts (wall_id)');
        $this->addSql('CREATE INDEX IDX_885DBAFAF675F31B ON posts (author_id)');
        $this->addSql('CREATE INDEX IDX_885DBAFACD09ADDB ON posts (original_post_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_885DBAFABEEA14F ON posts (comment_thread_id)');
        $this->addSql('CREATE INDEX idx_posts_wall_created_at ON posts (wall_id, created_at)');
        $this->addSql('CREATE INDEX idx_posts_created_at ON posts (created_at)');
        $this->addSql('CREATE INDEX idx_posts_status_wall_created_at ON posts (status, wall_id, created_at)');
        $this->addSql('CREATE TABLE refresh_tokens (refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, id INT GENERATED BY DEFAULT AS IDENTITY NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9BACE7E1C74F2195 ON refresh_tokens (refresh_token)');
        $this->addSql('CREATE TABLE "user" (id UUID NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, slug VARCHAR(64) DEFAULT NULL, username VARCHAR(100) NOT NULL, avatar_url TEXT DEFAULT NULL, cover_url TEXT DEFAULT NULL, location VARCHAR(100) DEFAULT NULL, marital_status VARCHAR(30) DEFAULT NULL, date_of_birth DATE NOT NULL, bio TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_login_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, email_verified_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, current_avatar_id UUID DEFAULT NULL, wall_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D6495D1E8ABC ON "user" (current_avatar_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649C33923F1 ON "user" (wall_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON "user" (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_SLUG ON "user" (slug)');
        $this->addSql('CREATE TABLE user_avatar (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user_id UUID NOT NULL, original_id UUID NOT NULL, preview_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_73256912A76ED395 ON user_avatar (user_id)');
        $this->addSql('CREATE INDEX IDX_73256912108B7592 ON user_avatar (original_id)');
        $this->addSql('CREATE INDEX IDX_73256912CDE46FDB ON user_avatar (preview_id)');
        $this->addSql('CREATE TABLE user_block (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, blocker_id UUID NOT NULL, blocked_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_61D96C7A548D5975 ON user_block (blocker_id)');
        $this->addSql('CREATE INDEX IDX_61D96C7A21FF5136 ON user_block (blocked_id)');
        $this->addSql('CREATE TABLE user_media_binding (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, owner_id UUID NOT NULL, media_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_DC0F1C3C7E3C61F9 ON user_media_binding (owner_id)');
        $this->addSql('CREATE INDEX IDX_DC0F1C3CEA9FDD75 ON user_media_binding (media_id)');
        $this->addSql('CREATE TABLE user_privacy_settings (id UUID NOT NULL, posts_visibility VARCHAR(255) NOT NULL, media_visibility VARCHAR(255) NOT NULL, friends_visibility VARCHAR(255) NOT NULL, profile_visibility VARCHAR(255) NOT NULL, groups_visibility VARCHAR(255) NOT NULL, user_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_85998D9B9D86650F ON user_privacy_settings (user_id_id)');
        $this->addSql('CREATE TABLE walls (id UUID NOT NULL, owner_type VARCHAR(10) NOT NULL, owner_id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_wall_owner ON walls (owner_type, owner_id)');
        $this->addSql('CREATE TABLE work_experience (id UUID NOT NULL, company VARCHAR(150) NOT NULL, position_title VARCHAR(150) DEFAULT NULL, start_at DATE NOT NULL, end_at DATE DEFAULT NULL, user_id_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_1EF36CD09D86650F ON work_experience (user_id_id)');
        $this->addSql('ALTER TABLE chat ADD CONSTRAINT FK_659DF2AAB03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat ADD CONSTRAINT FK_659DF2AABA0E79C3 FOREIGN KEY (last_message_id) REFERENCES message (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_media_bindings ADD CONSTRAINT FK_49CEEDD41A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_media_bindings ADD CONSTRAINT FK_49CEEDD4537A1329 FOREIGN KEY (message_id) REFERENCES message (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_media_bindings ADD CONSTRAINT FK_49CEEDD4EA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_participant ADD CONSTRAINT FK_E8ED9C891A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_participant ADD CONSTRAINT FK_E8ED9C89A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_participant ADD CONSTRAINT FK_E8ED9C89384BCFBF FOREIGN KEY (last_read_message_id) REFERENCES message (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CF675F31B FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CE2904019 FOREIGN KEY (thread_id) REFERENCES comment_thread (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CBF2AF943 FOREIGN KEY (parent_comment_id) REFERENCES comment (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment_user ADD CONSTRAINT FK_ABA574A5F8697D13 FOREIGN KEY (comment_id) REFERENCES comment (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment_user ADD CONSTRAINT FK_ABA574A5A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE direct_chat ADD CONSTRAINT FK_3451526356AE248B FOREIGN KEY (user1_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE direct_chat ADD CONSTRAINT FK_34515263441B8B65 FOREIGN KEY (user2_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE direct_chat ADD CONSTRAINT FK_345152631A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE education ADD CONSTRAINT FK_DB0A5ED29D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE email_verification ADD CONSTRAINT FK_FE22358A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE friendship ADD CONSTRAINT FK_7234A45FED442CF4 FOREIGN KEY (requester_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE friendship ADD CONSTRAINT FK_7234A45F2261B4C3 FOREIGN KEY (addressee_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "group" ADD CONSTRAINT FK_6DC044C57E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "group" ADD CONSTRAINT FK_6DC044C5C33923F1 FOREIGN KEY (wall_id) REFERENCES walls (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_media_binding ADD CONSTRAINT FK_6D687F2EEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_media_binding ADD CONSTRAINT FK_6D687F2E2F68B530 FOREIGN KEY (group_id_id) REFERENCES "group" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT FK_A36222A8A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT FK_A36222A8FE54D947 FOREIGN KEY (group_id) REFERENCES "group" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE media_asset ADD CONSTRAINT FK_1DB69EED7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE media_asset ADD CONSTRAINT FK_1DB69EEDBEEA14F FOREIGN KEY (comment_thread_id) REFERENCES comment_thread (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE media_likes ADD CONSTRAINT FK_56D38ACCEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE media_likes ADD CONSTRAINT FK_56D38ACCA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FF624B39D FOREIGN KEY (sender_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F1A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_likes ADD CONSTRAINT FK_DED1C2924B89032C FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_likes ADD CONSTRAINT FK_DED1C292A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_media_binding ADD CONSTRAINT FK_2DF00F7F4B89032C FOREIGN KEY (post_id) REFERENCES posts (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_media_binding ADD CONSTRAINT FK_2DF00F7FEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE posts ADD CONSTRAINT FK_885DBAFAC33923F1 FOREIGN KEY (wall_id) REFERENCES walls (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE posts ADD CONSTRAINT FK_885DBAFAF675F31B FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE posts ADD CONSTRAINT FK_885DBAFACD09ADDB FOREIGN KEY (original_post_id) REFERENCES posts (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE posts ADD CONSTRAINT FK_885DBAFABEEA14F FOREIGN KEY (comment_thread_id) REFERENCES comment_thread (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D6495D1E8ABC FOREIGN KEY (current_avatar_id) REFERENCES user_avatar (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649C33923F1 FOREIGN KEY (wall_id) REFERENCES walls (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_avatar ADD CONSTRAINT FK_73256912A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_avatar ADD CONSTRAINT FK_73256912108B7592 FOREIGN KEY (original_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_avatar ADD CONSTRAINT FK_73256912CDE46FDB FOREIGN KEY (preview_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_block ADD CONSTRAINT FK_61D96C7A548D5975 FOREIGN KEY (blocker_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_block ADD CONSTRAINT FK_61D96C7A21FF5136 FOREIGN KEY (blocked_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_media_binding ADD CONSTRAINT FK_DC0F1C3C7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_media_binding ADD CONSTRAINT FK_DC0F1C3CEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_privacy_settings ADD CONSTRAINT FK_85998D9B9D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE work_experience ADD CONSTRAINT FK_1EF36CD09D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE chat DROP CONSTRAINT FK_659DF2AAB03A8386');
        $this->addSql('ALTER TABLE chat DROP CONSTRAINT FK_659DF2AABA0E79C3');
        $this->addSql('ALTER TABLE chat_media_bindings DROP CONSTRAINT FK_49CEEDD41A9A7125');
        $this->addSql('ALTER TABLE chat_media_bindings DROP CONSTRAINT FK_49CEEDD4537A1329');
        $this->addSql('ALTER TABLE chat_media_bindings DROP CONSTRAINT FK_49CEEDD4EA9FDD75');
        $this->addSql('ALTER TABLE chat_participant DROP CONSTRAINT FK_E8ED9C891A9A7125');
        $this->addSql('ALTER TABLE chat_participant DROP CONSTRAINT FK_E8ED9C89A76ED395');
        $this->addSql('ALTER TABLE chat_participant DROP CONSTRAINT FK_E8ED9C89384BCFBF');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CF675F31B');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CE2904019');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CBF2AF943');
        $this->addSql('ALTER TABLE comment_user DROP CONSTRAINT FK_ABA574A5F8697D13');
        $this->addSql('ALTER TABLE comment_user DROP CONSTRAINT FK_ABA574A5A76ED395');
        $this->addSql('ALTER TABLE direct_chat DROP CONSTRAINT FK_3451526356AE248B');
        $this->addSql('ALTER TABLE direct_chat DROP CONSTRAINT FK_34515263441B8B65');
        $this->addSql('ALTER TABLE direct_chat DROP CONSTRAINT FK_345152631A9A7125');
        $this->addSql('ALTER TABLE education DROP CONSTRAINT FK_DB0A5ED29D86650F');
        $this->addSql('ALTER TABLE email_verification DROP CONSTRAINT FK_FE22358A76ED395');
        $this->addSql('ALTER TABLE friendship DROP CONSTRAINT FK_7234A45FED442CF4');
        $this->addSql('ALTER TABLE friendship DROP CONSTRAINT FK_7234A45F2261B4C3');
        $this->addSql('ALTER TABLE "group" DROP CONSTRAINT FK_6DC044C57E3C61F9');
        $this->addSql('ALTER TABLE "group" DROP CONSTRAINT FK_6DC044C5C33923F1');
        $this->addSql('ALTER TABLE group_media_binding DROP CONSTRAINT FK_6D687F2EEA9FDD75');
        $this->addSql('ALTER TABLE group_media_binding DROP CONSTRAINT FK_6D687F2E2F68B530');
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT FK_A36222A8A76ED395');
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT FK_A36222A8FE54D947');
        $this->addSql('ALTER TABLE media_asset DROP CONSTRAINT FK_1DB69EED7E3C61F9');
        $this->addSql('ALTER TABLE media_asset DROP CONSTRAINT FK_1DB69EEDBEEA14F');
        $this->addSql('ALTER TABLE media_likes DROP CONSTRAINT FK_56D38ACCEA9FDD75');
        $this->addSql('ALTER TABLE media_likes DROP CONSTRAINT FK_56D38ACCA76ED395');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307FF624B39D');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307F1A9A7125');
        $this->addSql('ALTER TABLE post_likes DROP CONSTRAINT FK_DED1C2924B89032C');
        $this->addSql('ALTER TABLE post_likes DROP CONSTRAINT FK_DED1C292A76ED395');
        $this->addSql('ALTER TABLE post_media_binding DROP CONSTRAINT FK_2DF00F7F4B89032C');
        $this->addSql('ALTER TABLE post_media_binding DROP CONSTRAINT FK_2DF00F7FEA9FDD75');
        $this->addSql('ALTER TABLE posts DROP CONSTRAINT FK_885DBAFAC33923F1');
        $this->addSql('ALTER TABLE posts DROP CONSTRAINT FK_885DBAFAF675F31B');
        $this->addSql('ALTER TABLE posts DROP CONSTRAINT FK_885DBAFACD09ADDB');
        $this->addSql('ALTER TABLE posts DROP CONSTRAINT FK_885DBAFABEEA14F');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D6495D1E8ABC');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649C33923F1');
        $this->addSql('ALTER TABLE user_avatar DROP CONSTRAINT FK_73256912A76ED395');
        $this->addSql('ALTER TABLE user_avatar DROP CONSTRAINT FK_73256912108B7592');
        $this->addSql('ALTER TABLE user_avatar DROP CONSTRAINT FK_73256912CDE46FDB');
        $this->addSql('ALTER TABLE user_block DROP CONSTRAINT FK_61D96C7A548D5975');
        $this->addSql('ALTER TABLE user_block DROP CONSTRAINT FK_61D96C7A21FF5136');
        $this->addSql('ALTER TABLE user_media_binding DROP CONSTRAINT FK_DC0F1C3C7E3C61F9');
        $this->addSql('ALTER TABLE user_media_binding DROP CONSTRAINT FK_DC0F1C3CEA9FDD75');
        $this->addSql('ALTER TABLE user_privacy_settings DROP CONSTRAINT FK_85998D9B9D86650F');
        $this->addSql('ALTER TABLE work_experience DROP CONSTRAINT FK_1EF36CD09D86650F');
        $this->addSql('DROP TABLE chat');
        $this->addSql('DROP TABLE chat_media_bindings');
        $this->addSql('DROP TABLE chat_participant');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE comment_user');
        $this->addSql('DROP TABLE comment_thread');
        $this->addSql('DROP TABLE direct_chat');
        $this->addSql('DROP TABLE education');
        $this->addSql('DROP TABLE email_verification');
        $this->addSql('DROP TABLE friendship');
        $this->addSql('DROP TABLE "group"');
        $this->addSql('DROP TABLE group_media_binding');
        $this->addSql('DROP TABLE group_member');
        $this->addSql('DROP TABLE media_asset');
        $this->addSql('DROP TABLE media_likes');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE post_likes');
        $this->addSql('DROP TABLE post_media_binding');
        $this->addSql('DROP TABLE posts');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE user_avatar');
        $this->addSql('DROP TABLE user_block');
        $this->addSql('DROP TABLE user_media_binding');
        $this->addSql('DROP TABLE user_privacy_settings');
        $this->addSql('DROP TABLE walls');
        $this->addSql('DROP TABLE work_experience');
    }
}
