# Blooprint web app

The Blooprint web app.


## Getting started

You need to have node.js installed. This app was built and tested using v23. It likely works with other versions, but that hasn't been tested.

First, clone the project and install its dependencies:
```
git clone https://github.com/verespej/blueprint-project-frontend.git
cd blueprint-project-frontend
npm install
```

The app can't do anything without the backend, so follow the instructions to run the [Blooprint backend](https://github.com/verespej/blueprint-project-backend/) before proceeding.

Once the backend is up and running, create a config file that tells the app how to reach the backend:
```
echo 'VITE_API_BASE_URL=http://localhost:3000' > .env.local
```

Update the `http://localhost:3000` URL above to whatever the bakend is listening on.

And, finally, you can run the app:
```
npm run dev
```

You should see something similar to the following once the server starts:
```
  VITE v6.3.5  ready in 524 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

You can now open the home page of the app by visiting http://localhost:5173.

TODO: Image


### Seed data

The backend setup includes seeding the DB with data. You can find login credentials for a provider user and a patient user in the seed script.

Use the credentials to log in.

TODO: Image

Once logged in, you can browse around. You'll find an assignment populated by the seed data.

TODO: Image

There're different features for providers and patients. Log in with both so see what's available to each user type.


## Development

The app live reloads as you make changes to the code.

Make sure to run type checking and linting as you develop:
```
npm run typecheck
npm run lint
```


## Blueprint exercise

See [BLUEPRINT.md](./BLUEPRINT.md).
