# Blueprint project reqs

This doc contains responses to the requested information in the [Blueprint exercise prompt](https://github.com/blueprinthq/coding-exercise).

Be sure to also see the project [reqs write-up for the backend server](https://github.com/verespej/blueprint-project-backend/blob/main/BLUEPRINT.md). Much of the content is unique in each.


## Problem description

We work with clinicians who assign their patients standardized clinical assessments.

We need to allow patients to complete these assessments in digital form, creating a persistent record of the data.

This web app delivers the UX to fulfill these needs. It exposes various tools to care providers/clinicians and patients.

A couple items either stated or implied by the prompt:
- Clinicians can manually choose and assign assessments to patients
- A patient can complete assigned assessments and have the data recorded in persistent storage

Some explicit reqs provided directly in the exercise prompt include:
1. Assessment completion
    1. Direct the patient through each assessment question one by one
        1. Only display only one question at a time
    2. Persist the answers (in the backend)
2. Each question page or view should display:
    1. The assessment display name
    2. The prompt for the user (i.e. the title of the section)
    3. The question "title"


## Problem solution

Although the prompt is limited in scope, I found it really interesting and was having fun working on it. So, I ended up expanded it to some of the implied aspects. For example, having users, etc.

This web app provides a provider experience and a patient experience.

The provider experience allows logged-in providers to:
- View their patient caseload
- View individual patient info
- Assign their patients assessments
- View educational content (not implemented)

The patient experience allows logged-in patients to:
- View info about their providers (not implemented)
- View assigned assessments
- Complete assigned assessments
- View educational content (not implemented)


## Design choices

Here're some technical design choices and reasoning:

- **[React](https://react.dev/)**: I have a strong preference for React versus other options because of various foundational properties like JSX and composability, flexibility, etc.
- **[Vite](https://vite.dev/)**: I've found Vite to be a great build tool work with React. I've found its defaults to be low-friction. And, it's super fast, reducing wait cycles.
- **[React router](https://reactrouter.com/)**: This is what everyone uses and it gets the job done. I've been frustrated by their breaking changes and subpar migration paths in the past. But, the API's matured over time and solves the routing problem well today.
- **[Tailwind](https://tailwindcss.com/)**: I haven't used Tailwind with a large production app, so not sure how it feels at scale. But, I've found it to increase productivity in the small apps where I've used it. I'd like to become familiar with the trade-offs encountered at scale by discussing with someone who has that experience.
- **[diasyUI](https://daisyui.com/)**: Makes Tailwind more useful by providing some freebie styling. It's a productivity increaser.
- **[Zustand](https://zustand.docs.pmnd.rs/)**: Zustand's a bit more light-weight than the classic redux pattern. It provides a lot of flexibility in approach allowing one to customize patterns appropriate to the architecture of the app their building. While, I suspect it'd work fine at scale, this is another one where I don't have experience with it at scale and would benefit from being able to chat with someone who's used it at scale.

If I were to spend additional time, I'd work on items in [TODO.md](./TODO.md).

Like with the backend, I think a good next step would be working on deployment. It doesn't feel like there's much of a point to this app if it only runs locally.

There's a lot that needs to be addressed to reach an acceptable deployed state. These are the first 3 things I'd work on:

1. Deploy the app, making it accessible via the open internet
2. Address security basics like accessing via https, proper auth, etc.
3. Automate deployment

After deployment, I'd prioritize getting the app in front of actual users to get feedback. That'd drive prioritization of what to work on next.


## Production

I chose not to spend time on production because I didn't think it would provide much useful signal. I could show that I could get an app deployed, but that'd take away from time that could be spent focused on creatiung a solution for the described scenario.

If we _were_ to build a production app out of this, and reach sufficient scale, here's some stuff I'd evalute doing:

1. Add testing and coverage reports
2. Add pre-commit hooks to run linting and tests
3. Automate build, test, and deploy
4. Add metrics tooling, like Mixpanel
5. Develop KPIs and ensure we have the data to support reporting
6. Develop the ability to do dark deploys
    1. Could consider AB testing, but the scale needed to justify it is a really high bar
7. Establish channels for customers to easily report issues
8. Develop a process for launch, learn, iterate for rapid product cycles
9. Get external security and compliance review
    1. Do internal training, as needed

All of these would require evaluation of benefit, risk, and time requirement, then prioritization. Different choices are appropriate at different stages of a company's life and a product's life.


## Personal links

- Profiles:
    - [LinkedIn: verespej](https://www.linkedin.com/in/verespej/)
    - [X: hverespej](https://x.com/hverespej)
- Other code:
    - Other code worth seeing is in private repos
    - Feel free to request access and send me your github username
