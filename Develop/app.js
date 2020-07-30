const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

async function start(){
    console.log("Build your team");

    let teamHTML = "";

    let teamSize;

    await inquirer.prompt(
        {
            type: "number",
            message: "How many people are in your team?",
            name: "noOfTeamMem"
        }
    )
    .then((data) => {

        teamSize = data.noOfTeamMem + 1;
    });
    
    if (teamSize === 0){
        console.log("Nobody works here?");
        return;
    }
    
    for(x = 1; x < teamSize; x++){

        // Global variables set
        let name;
        let id;
        let title;
        let email;

        // Prompts user to answer the basic questions of the employee
        await inquirer.prompt([ 
            {
                type: "input",
                message: `What is employee (${x})'s name?`,
                name: "name"
            },
            {
                type: "input",
                message: `What is the employee (${x})'s id?`,
                name: "id"
            },
            {
                type: "input",
                message: `What is the employee (${x})'s Email?`,
                name: "email"
            },
            {
                type: "list",
                message: `what the employee (${x})'s title?`,
                name: "title",
                choices: ["Engineer", "Intern", "Manager"]
            }
        ])
        .then((data) => {

            // Takes data from user and places value in global variables
            name = data.name;
            id = data.id;
            title = data.title;
            email = data.email;
        });

        // Switch Case depending on the title of the employee
        switch (title){
            case "Manager":

                // ask user of Manager's Office Number
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Manager's Office Number?",
                        name: "officeNo"
                    }
                ])
                .then((data) => {

                    const manager = new Manager(name, id, email, data.officeNo);
                    teamMember = fs.readFileSync("../templates/manager.html");
                    teamHTML = teamHTML + "\n" + eval('`'+ teamMember +'`');
                });
                break;

            
            case "Intern":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What school does you Intern go to?",
                        name: "school"
                    }
                ])
                .then((data) => {
                    const intern = new Intern(name, id, email, data.school);
                    teamMember = fs.readFileSync("../templates/intern.html");
                    teamHTML = teamHTML + "\n" + eval('`'+ teamMember +'`');
                });
                break;

            
            case "Engineer":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Engineer's GitHub?",
                        name: "github"
                    }
                ])
                .then((data) => {
                    const engineer = new Engineer(name, id, email, data.github);
                    teamMember = fs.readFileSync("../templates/engineer.html");
                    teamHTML = teamHTML + "\n" + eval('`'+ teamMember +'`');
                });
                break;

        } 

    }

    
    const mainHTML = fs.readFileSync("../templates/main.html");
    teamHTML = eval('`'+ mainHTML +'`');

    fs.writeFile("team.html", teamHTML, function(err) {

        if (err) {
          return console.log(err);
        }
      
        console.log("Success!");
      
      });

}


start();