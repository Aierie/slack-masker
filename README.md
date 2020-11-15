# slack-masker
Prototype for adding html files to a git repo based on user input from slack

# What it does
1. Users can open a modal to input the name of the report they want to mask, and the link to that report.
2. After submitting the name and link, it's checked to make sure that the name converted to a slug is a valid url and not clashing with any existing reports.
  - If so, a new report is created in the git repo and the user is notified about the successful creation. TODO: add a link to the newly added page
  - Otherwise, the user is notified about why masked report creation failed.
