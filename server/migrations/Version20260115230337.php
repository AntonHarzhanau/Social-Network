<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260115230337 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "group" ADD current_avatar_id UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE "group" ADD current_cover_id UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE "group" DROP avatar_url');
        $this->addSql('ALTER TABLE "group" DROP cover_url');
        $this->addSql('ALTER TABLE "group" ADD CONSTRAINT FK_6DC044C55D1E8ABC FOREIGN KEY (current_avatar_id) REFERENCES media_asset (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "group" ADD CONSTRAINT FK_6DC044C5F5F5CC3 FOREIGN KEY (current_cover_id) REFERENCES media_asset (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6DC044C55D1E8ABC ON "group" (current_avatar_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6DC044C5F5F5CC3 ON "group" (current_cover_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "group" DROP CONSTRAINT FK_6DC044C55D1E8ABC');
        $this->addSql('ALTER TABLE "group" DROP CONSTRAINT FK_6DC044C5F5F5CC3');
        $this->addSql('DROP INDEX UNIQ_6DC044C55D1E8ABC');
        $this->addSql('DROP INDEX UNIQ_6DC044C5F5F5CC3');
        $this->addSql('ALTER TABLE "group" ADD avatar_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "group" ADD cover_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "group" DROP current_avatar_id');
        $this->addSql('ALTER TABLE "group" DROP current_cover_id');
    }
}
