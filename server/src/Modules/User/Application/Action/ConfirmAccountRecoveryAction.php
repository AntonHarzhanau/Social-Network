<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Infrastructure\Persistence\Doctrine\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\UriSigner;

final class ConfirmAccountRecoveryAction
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UriSigner $uriSigner,
    ) {}

    public function __invoke(Request $request): void
    {
        if (!$this->uriSigner->checkRequest($request)) {
            throw new \InvalidArgumentException('Invalid signature.');
        }

        $expires = (int) $request->query->get('expires', '0');
        if ($expires < time()) {
            throw new \InvalidArgumentException('Token expired.');
        }

        $id = (string) $request->query->get('id', '');
        $deleted = (int) $request->query->get('deleted', '0');

        if ($id === '' || $deleted === 0) {
            throw new \InvalidArgumentException('Invalid token payload.');
        }
        
        $user = $this->userRepository->findOneBy(['id' => $id]);
        if ($user === null || $user->getDeletedAt() === null) {
            // throw new \InvalidArgumentException('Invalid token');
            throw new \InvalidArgumentException('User not found or not deleted.');
        }

        if ($user->getDeletedAt()->getTimestamp() !== $deleted) {
            // throw new \InvalidArgumentException('Invalid token');
            throw new \InvalidArgumentException('Token payload does not match user data.');
        }

        $user->setDeletedAt(null);
        $this->userRepository->save($user);
    }
}
