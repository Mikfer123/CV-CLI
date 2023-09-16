#!/usr/bin/env ts-node

import yargs from "yargs";
import fs from "fs"
import Handlebars from "handlebars";
import inquirer from "inquirer";
import nodemailer from "nodemailer"

const jsonFileUrl = './bin/cvData.json'

type skills = {skill: string, age: number}

const isSkillAlreadySubmitted = (array: skills[], object: skills) => array.some(item => Object.values(item)[0] === Object.values(object)[0])

const saveToJsonFile = <T extends object>(jsonUrl: string, data: T) => {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFile(jsonUrl, jsonData , (error) => {
    if (error) throw error;

    console.log("The file was saved!");
  });
}

const writeUrlDataToJsonFIle = (url: string | number, key: string) => {
  fs.readFile(url, 'utf8', (error, dataFromUrl) => {
    if (error) throw error;

    if(!fs.existsSync(jsonFileUrl)) {

      saveToJsonFile(jsonFileUrl,{[key]: dataFromUrl})

    } else {
      fs.readFile(jsonFileUrl, 'utf8', (error, data) => {
        if (error) throw error

        const dataFromJson = JSON.parse(data)
        dataFromJson[key] =  dataFromUrl

        saveToJsonFile(jsonFileUrl,dataFromJson)
      })
    }
  })
}

const addNewDataToJsonFile = <T extends object, Y>(data: T, key: string, value: Y | T) => {
  if (!fs.existsSync(jsonFileUrl)) {

    saveToJsonFile(jsonFileUrl, data)

  } else {
    fs.readFile(jsonFileUrl, 'utf8', (error, data) => {
      if (error) throw error

      const dataFromJson = JSON.parse(data)
      dataFromJson[key] = value

      saveToJsonFile(jsonFileUrl,dataFromJson)
    })
  }
}

async function sendEmail(html:string, email: string[], user: string, password: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: password
    }
  })

  const info = await transporter.sendMail({
    from: "Test <cvcli.test@gmail.com>",
    to: email,
    subject: "Test",
    html: html
  })

  return info
}

const doesListIncludesEmails = (val: (string | number)[]): val is string[] => {
  return val.every((element) => typeof element === "string")
}

yargs
.command("define-template", "choose a template to use for cv", () => {
  inquirer.prompt([
    {
      type: 'list',
      message: "pick a template",
      name: "template",
      choices: ["handlebars"]
    }
  ])
  .then((answers) => addNewDataToJsonFile({template: answers.template}, "template", answers.template))
})

.command('add-personal', 'add personal info', () => {
  yargs.options({
    'name': {
      alias: 'n',
      describe: 'name of the person',
      demandOption: true
    },
    'surname': {
      alias: 's',
      describe: 'surname of the person',
      demandOption: true
    },
    'email': {
      alias: 'e',
      describe: 'email address of the person',
    }
  })

}, (argv) => {
  const personalData = {
    name: argv.name,
    surname: argv.surname,
    email: argv.email
  }

  addNewDataToJsonFile(personalData, "personalData", personalData);
})

.command("add-about", "add url to your personal description file", (yargs) => {
  yargs.positional('descriptionUrl', {
    describe: 'url to description file',
    type: 'string',
    demandOption: true
  });

}, (argv) => writeUrlDataToJsonFIle(argv._[1], 'about'))

.command("add-edu", "add url to your education info file", (yargs) => {
  yargs.positional('eduUrl', {
    describe: 'url to edu info file',
    type: 'string',
    demandOption: true
  });

}, (argv) => writeUrlDataToJsonFIle(argv._[1], "education"))

.command("add-skills", "add your skills", () => {
  inquirer.prompt([
    {
      name: "skill",
      message: "please enter your skill",
    },
    {
      type: "list",
      name: "rating",
      message: "please enter the rating of your skill",
      choices: [1, 2, 3, 4, 5],
    },
  ])

  .then((answers: skills) => {
    if(!fs.existsSync(jsonFileUrl)) {
      saveToJsonFile(jsonFileUrl, {skilss: [answers]});

    } else {
      fs.readFile(jsonFileUrl, 'utf8', (error, data) => {
        if (error) throw error
        const dataFromJson = JSON.parse(data)

        if (!dataFromJson.skills || !Array.isArray(dataFromJson.skills)) {

          dataFromJson.skills = [answers]

        } else if(isSkillAlreadySubmitted(dataFromJson.skills, answers)) {

          throw new Error("the skill has already been submitted")

        } else {

          dataFromJson.skills.push(answers)

        }

        saveToJsonFile(jsonFileUrl,dataFromJson)
      })
    }
  })
})

.command("add-image", "add your immage",(yargs) => {
  yargs.positional("imgUrl", {
    describe: 'url to edu image',
    type: 'string',
    demandOption: true
  })

}, (argv) => {
  const imgUrl = argv._[1]
  console.log(imgUrl, typeof imgUrl)

  addNewDataToJsonFile({imgUrl: imgUrl}, "img", imgUrl)
})

.command("clear", "erase all saved data", () => {
    fs.unlink(jsonFileUrl, (error) => {
      if(error) throw error;

      console.log('File deleted!');
    });
})

.command("send", "sned cv to recruiters", (yargs) => {
  yargs.positional("emailList", {
    describe: 'list of email adresses to send cv to',
    type: "string",
    demandOption: true
  })

}, (argv) => {

  const emailList = argv._.slice(1)
  if (!doesListIncludesEmails(emailList)) {
    console.error('Invalid email list format');
    return;
  }

  const jsonData = JSON.parse(fs.readFileSync(jsonFileUrl, 'utf8'))

  if (jsonData.template === "handlebars") {
    const templateSource = fs.readFileSync('./bin/cvTemplate.hbs', 'utf8');
    const template = Handlebars.compile(templateSource);
    const html = template(jsonData);

    sendEmail(html, emailList)
    .then((info) => {console.log(info)})
    .catch((error) => console.log(error))
  }
})
.argv

