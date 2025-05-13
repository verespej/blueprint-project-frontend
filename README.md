# Blueprint project frontend

React app using Vite, Tailwind, and Zustand.

To run:
```
echo 'VITE_API_BASE_URL=http://localhost:3000' > .env.local
npm install
npm run dev
```

## TODO:

- There's some redundancy and some refactoring could be beneficial - however, better to wait until sufficient repetition versus premature optimization

## UX

1. Direct the patient through each assessment question one by one, displaying only one question at a time
2. Track each answer provided by the patient
3. Persist the answers (in the backend)

### Question display

Each page or view should display:
1. The prompt for the user (the title of the first section)
2. The assessment display_name
3. The question title
4. All answer options for the given assessment, as buttons that display the answer title as text
5. The question number out of the total number of questions in all assessments (e.g. 1 out of 8)
6. Tapping on an answer option should automatically advance the user to the next question
7. Across all screens, display a progress bar that udpates with each completed question

## Project reqs

1. Instructions for running the code locally (if not hosted)
2. Description of the problem and solution
3. Reasoning behind your technical choices
4. Describe how you would deploy this as a true production app on the platform of your choice:
    1. How would ensure the application is highly available and performs well?
    2. How would you secure it?
    3. What would you add to make it easier to troubleshoot problems while it is running live?
5. Trade-offs you might have made, anything you left out, or what you might do differently if you were to spend additional time on the project
6. Link to other code you're particularly proud of
7. Link to your resume or public profile
