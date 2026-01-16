<?php

namespace App\Modules\Group\Infrastructure\Http\Controller;

use App\Modules\Group\Application\Action\CreateGroupAction;
use App\Modules\Group\Application\Action\DeleteGroupAction;
use App\Modules\Group\Application\Action\GetAllGroupsAction;
use App\Modules\Group\Application\Action\GetOneGroupAction;
use App\Modules\Group\Application\Action\SubscribeGroupAction;
use App\Modules\Group\Infrastructure\Http\Request\CreateGroupRequest;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/groups')]
class GroupController extends AbstractController
{
    public function __construct() {}

    #[Route('', name: 'add_group', methods: ['POST'], format: 'json')]
    public function addGroup(
        #[CurrentUser()] User $currentUser,
        #[MapRequestPayload()] CreateGroupRequest $request,
        CreateGroupAction $action,
    ): JsonResponse {
        $action->execute($currentUser->getId(), $request->name);
        return $this->json([], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{groupId}', name: 'delete_group', methods: ['DELETE'], format: 'json')]
    public function deleteGroup(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        DeleteGroupAction $action,
    ): JsonResponse {
        $action->execute($currentUser->getId(), Uuid::fromString($groupId));
        return $this->json([], JsonResponse::HTTP_CREATED);
    }

    #[Route('', name: 'get_groups', methods: ['GET'], format: 'json')]
    public function getAll(
        Request $request,
        #[CurrentUser()] User $currentUser,
        GetAllGroupsAction $action,
    ): JsonResponse {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);
        $search = $request->query->getString('search', '');
        $groups = $action->execute($currentUser->getId(), $page, $limit);
        return $this->json($groups, JsonResponse::HTTP_OK);
    }

    #[Route('/{groupId}', name: 'get_group', methods: ['GET'], format: 'json')]
    public function getOne(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        GetOneGroupAction $action,
    ): JsonResponse {
        $group = $action->execute($currentUser->getId(), Uuid::fromString($groupId));
        return $this->json($group, JsonResponse::HTTP_OK);
    }

    #[Route('/{groupId}', name: 'update_group', methods: ['PUT'], format: 'json')]
    public function update(
        string $groupId,
        #[CurrentUser()] User $currentUser,
    ): JsonResponse {
        return $this->json(['error: Not implemented'], JsonResponse::HTTP_NOT_IMPLEMENTED);
    }

    #[Route('/{groupId}/subscribe', name: 'subscribe_group', methods: ['POST'], format: 'json')]
    public function subscribe(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        SubscribeGroupAction $action,
    ): JsonResponse {
        try {
            $action->execute($currentUser->getId(), Uuid::fromString($groupId));
        } catch (\DomainException $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_CONFLICT);
        }
        return $this->json([], JsonResponse::HTTP_CREATED);
    }
    
}
