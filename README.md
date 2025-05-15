# Blooprint web app

The Blooprint web app.

![Screenshot 2025-05-14 at 8 50 39 PM](https://github.com/user-attachments/assets/3db12a16-c1bc-4a3f-b46d-ee0e8fbee7a5)


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

![Screenshot 2025-05-14 at 8 51 14 PM](https://github.com/user-attachments/assets/5c161de4-2373-4aed-b4e5-b86f172cd1c6)


### Seed data

The backend setup includes seeding the DB with data. You can find login credentials for a provider user and a patient user in the seed script.

Use the credentials to log in.

![Screenshot 2025-05-14 at 8 51 07 PM](https://github.com/user-attachments/assets/55b18a40-71e7-4a5d-9ea6-288e48108a00)

Once logged in, you can browse around. You'll find an assignment populated by the seed data.

![Screenshot 2025-05-14 at 8 50 48 PM](https://github.com/user-attachments/assets/bbcd13a6-ecd7-4278-ad2c-2aad98683102)

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
