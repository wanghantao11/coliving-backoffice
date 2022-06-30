# Coliving-backoffice

Coliving backoffice service.

## Dependencies

- Install Docker.
- Start local DB instance with command `docker-compose up` (Skip this if you have done it). This will start a postgres DB instance with all table schemas you need for local development.
- If instance could not be initiated for some reason(schema conflicts), try `docker-compose rm` and then `docker-compose up` again.

## File structure

src <br />
│   app.ts          # App entry point <br />
└───application     # Application of the app <br />
    └───controllers # Controllers of the endpoints <br />
    └───firebase    # Firebase base classes <br />
    └───middleware  # Generic auth and data validators <br />
    └───services    # All of the business logic <br />
└───domain          # Event handlers for async <br />
    └───dao         # DB function interfaces <br />
    └───entity      # DB entities <br />
    └───repository  # DB function implementations <br />
└───infrastructure  # Infrastructure of the app <br />
    └───persistence # Generic infra classes <br />
    └───utils       # Util functions of the app <br />
└───types           # Type declaration files (d.ts) for Typescript <br />
test <br />
│   index.ts        # Test entry point <br />
└───integration     # intergration tests <br />
└───unit            # unit tests <br />


## Running Locally

1. Clone this repo.
2. Copy .env.example into .env in the root folder. Update values.
3. Use `yarn install` to install all the dependencies.
4. Use `yarn dev` to start service locally.
4. Optionally, if you want some testing data to be pre-populated in the local db, simply run `yarn fixture:load`.
5. Install redis: `brew install redis`, `brew services start redis`

## Test
1. A separate postgres database called colive_backoffice_test is used for running the tests locally and in circleCI.
2. When developing make sure the NODE_ENV is set to development(which already should be configured in package.json) and then the development database will be used.
3. When testing make sure the NODE_ENV is set to test and then the test database will be used.

## Firebase
1. We are using firebase only to upload images for different situations. 
2. We might change to other service to upload and store images in the future and completely go away from firebase.

## Documentation
1. Run `yarn doc` to generate static documentation site in `/docs/`.
2. Open `index.html` locally.

## Migrations
1. A relativaly complete documentation can be found [HERE](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md)

## API docs
Internal API docs can be accessed from http://localhost:8080/api-docs/swagger
