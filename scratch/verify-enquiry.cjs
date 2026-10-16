const assert = require('node:assert/strict');
const puppeteer = require('../Green-School-Bali-Carousel/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1400 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => localStorage.setItem('nuvexa_popup_submitted', 'true'));
    let status = 502;
    const requests = [];
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().endsWith('/api/contact')) {
        requests.push(JSON.parse(request.postData()));
        return request.respond({ status, contentType: 'application/json', body: JSON.stringify({ success: status === 200 }) });
      }
      return request.continue();
    });
    await page.goto('http://127.0.0.1:3100/contact', { waitUntil: 'networkidle0', timeout: 120000 });
    const clickButton = async (text) => {
      for (const button of await page.$$('button')) {
        if (await button.evaluate((element, label) => element.textContent.includes(label), text)) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          await button.click();
          return;
        }
      }
      throw new Error(`Button not found: ${text}`);
    };
    await clickButton('Next');
    await page.waitForFunction(() => document.body.textContent.includes('Please select who you are'));
    await page.$eval('input[value="founder"]', (input) => input.click());
    await clickButton('Next');
    await page.waitForFunction(() => document.querySelectorAll('input[type="checkbox"]').length === 8);
    const labels = await page.$$eval('input[type="checkbox"]', (inputs) => inputs.map((input) => input.closest('label').textContent.trim()));
    assert.deepEqual(labels, ['Campus Audit', 'Consulting', 'Build', 'Minor Fixes', 'Campus Renovation', 'Certify', 'Full Build', 'Just Exploring']);
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="checkbox"]');
      inputs[1].click(); inputs[3].click(); inputs[4].click();
    });
    await clickButton('Next');
    await page.waitForSelector('input[name="name"]');
    await new Promise((resolve) => setTimeout(resolve, 500));
    assert.equal(await page.$eval('form', (form) => /Please select a campus|Please select a budget|Name must|Invalid input|Invalid option/.test(form.textContent)), false, 'Untouched final step should not show errors');
    assert.equal(requests.length, 0);
    await clickButton('Submit Discovery');
    await page.waitForFunction(() => document.body.textContent.includes('Please select a campus type'));
    assert.equal(await page.$eval('form', (form) => /Invalid input|Invalid option|undefined/.test(form.textContent)), false);
    await page.select('select[name="campusType"]', 'school');
    const month = await page.$eval('select[name="targetDate"]', (select) => select.options[1].value);
    await page.select('select[name="targetDate"]', month);
    await page.select('select[name="campusSize"]', '5k');
    await page.select('select[name="budget"]', 'under-5cr');
    await page.type('input[name="name"]', 'Test Enquiry');
    await page.type('input[name="email"]', 'test@example.com');
    await page.type('input[name="phone"]', '9876543210');
    await clickButton('Submit Discovery');
    await page.waitForFunction(() => document.body.textContent.includes('Something went wrong'));
    assert.deepEqual(requests[0].services, ['consulting', 'minor-fixes', 'campus-renovation']);
    status = 200;
    await clickButton('Submit Discovery');
    await page.waitForFunction(() => document.body.textContent.includes("We'll be in touch within 4 working hours."));
    console.log('PASS: exact service choices, clean step transition, friendly validation, contact failure and success');

    const popup = await browser.newPage();
    await popup.evaluateOnNewDocument(() => localStorage.removeItem('nuvexa_popup_submitted'));
    let popupStatus = 502;
    let popupData;
    await popup.setRequestInterception(true);
    popup.on('request', (request) => {
      if (request.url().endsWith('/api/assessment')) {
        popupData = JSON.parse(request.postData());
        return request.respond({ status: popupStatus, contentType: 'application/json', body: JSON.stringify({ success: popupStatus === 200 }) });
      }
      return request.continue();
    });
    await popup.goto('http://127.0.0.1:3100/contact', { waitUntil: 'networkidle0', timeout: 120000 });
    await popup.waitForSelector('input[name="schoolName"]', { timeout: 15000 });
    await popup.type('input[name="name"]', 'Popup Test');
    await popup.type('input[name="schoolName"]', 'Test Campus');
    await popup.type('input[name="phone"]', '9876543210');
    await popup.type('textarea[name="message"]', 'Campus assessment');
    const submitPopup = () => popup.evaluate(() => document.querySelector('input[name="schoolName"]').closest('form').querySelector('button[type="submit"]').click());
    await submitPopup();
    await popup.waitForSelector('[role="alert"]');
    assert.equal(await popup.evaluate(() => localStorage.getItem('nuvexa_popup_submitted')), null);
    popupStatus = 200;
    await submitPopup();
    await popup.waitForFunction(() => document.body.textContent.includes("You're all set."));
    assert.equal(await popup.evaluate(() => localStorage.getItem('nuvexa_popup_submitted')), 'true');
    assert.equal(popupData.schoolName, 'Test Campus');
    console.log('PASS: popup sends details, preserves retry on failure, remembers success only after acceptance');
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
