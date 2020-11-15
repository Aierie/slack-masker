# slack-masker
Prototype for adding html files to a git repo based on user input from slack

# What it does
1. Open a modal using shortcuts
    - ![Shortcuts menu with trigger highlighted](shortcut%20trigger.png)
    - ![Modal with inputs for report name and link](modal.png)
2. Submit info:
   - Everything's ok - no duplicates, report name can become valid url:
     - 
   - Duplicate or can't make valid url:
     - ![Modal with invalid input](bad%20input.png)
     - ![Failure message](failure%20message.png)