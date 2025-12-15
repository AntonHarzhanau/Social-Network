<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251215001228 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE post_likes (post_id UUID NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (post_id, user_id))');
        $this->addSql('CREATE INDEX IDX_DED1C2924B89032C ON post_likes (post_id)');
        $this->addSql('CREATE INDEX IDX_DED1C292A76ED395 ON post_likes (user_id)');
        $this->addSql('ALTER TABLE post_likes ADD CONSTRAINT FK_DED1C2924B89032C FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_likes ADD CONSTRAINT FK_DED1C292A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_user DROP CONSTRAINT fk_44c6b1424b89032c');
        $this->addSql('ALTER TABLE post_user DROP CONSTRAINT fk_44c6b142a76ed395');
        $this->addSql('DROP TABLE post_user');
        $this->addSql('ALTER TABLE chat_participant DROP CONSTRAINT fk_e8ed9c89a76ed395');
        $this->addSql('ALTER TABLE chat_participant DROP CONSTRAINT fk_e8ed9c89384bcfbf');
        $this->addSql('ALTER TABLE chat_participant ADD CONSTRAINT FK_E8ED9C89A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE chat_participant ADD CONSTRAINT FK_E8ED9C89384BCFBF FOREIGN KEY (last_read_message_id) REFERENCES message (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT fk_9474526cf675f31b');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT fk_9474526c4b89032c');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT fk_9474526c727aca70');
        $this->addSql('DROP INDEX idx_9474526c727aca70');
        $this->addSql('ALTER TABLE comment RENAME COLUMN parent_id TO parent_comment_id');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CF675F31B FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C4B89032C FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CBF2AF943 FOREIGN KEY (parent_comment_id) REFERENCES comment (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_9474526CBF2AF943 ON comment (parent_comment_id)');
        $this->addSql('ALTER TABLE email_verification ADD user_id UUID NOT NULL');
        $this->addSql('ALTER TABLE email_verification ADD CONSTRAINT FK_FE22358A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_FE22358A76ED395 ON email_verification (user_id)');
        $this->addSql('CREATE INDEX idx_ev_user_expires ON email_verification (user_id, expires_at)');
        $this->addSql('CREATE UNIQUE INDEX uniq_ev_token_hash ON email_verification (token_hash)');
        $this->addSql('ALTER TABLE media_asset DROP CONSTRAINT fk_1db69eed7e3c61f9');
        $this->addSql('ALTER TABLE media_asset ADD CONSTRAINT FK_1DB69EED7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_SLUG ON "user" (slug)');
        $this->addSql('ALTER TABLE user_media_binding DROP CONSTRAINT fk_dc0f1c3c7e3c61f9');
        $this->addSql('ALTER TABLE user_media_binding DROP CONSTRAINT fk_dc0f1c3cea9fdd75');
        $this->addSql('ALTER TABLE user_media_binding ADD CONSTRAINT FK_DC0F1C3C7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_media_binding ADD CONSTRAINT FK_DC0F1C3CEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) ON DELETE CASCADE NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE post_user (post_id UUID NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (post_id, user_id))');
        $this->addSql('CREATE INDEX idx_44c6b1424b89032c ON post_user (post_id)');
        $this->addSql('CREATE INDEX idx_44c6b142a76ed395 ON post_user (user_id)');
        $this->addSql('ALTER TABLE post_user ADD CONSTRAINT fk_44c6b1424b89032c FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE post_user ADD CONSTRAINT fk_44c6b142a76ed395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE post_likes DROP CONSTRAINT FK_DED1C2924B89032C');
        $this->addSql('ALTER TABLE post_likes DROP CONSTRAINT FK_DED1C292A76ED395');
        $this->addSql('DROP TABLE post_likes');
        $this->addSql('ALTER TABLE chat_participant DROP CONSTRAINT FK_E8ED9C89A76ED395');
        $this->addSql('ALTER TABLE chat_participant DROP CONSTRAINT FK_E8ED9C89384BCFBF');
        $this->addSql('ALTER TABLE chat_participant ADD CONSTRAINT fk_e8ed9c89a76ed395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE chat_participant ADD CONSTRAINT fk_e8ed9c89384bcfbf FOREIGN KEY (last_read_message_id) REFERENCES message (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CF675F31B');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526C4B89032C');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CBF2AF943');
        $this->addSql('DROP INDEX IDX_9474526CBF2AF943');
        $this->addSql('ALTER TABLE comment RENAME COLUMN parent_comment_id TO parent_id');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT fk_9474526cf675f31b FOREIGN KEY (author_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT fk_9474526c4b89032c FOREIGN KEY (post_id) REFERENCES post (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT fk_9474526c727aca70 FOREIGN KEY (parent_id) REFERENCES comment (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_9474526c727aca70 ON comment (parent_id)');
        $this->addSql('ALTER TABLE email_verification DROP CONSTRAINT FK_FE22358A76ED395');
        $this->addSql('DROP INDEX IDX_FE22358A76ED395');
        $this->addSql('DROP INDEX idx_ev_user_expires');
        $this->addSql('DROP INDEX uniq_ev_token_hash');
        $this->addSql('ALTER TABLE email_verification DROP user_id');
        $this->addSql('ALTER TABLE media_asset DROP CONSTRAINT FK_1DB69EED7E3C61F9');
        $this->addSql('ALTER TABLE media_asset ADD CONSTRAINT fk_1db69eed7e3c61f9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP INDEX UNIQ_IDENTIFIER_SLUG');
        $this->addSql('ALTER TABLE user_media_binding DROP CONSTRAINT FK_DC0F1C3C7E3C61F9');
        $this->addSql('ALTER TABLE user_media_binding DROP CONSTRAINT FK_DC0F1C3CEA9FDD75');
        $this->addSql('ALTER TABLE user_media_binding ADD CONSTRAINT fk_dc0f1c3c7e3c61f9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_media_binding ADD CONSTRAINT fk_dc0f1c3cea9fdd75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
