/* This script generates mock data for local development.
 * This way you don't have to point to an actual API,
 * but you can enjoy realistic, but randomized data,
 * and rapid page loads due to local, static data.
 */

/* eslint-disable no-console */

import jsf from 'json-schema-faker';
import { schema } from './mock-schema';
import fs from 'fs';
import chalk from 'chalk';
import faker from 'faker';

const jsonObj = jsf(schema);

for (var i = 0, len = jsonObj.members.length; i < len; i++) {
  var member = jsonObj.members[i];
  member.id = member.id.replace('_', '-').replace('.', '-');
}

for (var i = 0, len = jsonObj.forms.length; i < len; i++) {
  var form = jsonObj.forms[i];
  var randomMember = faker.random.number(jsonObj.members.length - 1);
  var member = jsonObj.members[randomMember];
  form.memberId = member.id;
}

for (var i = 0, len = jsonObj.formData.length; i < len; i++) {
  var data = jsonObj.formData[i];
  var randomMember = faker.random.number(jsonObj.members.length - 1);
  var member = jsonObj.members[randomMember];
  var randomForm = faker.random.number(jsonObj.forms.length - 1);
  var form = jsonObj.forms[randomForm];
  data.formId = form.id;
  data.memberId = member.id;
}


for (var i = 0, len = jsonObj.metadata.length; i < len; i++) {
  var metadata = jsonObj.metadata[i];
  var randomForm = faker.random.number(jsonObj.forms.length - 1);
  var form = jsonObj.forms[randomForm];
  metadata.formId = form.id;
}

const json = JSON.stringify(jsonObj);

fs.writeFile("./src/db.json", json, function (err) {
  if (err) {
    return console.log(chalk.red(err));
  } else {
    console.log(chalk.green("Mock data generated."));
  }
});
