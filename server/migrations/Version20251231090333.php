<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251231090333 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_avatar (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user_id UUID NOT NULL, original_id UUID NOT NULL, preview_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_73256912A76ED395 ON user_avatar (user_id)');
        $this->addSql('CREATE INDEX IDX_73256912108B7592 ON user_avatar (original_id)');
        $this->addSql('CREATE INDEX IDX_73256912CDE46FDB ON user_avatar (preview_id)');
        $this->addSql('ALTER TABLE user_avatar ADD CONSTRAINT FK_73256912A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_avatar ADD CONSTRAINT FK_73256912108B7592 FOREIGN KEY (original_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE user_avatar ADD CONSTRAINT FK_73256912CDE46FDB FOREIGN KEY (preview_id) REFERENCES media_asset (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "user" ADD current_avatar_id UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D6495D1E8ABC FOREIGN KEY (current_avatar_id) REFERENCES user_avatar (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D6495D1E8ABC ON "user" (current_avatar_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_avatar DROP CONSTRAINT FK_73256912A76ED395');
        $this->addSql('ALTER TABLE user_avatar DROP CONSTRAINT FK_73256912108B7592');
        $this->addSql('ALTER TABLE user_avatar DROP CONSTRAINT FK_73256912CDE46FDB');
        $this->addSql('DROP TABLE user_avatar');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D6495D1E8ABC');
        $this->addSql('DROP INDEX UNIQ_8D93D6495D1E8ABC');
        $this->addSql('ALTER TABLE "user" DROP current_avatar_id');
    }
}
