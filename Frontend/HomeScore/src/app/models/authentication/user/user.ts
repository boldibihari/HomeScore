export class User {
  userId!: string;
  firstName!: string;
  lastName!: string;
  userName!: string;
  email!: string;
  emailConfirmed!: boolean;
  lockoutEnd: Date = new Date();
  lockoutEnabled!: boolean;
  accessFailedCount!: number;
  createdDate: Date = new Date();
  roles!: Array<string>;
}
