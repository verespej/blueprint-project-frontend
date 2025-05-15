# TODOs

This project is very early in its lifetime. So, a couple TODOs are tracked here.

We can use repo issues when the overhead's worthwhile.


## Dev system

- Add pre-commit hook to run type checking and linting
- Add tests


## Functionality

- Assessment sections should have display orders
- Show system-assigned assessments to providers
    - Need to think through this
    - We'd probably only want to show automatically-assigned assessments that were triggered by the provider's manual assignments
- Should warn providers if assigning the same assessment relatively close in time
- Mobile UX
    - The app's currently unusable on mobile
    - Making left-menu collapsable would be a big improvement
    - Need to figure out how to do tables well on mobile or stop using them
- Providers should be able to cancel an assignment
- Patients should be able to go backwards in assessment
    - They might accidentally click an unintended response


## Security and privacy

- Proper authentication and authorization
- HTTPS (when deployed)


## Code quality

- Refactoring
    - The assessments store is really large
    - There's some redundancy - probably best to wait until there's more redundancy before generalizing

