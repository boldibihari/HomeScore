export class LoginResponse {
  isSuccessfulLogin!: boolean;
  userId!: string;
  userName!: string;
  token!: string;
  expiration: Date = new Date();
  error!: string;
}
