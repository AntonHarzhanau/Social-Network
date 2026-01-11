<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260111150752 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_likes (media_id UUID NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (media_id, user_id))');
        $this->addSql('CREATE INDEX IDX_56D38ACCEA9FDD75 ON media_likes (media_id)');
        $this->addSql('CREATE INDEX IDX_56D38ACCA76ED395 ON media_likes (user_id)');
        $this->addSql('ALTER TABLE media_likes ADD CONSTRAINT FK_56D38ACCEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE media_likes ADD CONSTRAINT FK_56D38ACCA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE media_asset ADD like_count INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media_likes DROP CONSTRAINT FK_56D38ACCEA9FDD75');
        $this->addSql('ALTER TABLE media_likes DROP CONSTRAINT FK_56D38ACCA76ED395');
        $this->addSql('DROP TABLE media_likes');
        $this->addSql('ALTER TABLE media_asset DROP like_count');
    }
}
