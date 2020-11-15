Environment variables from slack
1. The channel name for the app to post updates (variable name: CLIENT_OPS_CHANNEL)

Environment variables from slack app
1. Set up a slack app
2. Install the app in your workspace so you can get a bot token (variable name: SLACK_BOT_TOKEN)
3. Copy the slack signing secret and bot token (variable name: SLACK_SIGNING_SECRET)

Environment variables from github
1. Get a github access token by following the instructions here (variable name: GITHUB_ACCESS_TOKEN):  https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token
2. Get the repo name (variable name: GIT_REPO), repo owner name (variable name: GIT_REPO_OWNER), the branch to edit (variable name: GIT_BRANCH), the directory to edit (variable name: REPORT_DIR)

Local development
1. Add appropriate variables to .env
2. Run sls offline start
3. Use ngrok targeting port 3000
4. Update the slack app to direct interactive messages to the endpoint on the ngrok url
5. You should be able to run the slack app as in [app-usage.md](app-usage.md)