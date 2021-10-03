# Layout Service

## Overview

This REST service is responsbile for `room` and `object` resources, where unique objects are contained within unique rooms and no objects' bounding coordinates can intersect with anothers (ie. no two objects can touch).

For more information on the functionality exposed, see the openapi file.

Note: for any given `room` it is to be assumed that the `object` coordinates are local to their respective `room`. There is no global coordinate system.

## Tech stack

This is a backend service, written in `TypeScript 4.4`, running on `Node.js 14 a.k.a. lts/fermium`, using the `Express` framework and backed by a `PostgreSQL` database.

## Running the service

### Prerequisites

Ensure that the Postgres database you will be using has run the `setup.sql` script in the root of this project.

Additionally, ensure that the PostGIS extension is enabled! This can be done with the following command:
```
CREATE EXTENSION postgis;
```

### Running Locally

#### Install nvm, Node, and npm

Start by installing `nvm`, it will allow you to install and switch between different versions of `Node` later.

```sh
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```

Then verify that it's installed properly by running

```sh
$ nvm -v
0.37.2
```

Then select the correct version of Node for this project by running

```sh
$ nvm use
```

This will read the `.nvmrc` file in this repo and select the correct version. If it is not installed, you will have to install it first using
the instructions provided by the command above and run `nvm use` again. Something like

```sh
$ nvm install lts/fermium
```

Now your environment should be good to go.

#### Install dependencies

```sh
$ npm install
```

#### Start the service

To start the service, execute the following command, substituting the environment variable values:
```sh
PORT=<_> POSTGRES_HOST=<_> POSTGRES_PORT=<_> POSTGRES_DB=<_> POSTGRES_USER=<_> POSTGRES_PASSWORD=<_> npm run start:dev
```

Note: All environment variables are required, the service will not start without them.