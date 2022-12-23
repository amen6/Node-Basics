
/**
 * Starts the application
 * This is the function that is run when the app starts
 * 
 * It prints a welcome line, and then a line with "----",
 * then nothing.
 *  
 * @param  {string} name the name of the app
 * @returns {void}
 */
function startApp(name){
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', onDataReceived);
  console.log(`Welcome to ${name}'s application!`)
  console.log("--------------------")
  readData()
}

// To include the File System module
const fs = require('fs');

// To save the tasks every time the program is closed
function saveData() {
  let cleanedTasksList = tasksList.map(e => {
    return e.replace("- [ ] ", "")
  })
  let jsonData = JSON.stringify(cleanedTasksList)

  try {
    fs.writeFileSync("db.json", jsonData, error => {
      if (error) throw error;
      console.log("data was saved")
    })
  } catch (error) {
    console.log(error)
  }
}

// Load data on start
function readData(){
  fs.readFile("db.json", "utf-8", (error, data) => {
    try {
      data = JSON.parse(data)
      tasksList =  data.map(e => {
      return "- [ ] " + e; 
      })
    } catch (error) {
      if(error == "TypeError: Cannot read properties of null (reading 'map')") {
        return
      }
      if(error.code === "ENOENT") {
        return console.log("Database not found!")
      }
      if(error.toString().startsWith("SyntaxError")) {
        return
      }
      console.log(error)
    }
  })
}

/**
 * Decides what to do depending on the data that was received
 * This function receives the input sent by the user.
 * 
 * For example, if the user entered 
 * ```
 * node tasks.js batata
 * ```
 * 
 * The text received would be "batata"
 * This function  then directs to other functions
 * 
 * @param  {string} text data typed by the user
 * @returns {void}
 */
function onDataReceived(text) {
  if (text === 'quit\n' || text === 'exit\n') {
    saveData();
    quit();
  }
  else if(text === 'hello\n' || text.split(" ")[0] === 'hello'){
    hello(text);
  } 
  else if(text === 'help\n'){
    help();
  }
  else if(text === 'list\n'){
    list();
  }
  else if(text.split(" ")[0] === 'add'){
    add(text);
  }
  else if(text.split(" ")[0] === 'remove' || text === `remove\n`){
    remove(text);
  }
  else if(text.split(" ")[0] === 'edit'){
    if( text === `edit\n`) return console.log("error");
    edit(text);
  }
  else if(text.split(" ")[0] === 'check' || text.split(" ")[0] === 'uncheck' || text === `check\n` || text === `uncheck\n`){
    if( text === `check\n`) return console.log("error please insert a number");
    if( text === `uncheck\n`) return console.log("error please insert a number");
    checkAndUncheck(text);
  }
  else{
    unknownCommand(text);
  }
}


/**
 * prints "unknown command"
 * This function is supposed to run when all other commands have failed
 *
 * @param  {string} c the text received
 * @returns {void}
 */
function unknownCommand(c){
  console.log('unknown command: "'+c.trim()+'"')
}


/**
 * Says hello
 *
 * @returns {void}
 */
function hello(data){
  if(data === 'hello\n') {
    console.log("Hello!")
    return
  }
  data = data.replace('\n', '').trim();
  let allWords = data.split(' ');

  if (allWords[0] === 'hello') {
    let userName = allWords.slice(1).join(' ');
    console.log(`Hello ${userName}!` );
  }
}

/**
 * Lists all the commands
 *amen6
 * @returns {void}
 */

let allCommands = [{command : "hello(args)", explanation : "Says Hello <args>"},
    {command : "quit", explanation: "Exits the application"},
    {command : "exit", explanation: "Exits the application"},
    {command : "help", explanation: "List all commands"},
    {command : "list", explanation: "List all tasks"},
    {command : "add (args)", explanation: "Add the <args> as task"},
    {command : "remove/remove <num>", explanation: "remove last task / remove <num> task "},
    {command : "edit <task>/edit <num> <task>", explanation: "change last task to <task>/ change <num> task to <task>"},
    {command : "check <num>", explanation: "check <num> task with [✓]"},
    {command : "uncheck <num>", explanation: "uncheck <num> task"}
  ]

function help(){
  console.log("\nThe commands are: \n")
  allCommands.forEach((e)=> {
    console.log(`|${e.command}|    ${e.explanation}`)
  })
}

/**
 * List all tasks
 *
 * @returns {void}
 */

let tasksList = []

function list(){
  if(tasksList.length === 0) {
    console.log("no tasks to do")
  }
  tasksList.forEach((element, index) => {
    console.log(`${index + 1} ${element}`)
  })
}

/**
 * Add a task 
 *
 * @returns {void}
 */

function add(task){
  if(!task) {
    console.error("error needs an argument")
  } else {
    task = task.trim()
    task = task.split(" ").slice(1).join(' ');
    tasksList.push("- [ ] " + task)
  }
}

/**
 * Remove a task 
 *
 * @returns {void}
 */

function remove(removable){
  if(removable === `remove\n`) {
    return tasksList.pop();
  } else {
    removable = removable.trim()
    removable = parseInt(removable.split(" ").slice(1).join(' '));
    tasksList.splice(removable - 1,1);
    if(removable > tasksList.length) console.log("number does not exist")
  }
}

/**
 * Edit a task 
 *
 * @returns {void}
 */

function edit(newTask){
  let task = newTask.trim().split(" ").slice(1);
  if(Number.isInteger(parseInt(task[0]))){
    tasksList[parseInt(task[0] -1 )] = task.slice(1).join(" ");
  } else {
    task = task.join(" ");
    tasksList[tasksList.length -1] = task;
  }
}

/**
 * check a task 
 *
 * @returns {void}
 */

function checkAndUncheck(taskNum){
  let type = taskNum.trim().split(" ")[0];
  taskNum = taskNum.trim();
  taskNum = parseInt(taskNum.split(" ").slice(1).join(' '));
  if(taskNum > tasksList.length) {
    return console.log("number does not exist")
  }
  if(type === "check") {
    return tasksList[taskNum -1] = tasksList[taskNum -1].replace("[ ]", "[✓]")
  } 
  if(type === "uncheck") {
    return tasksList[taskNum -1] = tasksList[taskNum -1].replace("[✓]", "[ ]")
  }
}

/**
 * Exits the application
 *
 * @returns {void}
 */
function quit(){
  console.log('Quitting now, goodbye!')
  process.exit();
}

// The following line starts the application
startApp("Amen")
