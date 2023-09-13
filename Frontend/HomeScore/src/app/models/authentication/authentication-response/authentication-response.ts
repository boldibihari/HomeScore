export class AuthenticationResponse {
  isUserAuthenticated: boolean;
  isUserAdmin: boolean;
  userId: string;
  userName: string;

  constructor(isUserAuthenticated: boolean, isUserAdmin: boolean, userId: string, userName: string) {
    this.isUserAuthenticated = isUserAuthenticated;
    this.isUserAdmin = isUserAdmin;
    this.userId = userId;
    this.userName = userName;
  }
}
