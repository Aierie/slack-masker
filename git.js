const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

const template = require("./html");

module.exports = {
  async createNewReport(userName, { slugReportName, reportName, reportLink }) {
    const path = `${process.env.REPORT_DIR}/${slugReportName}/index.html`;
    await octokit.request(
      `PUT /repos/${process.env.GIT_REPO_OWNER}/${process.env.GIT_REPO}/contents/${path}`,
      {
        accept: "application/vnd.github.v3+json",
        owner: process.env.GIT_REPO_OWNER,
        repo: process.env.GIT_REPO,
        path,
        message: `${userName} added report ${reportName}`,
        content: Buffer.from(template(reportName, reportLink)).toString(
          "base64"
        ),
        branch: process.env.GIT_BRANCH,
      }
    );
    return null;
  },
  async getExistingReports() {
    const res = await octokit.request(
      `GET /repos/${process.env.GIT_REPO_OWNER}/${process.env.GIT_REPO}/contents/${process.env.REPORT_DIR}`,
      {
        accept: "application/vnd.github.v3+json",
        owner: process.env.GIT_REPO_OWNER,
        path: process.env.REPORT_DIR,
        ref: process.env.GIT_BRANCH,
      }
    );

    return res.data.map((v) => v.name);
  },
};
