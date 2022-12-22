
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
 *
 * @returns {void}
 */

let allCommands = [{command : "hello(args)", explanation : "Says Hello <args>"},
    {command : "quit", explanation: "Exits the application"},
    {command : "exit", explanation: "Exits the application"},
    {command : "help", explanation: "List all commands"},
    {command : "list", explanation: "List all tasks"},
    {command : "add (args)", explanation: "Add the <args> as task"},
    {command : "remove/remove <num>", explanation: "remove last task / remove <num> task "}
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
    console.log(`${index + 1} - [ ] ${element}`)
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
    task = task.replace('\n', '').trim()
    task = task.split(" ").slice(1).join(' ');
    tasksList.push(task)
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
    removable = removable.replace('\n', '').trim()
    removable = removable.split(" ").slice(1).join(' ');
    (typeof parseInt(removable) == 'number') ? tasksList.splice(removable - 1,1) : console.log("please enter a valid number");
    
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
