const fetch = require("node-fetch");
const { createHmac } = require("crypto");

module.exports = {
  slackRequest,
  reportCreationFailed,
  reportCreationSuccessful,
  openModal,
  getTextInputValue,
  authSlack,
};

function authSlack(event) {
  let { body } = event;
  const { headers } = event;

  if (body && body.constructor == Object) body = JSON.stringify(body);
  const slackSecret = process.env.SLACK_SIGNING_SECRET;
  const slackSignature = headers["X-Slack-Signature"];
  const timestamp = headers["X-Slack-Request-Timestamp"];
  const sigBasestring = "v0:" + timestamp + ":" + body;
  const computedSignature =
    "v0=" +
    createHmac("sha256", slackSecret).update(sigBasestring).digest("hex");
  return computedSignature === slackSignature;
}

function reportCreationFailed(reportName, reason) {
  return slackRequest("chat.postMessage", {
    text: `Masked report *${reportName}* cannot be created`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Your masked report can't be created*",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: reason,
          },
        ],
      },
    ],
    channel: process.env.CLIENT_OPS_CHANNEL,
  });
}

function reportCreationSuccessful({ reportName, reportLink, slugReportName }) {
  slackRequest("chat.postMessage", {
    text: `Masked report *${reportName}* created`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Your masked report was successfully created!*",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Report name:*\n${reportName}`,
          },
          {
            type: "mrkdwn",
            text: `*Folder name:*\n${slugReportName}`,
          },
          {
            type: "mrkdwn",
            text: `*Report link:*\n${reportLink}`,
          },
        ],
      },
    ],
    channel: process.env.CLIENT_OPS_CHANNEL,
  });
}

function openModal(payload) {
  slackRequest("views.open", {
    trigger_id: payload.trigger_id,
    // Block Kit Builder - http://j.mp/bolt-starter-modal-json
    view: {
      type: "modal",
      callback_id: "gh-input-modal",
      private_metadata: JSON.stringify(payload), // Remove this when pasting this in Block Kit Builder
      title: {
        type: "plain_text",
        text: "Add or edit a report",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        textInputBlock("input-name", "Name of report"),
        textInputBlock("input-link", "Link to report"),
      ],
    },
  });
}

function slackRequest(api, body) {
  return fetch(`https://slack.com/api/${api}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function textInputBlock(id, label) {
  return {
    type: "input",
    block_id: id,
    element: {
      type: "plain_text_input",
      action_id: "input",
    },
    label: {
      type: "plain_text",
      text: label,
      emoji: true,
    },
    optional: false,
  };
}

function getTextInputValue(payload, id) {
  return payload.view.state.values[id].input.value;
}
