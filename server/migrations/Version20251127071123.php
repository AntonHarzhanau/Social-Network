<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251127071123 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_asset (id UUID NOT NULL, file_type VARCHAR(255) NOT NULL, mime_type VARCHAR(255) DEFAULT NULL, size_byte INT DEFAULT NULL, storage_key TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, owner_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_1DB69EED7E3C61F9 ON media_asset (owner_id)');
        $this->addSql('CREATE TABLE post_media_bindings (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, post_id UUID NOT NULL, media_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_DB9953A94B89032C ON post_media_bindings (post_id)');
        $this->addSql('CREATE INDEX IDX_DB9953A9EA9FDD75 ON post_media_bindings (media_id)');
        $this->addSql('CREATE TABLE user_media_bindings (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, owner_id UUID NOT NULL, media_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_34BDBC907E3C61F9 ON user_media_bindings (owner_id)');
        $this->addSql('CREATE INDEX IDX_34BDBC90EA9FDD75 ON user_media_bindings (media_id)');
        $this->addSql('ALTER TABLE media_asset ADD CONSTRAINT FK_1DB69EED7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_media_bindings ADD CONSTRAINT FK_DB9953A94B89032C FOREIGN KEY (post_id) REFERENCES post (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_media_bindings ADD CONSTRAINT FK_DB9953A9EA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_media_bindings ADD CONSTRAINT FK_34BDBC907E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_media_bindings ADD CONSTRAINT FK_34BDBC90EA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE media_assets DROP CONSTRAINT fk_c5a8e7507e3c61f9');
        $this->addSql('DROP TABLE media_assets');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_assets (id UUID NOT NULL, file_type VARCHAR(50) NOT NULL, mime_type VARCHAR(255) DEFAULT NULL, size_byte INT DEFAULT NULL, storage_key TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, owner_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX idx_c5a8e7507e3c61f9 ON media_assets (owner_id)');
        $this->addSql('ALTER TABLE media_assets ADD CONSTRAINT fk_c5a8e7507e3c61f9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media_asset DROP CONSTRAINT FK_1DB69EED7E3C61F9');
        $this->addSql('ALTER TABLE post_media_bindings DROP CONSTRAINT FK_DB9953A94B89032C');
        $this->addSql('ALTER TABLE post_media_bindings DROP CONSTRAINT FK_DB9953A9EA9FDD75');
        $this->addSql('ALTER TABLE user_media_bindings DROP CONSTRAINT FK_34BDBC907E3C61F9');
        $this->addSql('ALTER TABLE user_media_bindings DROP CONSTRAINT FK_34BDBC90EA9FDD75');
        $this->addSql('DROP TABLE media_asset');
        $this->addSql('DROP TABLE post_media_bindings');
        $this->addSql('DROP TABLE user_media_bindings');
    }
}
