<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251127044909 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_assets (id UUID NOT NULL, file_type VARCHAR(50) NOT NULL, mime_type VARCHAR(255) DEFAULT NULL, size_byte INT DEFAULT NULL, storage_key TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, owner_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_C5A8E7507E3C61F9 ON media_assets (owner_id)');
        $this->addSql('ALTER TABLE media_assets ADD CONSTRAINT FK_C5A8E7507E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media_assets DROP CONSTRAINT FK_C5A8E7507E3C61F9');
        $this->addSql('DROP TABLE media_assets');
    }
}
