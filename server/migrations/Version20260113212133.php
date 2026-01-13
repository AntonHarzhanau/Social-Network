<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260113212133 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post_media_binding DROP CONSTRAINT fk_2df00f7f4b89032c');
        $this->addSql('ALTER TABLE post_media_binding DROP CONSTRAINT fk_2df00f7fea9fdd75');
        $this->addSql('ALTER TABLE post_media_binding ADD CONSTRAINT FK_2DF00F7F4B89032C FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE post_media_binding ADD CONSTRAINT FK_2DF00F7FEA9FDD75 FOREIGN KEY (media_id) REFERENCES media_asset (id) ON DELETE CASCADE NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post_media_binding DROP CONSTRAINT FK_2DF00F7F4B89032C');
        $this->addSql('ALTER TABLE post_media_binding DROP CONSTRAINT FK_2DF00F7FEA9FDD75');
        $this->addSql('ALTER TABLE post_media_binding ADD CONSTRAINT fk_2df00f7f4b89032c FOREIGN KEY (post_id) REFERENCES posts (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE post_media_binding ADD CONSTRAINT fk_2df00f7fea9fdd75 FOREIGN KEY (media_id) REFERENCES media_asset (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
