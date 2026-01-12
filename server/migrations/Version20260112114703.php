<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260112114703 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE wall_posts (id UUID NOT NULL, kind VARCHAR(20) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, quote TEXT DEFAULT NULL, wall_id UUID NOT NULL, post_id UUID NOT NULL, actor_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_C4F207D0C33923F1 ON wall_posts (wall_id)');
        $this->addSql('CREATE INDEX IDX_C4F207D04B89032C ON wall_posts (post_id)');
        $this->addSql('CREATE INDEX IDX_C4F207D010DAF24A ON wall_posts (actor_id)');
        $this->addSql('CREATE INDEX idx_wall_posts_wall_created_at ON wall_posts (wall_id, created_at)');
        $this->addSql('CREATE INDEX idx_wall_posts_created_at ON wall_posts (created_at)');
        $this->addSql('CREATE TABLE walls (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('ALTER TABLE wall_posts ADD CONSTRAINT FK_C4F207D0C33923F1 FOREIGN KEY (wall_id) REFERENCES walls (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE wall_posts ADD CONSTRAINT FK_C4F207D04B89032C FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE wall_posts ADD CONSTRAINT FK_C4F207D010DAF24A FOREIGN KEY (actor_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "group" ADD wall_id UUID NOT NULL');
        $this->addSql('ALTER TABLE "group" ADD CONSTRAINT FK_6DC044C5C33923F1 FOREIGN KEY (wall_id) REFERENCES walls (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6DC044C5C33923F1 ON "group" (wall_id)');
        $this->addSql('ALTER TABLE post DROP comment_count');
        $this->addSql('ALTER TABLE "user" ADD wall_id UUID NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649C33923F1 FOREIGN KEY (wall_id) REFERENCES walls (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649C33923F1 ON "user" (wall_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE wall_posts DROP CONSTRAINT FK_C4F207D0C33923F1');
        $this->addSql('ALTER TABLE wall_posts DROP CONSTRAINT FK_C4F207D04B89032C');
        $this->addSql('ALTER TABLE wall_posts DROP CONSTRAINT FK_C4F207D010DAF24A');
        $this->addSql('DROP TABLE wall_posts');
        $this->addSql('DROP TABLE walls');
        $this->addSql('ALTER TABLE "group" DROP CONSTRAINT FK_6DC044C5C33923F1');
        $this->addSql('DROP INDEX UNIQ_6DC044C5C33923F1');
        $this->addSql('ALTER TABLE "group" DROP wall_id');
        $this->addSql('ALTER TABLE post ADD comment_count INT NOT NULL');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649C33923F1');
        $this->addSql('DROP INDEX UNIQ_8D93D649C33923F1');
        $this->addSql('ALTER TABLE "user" DROP wall_id');
    }
}
