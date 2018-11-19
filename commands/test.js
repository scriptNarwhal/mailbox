const generateAttachments = require('../lib/generate-attachments')
const getTestData = require('../lib/get-test-data')
const renderMJML = require('../lib/render-mjml')
const renderNunjucks = require('../lib/render-nunjucks')
const sendMail = require('../lib/send-mail')

/**
 * Send test email
 * @param {Object} options Function options
 * @param {String} options.templatePath Path of MJML template
 * @param {String} options.test Test data
 * @param {String} options.from Email sender
 * @param {String} options.to Email recipient
 */
function test (options) {
  const testData = getTestData({ test: options.test })
  const mjmlOutput = renderMJML({ path: options.templatePath })

  if (mjmlOutput.errors.length) {
    console.log(mjmlOutput.errors)
    process.exit(1)
  }

  const nunjucksAttachments = {}

  for (let attachment in testData.attachments) {
    nunjucksAttachments[attachment] = `cid:${attachment}@example.com`
  }

  const nunjucksOutput = renderNunjucks({
    template: mjmlOutput.html,
    context: {
      ...testData,
      attachments: nunjucksAttachments
    }
  })

  const mailAttachments = generateAttachments({
    attachments: testData.attachments
  })

  console.log(mailAttachments)

  sendMail({
    from: options.from,
    to: options.to,
    subject: testData.subject,
    html: nunjucksOutput,
    attachments: mailAttachments
  })
}

module.exports = test
