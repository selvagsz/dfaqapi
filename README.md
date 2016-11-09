# dfaqapi
Read it as "The Fake Api" 

## Usage

```js
import DFaqApi from 'dfaqapi'
import { Factory, faker } from 'dfaqapi'

// Initialize the fake server

let faker = new Faker({
  apiPrefix: '/v1',
  factories: {
    users: Factory.extend({
      name: faker.name.findName(),
      email: faker.internet.email()
    })
  }
})

// Seed the database
faker.createList('users', 10)

// Mock the routes
faker.get('/users', (db, request) => {
  return {
    users: db.getCollection('users').data
  }
})
```
