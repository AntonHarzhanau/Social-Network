<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260130061330 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ALTER marital_status TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE user_privacy_settings DROP CONSTRAINT fk_85998d9b9d86650f');
        $this->addSql('DROP INDEX uniq_85998d9b9d86650f');
        $this->addSql('ALTER TABLE user_privacy_settings RENAME COLUMN user_id_id TO user_id');
        $this->addSql('ALTER TABLE user_privacy_settings ADD CONSTRAINT FK_85998D9BA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_85998D9BA76ED395 ON user_privacy_settings (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ALTER marital_status TYPE VARCHAR(30)');
        $this->addSql('ALTER TABLE user_privacy_settings DROP CONSTRAINT FK_85998D9BA76ED395');
        $this->addSql('DROP INDEX UNIQ_85998D9BA76ED395');
        $this->addSql('ALTER TABLE user_privacy_settings RENAME COLUMN user_id TO user_id_id');
        $this->addSql('ALTER TABLE user_privacy_settings ADD CONSTRAINT fk_85998d9b9d86650f FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX uniq_85998d9b9d86650f ON user_privacy_settings (user_id_id)');
    }
}
