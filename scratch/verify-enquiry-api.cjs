const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('../site/node_modules/typescript');
const site = path.resolve(__dirname, '../site');
const cache = new Map();
let calls = [];
let smtpOptions;
let delivery = 'accepted';
const smtpMock = {
  createTransport(options) {
    smtpOptions = options;
    return {
      async sendMail(message) {
        calls.push(message);
        if (delivery === 'error') throw new Error('Mock SMTP authentication failure');
        return { accepted: delivery === 'accepted' ? [message.to] : [] };
      },
    };
  },
};

function load(relative) {
  const filename = path.join(site, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = new Module(filename);
  module.filename = filename;
  module.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = module.require.bind(module);
  module.require = (id) => id === 'nodemailer' ? smtpMock : id.startsWith('@/') ? load(id.slice(2) + '.ts') : originalRequire(id);
  cache.set(filename, module);
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText, filename);
  return module.exports;
}

(async () => {
  // All email requests are mocked; no test messages are sent.
  delete process.env.SLACK_WEBHOOK_URL;
  delete process.env.ENQUIRY_EMAIL_TO;
  const { contactFormSchema, serviceOptions } = load('lib/schemas.ts');
  const contact = load('app/api/contact/route.ts').POST;
  const assessment = load('app/api/assessment/route.ts').POST;
  const contactData = {
    persona: 'founder', services: serviceOptions.map((option) => option.value),
    campusType: 'school', targetDate: '2027-01', campusSize: '5k', budget: 'under-5cr',
    name: 'Test User', email: 'test@example.com', phone: '9876543210', message: '<b>Test notes</b>',
  };
  const assessmentData = { name: 'Test User', schoolName: 'Test School', phone: '9876543210', message: 'Assessment goals' };
  const request = (data) => new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  global.fetch = async () => { throw new Error('Unexpected network request'); };
  process.env.ZOHO_SMTP_HOST = 'smtppro.zoho.com';
  process.env.ZOHO_SMTP_USER = 'sender@example.com';
  process.env.ZOHO_SMTP_PORT = '465';
  assert.equal(contactFormSchema.safeParse(contactData).success, true);
  for (const removed of ['design', 'outfit']) {
    assert.equal(contactFormSchema.safeParse({ ...contactData, services: [removed] }).success, false);
  }
  for (const [handler, data] of [[contact, contactData], [assessment, assessmentData]]) {
    calls = [];
    assert.equal((await handler(request({}))).status, 400);
    assert.equal(calls.length, 0);
    delete process.env.ZOHO_SMTP_PASSWORD;
    assert.equal((await handler(request(data))).status, 502, 'Missing credentials must not produce success');
    assert.equal(calls.length, 0);
    process.env.ZOHO_SMTP_PASSWORD = 'mock-password';
    delivery = 'error';
    assert.equal((await handler(request(data))).status, 502, 'Provider rejection must not produce success');
    delivery = 'rejected';
    assert.equal((await handler(request(data))).status, 502, 'Unaccepted recipient must not produce success');
    delivery = 'accepted';
    assert.equal((await handler(request(data))).status, 200);
    assert.equal(calls.at(-1).to, 'gp@redmouse.studio');
    assert.equal(calls.at(-1).from.address, 'sender@example.com');
    assert.equal(smtpOptions.secure, true);
    assert.equal(smtpOptions.port, 465);
    assert.ok(calls.at(-1).text.includes(data.name));
    if (data.email) {
      assert.equal(calls.at(-1).replyTo, data.email);
      for (const option of serviceOptions) assert.ok(calls.at(-1).text.includes(option.label));
    } else {
      assert.ok(calls.at(-1).text.includes(data.schoolName));
      assert.ok(calls.at(-1).text.includes(data.message));
    }
  }
  process.env.ZOHO_SMTP_PORT = '587';
  assert.equal((await assessment(request(assessmentData))).status, 200);
  assert.equal(smtpOptions.secure, false);
  assert.equal(smtpOptions.requireTLS, true);
  process.env.ZOHO_SMTP_PORT = '25';
  assert.equal((await assessment(request(assessmentData))).status, 502);
  process.env.ZOHO_SMTP_PORT = '465';
  process.env.ENQUIRY_EMAIL_TO = 'production@example.com';
  assert.equal((await assessment(request(assessmentData))).status, 200);
  assert.equal(calls.at(-1).to, 'production@example.com');
  console.log('PASS: both routes validate data, enforce SMTP success, use the test recipient and configured sender, and require TLS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
