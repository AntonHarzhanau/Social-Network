<?php

namespace Tests\Modules\User\Application\Action;

use App\Modules\User\Application\Action\DeleteAccountAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Uid\Uuid;

final class DeleteAccountActionTest extends TestCase
{
    public function testDeletesAccountWhenUserExists(): void
    {
        $repo = $this->createMock(UserRepositoryInterface::class);
        $action = new DeleteAccountAction($repo);

        $userId = Uuid::v4();
        $expectedId = $userId->toRfc4122();
        $domainUser = new User(
            $userId,
            'testuser@example.com',
            '1234',
            \DateTimeImmutable::createFromFormat('Y-m-d', '1996-08-16'),
            'Test',
        );

        $calledFindArg = null;
        $calledDeleteUser = null;
        $calledDeleteFlush = null;

        $repo->expects($this->once())
            ->method('findById')
            ->willReturnCallback(function (string $id) use (&$calledFindArg, $domainUser) {
                $calledFindArg = $id;
                return $domainUser;
            });

        $repo->expects($this->once())
            ->method('delete')
            ->willReturnCallback(function (User $u, bool $flush) use (&$calledDeleteUser, &$calledDeleteFlush): void {
                $calledDeleteUser = $u;
                $calledDeleteFlush = $flush;
            });

        // Act
        ($action)($userId);

        // Assert (явные проверки)
        $this->assertSame($expectedId, $calledFindArg);
        $this->assertSame($domainUser, $calledDeleteUser);
        $this->assertTrue($calledDeleteFlush);
    }

    public function testItThrowsWhenUserNotFound(): void
    {
        $repo = $this->createMock(UserRepositoryInterface::class);
        $action = new DeleteAccountAction($repo);

        $userId = Uuid::v4();

        $repo->expects($this->once())
            ->method('findById')
            ->with($userId->toRfc4122())
            ->willReturn(null);

        $repo->expects($this->never())
            ->method('delete');

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/^User not found\.$/');

        //Act
        ($action)($userId);
    }
}
