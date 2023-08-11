#!/usr/bin/env ts-node

// const readline = require('readline');
const fs = require('fs');
const yargs = require("yargs");
const Handlebars = require("handlebars");
const inquirer = require("inquirer");
const command = yargs.argv._[0]

console.log(command)

// https://vegibit.com/how-to-use-yargs-in-node-js/

let cvTemplate:any 

yargs
  .command("define-template", "choose a template to use for cv", 


async function askForTemplate() {
  const answer = await inquirer.prompt({
    name: "template",
    type: "input",
    message: "Please enter the template name(currently only handlebars is available): ",// wymienić templatki
  })

  return answer.template
}

if (command === "define-template") {
  askForTemplate()
  .then(res => {// info że jest jeden template
    if (res === "handlebars") {
    }
  })
  .catch(err => console.error(err));
}

// {
//   x: "y",
//   name: "Jan"
// }
// 

const addDataToJSONFile = () => {
  // 
}

if(command === "add-personal") { 
  async function addPersonalInfo() {
    try {
      const argv = await yargs
        .command({
          command: 'add-personal',
          describe: 'Add personal information',
          builder: {
            name: {
              alias: 'n',
              describe: 'The name of the person',
              demandOption: true,
              type: 'string'
            },
            surname: {
              alias: 's',
              describe: 'The surname of the person',
              demandOption: true,
              type: 'string'
            },
            email: {
              alias: 'e',
              describe: 'The email address of the person',
              demandOption: true,
              type: 'string'
            }
          },
          handler: (argv: any) => {
            const { name, surname, email } = argv;
            const template = Handlebars.compile(cvTemplate);

    const personalInfo = {
      firstName: name,
      lastName: surname,
      email: email,
    };

    const generatedCV = template(personalInfo);

    console.log(generatedCV);

          }
        })
        .help()
        .argv;
    } catch (err) {
      console.error("Error occurred:", err);
    }
  }

  addPersonalInfo()
}

yargs
  .command("define-template", "...", askForTemplate)
  .command("add-personal", "...", askForTemplate)