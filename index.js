"use strict";
const querystring = require("querystring");

const { createNewReport, getExistingReports } = require("./git");
const {
  reportCreationFailed,
  reportCreationSuccessful,
  openModal,
  getTextInputValue,
  authSlack,
} = require("./slack");

async function handleViewSubmission(payload) {
  let reportName, reportLink;
  try {
    reportName = getTextInputValue(payload, "input-name");
    reportLink = getTextInputValue(payload, "input-link");
    const slugReportName = reportName
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .toLowerCase();
    const existingSlugReportNames = await getExistingReports();
    if (existingSlugReportNames.includes(slugReportName)) {
      reportCreationFailed(
        reportName,
        `Your report can't be created because another report with the same folder name "${slugReportName}" already exists`
      );
    } else if (!/[a-zA-Z0-9]/.test(slugReportName)) {
      reportCreationFailed(
        reportName,
        "Your report can't be created because its name has no alphanumeric characters"
      );
    } else {
      await createNewReport(payload.user.username, {
        reportName,
        reportLink,
        slugReportName,
      });
      reportCreationSuccessful({
        reportName,
        reportLink,
        slugReportName,
      });
    }
  } catch (e) {
    console.error(e);
    reportCreationFailed(
      reportName,
      "We're not sure about why it failed. Ping Michael please!"
    );
  }
}

module.exports = {
  async handler(event) {
    try {
      if (!authSlack(event)) return Promise.reject({});
      const body =
        typeof event.body === "string" ? querystring.parse(event.body) : body;
      const payload = JSON.parse(body.payload);
      if (payload.type === "shortcut" && payload.callback_id === "add_report") {
        openModal(payload);
        return Promise.resolve({});
      } else if (
        payload.type === "view_submission" &&
        payload.view.callback_id === "gh-input-modal"
      ) {
        handleViewSubmission(payload);
        return Promise.resolve({});
      } else {
        return Promise.reject({});
      }
    } catch (e) {
      return Promise.reject({});
    }
  },
};
