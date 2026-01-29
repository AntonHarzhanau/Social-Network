<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260128152225 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification DROP CONSTRAINT fk_bf5476ca10daf24a');
        $this->addSql('DROP INDEX idx_notif_grouping');
        $this->addSql('DROP INDEX idx_bf5476ca10daf24a');
        $this->addSql('ALTER TABLE notification DROP target');
        $this->addSql('ALTER TABLE notification DROP actor_id');
        $this->addSql('CREATE UNIQUE INDEX uniq_notif_group ON notification (recipient_id, type, group_key)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX uniq_notif_group');
        $this->addSql('ALTER TABLE notification ADD target JSONB NOT NULL');
        $this->addSql('ALTER TABLE notification ADD actor_id UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT fk_bf5476ca10daf24a FOREIGN KEY (actor_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_notif_grouping ON notification (recipient_id, type, group_key)');
        $this->addSql('CREATE INDEX idx_bf5476ca10daf24a ON notification (actor_id)');
    }
}
