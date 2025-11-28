export type MenuItem = {
    name: string;
    path: string;
}

export const MAIN_MENU: MenuItem[] = [
    { name: 'Profile', path: '/profile' },
    { name: 'Feeds', path: '/feeds' },
    { name: 'Messages', path: '/messages' },
    { name: 'Friends', path: '/friends' },
    { name: 'Groups', path: '/groups' },
    { name: 'Settings', path: '/settings' },
];
