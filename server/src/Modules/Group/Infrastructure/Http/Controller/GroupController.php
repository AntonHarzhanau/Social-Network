<?php

namespace App\Modules\Group\Infrastructure\Http\Controller;

use App\Modules\Group\Application\Action\ChangeMemberRoleAction;
use App\Modules\Group\Application\Action\ChangeMemberStatusAction;
use App\Modules\Group\Application\Action\CreateGroupAction;
use App\Modules\Group\Application\Action\DeleteGroupAction;
use App\Modules\Group\Application\Action\DeleteGroupMemberAction;
use App\Modules\Group\Application\Action\GetGroupDetailsAction;
use App\Modules\Group\Application\Action\GetGroupListAction;
use App\Modules\Group\Application\Action\GetMembersList;
use App\Modules\Group\Application\Action\LeaveGroupAction;
use App\Modules\Group\Application\Action\SetGroupAvatarAction;
use App\Modules\Group\Application\Action\SubscribeGroupAction;
use App\Modules\Group\Application\Action\UpdateGroupAction;
use App\Modules\Group\Infrastructure\Http\Request\CreateGroupRequest;
use App\Modules\Group\Infrastructure\Http\Request\SetGroupAvatarRequest;
use App\Modules\Group\Infrastructure\Http\Request\UpdateGroupRequest;
use App\Modules\Group\Infrastructure\Http\Request\UpdateMemberRoleRequest;
use App\Modules\Group\Infrastructure\Http\Request\UpdateMemberStatusRequest;
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
    public function __construct()
    {
    }

    #[Route('', name: 'add_group', methods: ['POST'], format: 'json')]
    public function addGroup(
        #[CurrentUser()] User $currentUser,
        #[MapRequestPayload()] CreateGroupRequest $request,
        CreateGroupAction $action,
    ): JsonResponse {
        $id = $action->execute($currentUser->getId(), $request->name, $request->visibility);
        return $this->json(['id' => $id], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{groupId}', name: 'delete_group', methods: ['DELETE'], format: 'json')]
    public function deleteGroup(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        DeleteGroupAction $action,
    ): JsonResponse {
        $action->execute($currentUser->getId(), Uuid::fromString($groupId));
        return $this->json([], JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('', name: 'get_groups', methods: ['GET'], format: 'json')]
    public function getList(
        Request $request,
        #[CurrentUser()] User $currentUser,
        GetGroupListAction $action,
    ): JsonResponse {
        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);
        $search = $request->query->getString('groupName', '');
        $filter = $request->query->get('filter', '');
        $groups = $action->execute($currentUser->getId(), $page, $limit, $search, $filter);
        return $this->json($groups, JsonResponse::HTTP_OK);
    }

    #[Route('/{groupId}', name: 'get_group', methods: ['GET'], format: 'json')]
    public function getDetails(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        GetGroupDetailsAction $action,
    ): JsonResponse {
        $group = $action->execute($currentUser->getId(), Uuid::fromString($groupId));
        return $this->json($group, JsonResponse::HTTP_OK);
    }

    #[Route('/{groupId}', name: 'update_group', methods: ['PUT'], format: 'json')]
    public function update(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        #[MapRequestPayload()] UpdateGroupRequest $request,
        UpdateGroupAction $action,
    ): JsonResponse {

        $id = $action->execute(Uuid::fromString($groupId), $currentUser->getId(), $request);
        return $this->json(['id' => $id], JsonResponse::HTTP_OK);
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
        return $this->json([], JsonResponse::HTTP_OK);
    }

    #[Route('/{groupId}/leave', name: 'leave_group', methods: ['POST'], format: 'json')]
    public function leave(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        LeaveGroupAction $action,
    ): JsonResponse {
        try {
            $action->execute($currentUser->getId(), Uuid::fromString($groupId));
        } catch (\DomainException $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_CONFLICT);
        }
        return $this->json([], JsonResponse::HTTP_OK);
    }

    #[Route('/{groupId}/avatar', name: 'set_group_avatar', methods: ['POST'], format: 'json')]
    public function setAvatar(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        #[MapRequestPayload()] SetGroupAvatarRequest $request,
        SetGroupAvatarAction $action,
    ): JsonResponse {
        $response = $action->execute(Uuid::fromString($groupId), $request->avatarId ? Uuid::fromString($request->avatarId) : null, $currentUser->getId());
        return $this->json($response, JsonResponse::HTTP_OK);
    }

    #[Route('/members/{memberId}/status', name: 'change_member_status', methods: ['PUT'], format: 'json')]
    public function changeMemberStatus(
        string $memberId,
        #[MapRequestPayload()] UpdateMemberStatusRequest $request,
        #[CurrentUser()] User $currentUser,
        ChangeMemberStatusAction $action,

    ): JsonResponse {
        $action->execute(
            Uuid::fromString($memberId),
            $request->newStatus,
            $currentUser->getId()
        );
        return $this->json([], JsonResponse::HTTP_OK);
    }

    #[Route('/members/{memberId}/role', methods: ['PUT'], format: 'json')]
    public function changeMemberRole(
        string $memberId,
        #[MapRequestPayload()] UpdateMemberRoleRequest $request,
        #[CurrentUser()] User $currentUser,
        ChangeMemberRoleAction $action,
    ): JsonResponse {
        $action->execute(
            Uuid::fromString($memberId),
            $request->newRole,
            $currentUser->getId()
        );
        return $this->json([], JsonResponse::HTTP_OK);
    }

    #[Route('/{groupId}/members', name: 'get_group_members', methods: ['GET'], format: 'json')]
    public function getMembersList(
        string $groupId,
        #[CurrentUser()] User $currentUser,
        Request $request,
        GetMembersList $action,
    ): JsonResponse {
        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);
        $name = $request->query->getString('name', '');

        $status = $request->query->getString('status', 'accepted');
        $status = trim($status);
        $status = $status === '' ? null : $status;

        $members = $action->execute(
            Uuid::fromString($groupId),
            $status,
            $currentUser->getId(),
            $page,
            $limit,
            $name,
        );
        return $this->json($members, JsonResponse::HTTP_OK);
    }

    #[Route('/members/{memberId}', name: 'delete_group_member', methods: ['DELETE'], format: 'json')]
    public function deleteMember(
        string $memberId,
        #[CurrentUser()] User $currentUser,
        DeleteGroupMemberAction $action,
    ): JsonResponse {
        $action->execute($currentUser->getId(), Uuid::fromString($memberId));
        return $this->json([], JsonResponse::HTTP_OK);
    }
}
