import { User } from '../../src/types';

export const multiCatUser: User = {
  id: 'multi-cat-user',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  cats: [
    { name: 'Tom', subscriptionActive: true, breed: 'Tabby', pouchSize: 'C' },
    { name: 'Kit', subscriptionActive: true, breed: 'Siamese', pouchSize: 'F' },
    { name: 'Ash', subscriptionActive: false, breed: 'Manx', pouchSize: 'A' },
  ],
};

export const singleCatUser: User = {
  id: 'single-cat-user',
  firstName: 'Bob',
  lastName: 'Jones',
  email: 'bob@example.com',
  cats: [
    { name: 'Max', subscriptionActive: true, breed: 'Persian', pouchSize: 'E' },
  ],
};

export const inactiveCatsUser: User = {
  id: 'inactive-cats-user',
  firstName: 'Cara',
  lastName: 'Lee',
  email: 'cara@example.com',
  cats: [
    { name: 'Zed', subscriptionActive: false, breed: 'Bengal', pouchSize: 'B' },
  ],
};

const fixtures = new Map(
  [multiCatUser, singleCatUser, inactiveCatsUser].map((user) => [
    user.id,
    user,
  ]),
);

export const fixtureUsersService = {
  findById: (id: string): User | undefined => fixtures.get(id),
};
