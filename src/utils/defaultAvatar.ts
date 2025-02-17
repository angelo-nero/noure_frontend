export const getDefaultAvatar = (username: string) => {
    // Use a default avatar service like UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
}; 