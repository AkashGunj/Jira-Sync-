const axios = require("axios");
const FormData = require("form-data");

const sourceJira = {
  baseUrl: "https://gunjalakash019.atlassian.net",
  email: "gunjalakash019@gmail.com",
  apiToken: "Z3VuamFsYWthc2gwMTlAZ21haWwuY29tOkFUQVRUM3hGZkdGMEduTHYyM21rNU9leThXb0JqTmNndkgzd09iS2ZpdW5wRDk4RzVsQTZ2NkgxMnBVc19yWklZdUpMSENobHVpNmJoVVlYYkZ4YmlGYXI4akZYZFRSY2dPTVNlT0NqaTVMSDlGNkxyU0ZqQUkxMjZrNUlPaFZpRVlIVERqYm1YOGVGOHhLeUhzSGpwRmpJS1JJZEd5NFV0VkNCSV9WSXUtaHlrZjRwSDVRRkRXaz0zRDQ2MEFDNg==",
};

const targetJira = {
  baseUrl: "https://akash-gunjal.atlassian.net",
  email: "akashgunjal0411@gmail.com",
  apiToken: "YWthc2hndW5qYWwwNDExQGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBWd0RZN0lHT3NRcU1aYURtbHNhVDBWb0gwS1gwV09qYnNRU2tGN01uVzRTVlcxWEFNQ2JlZElfVkJhRTcyUnlJblIweG12dkExSnBwQndYQ3BVM2RFN2JndHZpZ2NURGg0U3drYkt2V1hRNXg1TUR6RVRMcGt3OEZGSXZDTlZpZkR5VkFMSHNDWWktYTEtcHdMMHBzNGFuNF8tc1o3WXVQY1RjejRyc2gtWGs9RjU4MDkxQjk=",
};

async function syncAttachments(sourceIssueKey, targetIssueKey) {
  const authSource = Buffer.from(`${sourceJira.email}:${sourceJira.apiToken}`).toString("base64");
  const authTarget = Buffer.from(`${targetJira.email}:${targetJira.apiToken}`).toString("base64");

  const response = await axios.get(`${sourceJira.baseUrl}/rest/api/3/issue/${sourceIssueKey}?fields=attachment`, {
    headers: {
      Authorization: `Basic ${authSource}`,
      Accept: "application/json",
    },
  });

  const attachments = response.data.fields.attachment;
  for (const attachment of attachments) {
    const fileRes = await axios.get(attachment.content, {
      headers: { Authorization: `Basic ${authSource}` },
      responseType: "arraybuffer",
    });

    const form = new FormData();
    form.append("file", fileRes.data, attachment.filename);

    await axios.post(`${targetJira.baseUrl}/rest/api/3/issue/${targetIssueKey}/attachments`, form, {
      headers: {
        Authorization: `Basic ${authTarget}`,
        "X-Atlassian-Token": "no-check",
        ...form.getHeaders(),
      },
    });

    console.log(`✔ Uploaded ${attachment.filename} to ${targetIssueKey}`);
  }
}

module.exports = syncAttachments;
