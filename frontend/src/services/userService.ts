import { getAuth } from "firebase/auth";

export interface UserProfile {
  id: string;
  displayName: string;
}

export class UserService {
  private static instance: UserService;
  private userNameCache = new Map<string, string>();

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUserDisplayName(
    userId: string,
    currentUserId?: string | null,
  ): Promise<string> {
    if (this.userNameCache.has(userId)) {
      return this.userNameCache.get(userId)!;
    }

    const displayName: string =
      userId === currentUserId
        ? (() => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            return (
              currentUser?.displayName || currentUser?.email || "You"
            );
          })()
        : "Anonymous User";

    this.userNameCache.set(userId, displayName);
    return displayName;
  }

  async getUserDisplayNames(
    userIds: string[],
    currentUserId?: string | null,
  ): Promise<Record<string, string>> {
    const uniqueIds = [...new Set(userIds)];
    const entries = await Promise.all(
      uniqueIds.map(async (id) => {
        const name = await this.getUserDisplayName(id, currentUserId);
        return [id, name] as const;
      }),
    );
    return Object.fromEntries(entries);
  }

  clearCache(): void {
    this.userNameCache.clear();
  }
}

export const userService = UserService.getInstance();
