const { When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
const assert = require('assert');

When('I press the {string} button', async function (buttonName) {
  const button = await this.driver.wait(
    until.elementLocated(By.xpath(`//button[normalize-space()="${buttonName}"]`)), 5000
  );
  await button.click();
});

Then('I should see {string} in the results', async function (expectedText) {
  const results = await this.driver.wait(until.elementLocated(By.id('search_results')), 5000);
  await this.driver.wait(async () => (await results.getText()).includes(expectedText), 5000);
  const text = await results.getText();
  assert(text.includes(expectedText));
});

Then('I should not see {string} in the results', async function (expectedText) {
  const results = await this.driver.findElement(By.id('search_results'));
  const text = await results.getText();
  assert(!text.includes(expectedText), `Unexpected text found: ${expectedText}`);
});

Then('I should see the message {string}', async function (expectedMessage) {
  const message = await this.driver.wait(until.elementLocated(By.id('flash_message')), 5000);
  const text = await message.getText();
  assert(text.includes(expectedMessage), `Expected message "${expectedMessage}" was not found`);
});
