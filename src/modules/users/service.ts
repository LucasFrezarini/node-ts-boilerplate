import { Logger } from 'pino';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const users = [
  {
    id: 1,
    first_name: 'Lucas',
    last_name: 'Frezarini da Silva',
    email: 'lucas.frezarini@gmail.com',
  },
  {
    id: 2,
    first_name: 'Mike',
    last_name: 'The Dog',
    email: 'mikethedog@dogsdonthaveemails.com',
  },
];

export class UserService {
  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }

  public getAllUsers(): User[] {
    this.logger.info('Fetching users...');
    return users;
  }

  public getUserById(id: number): User | undefined {
    this.logger.info(`Getting user by ID: ${id}`);
    return users.find((user) => user.id === Number(id));
  }
}
