const readline = require('readline');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to add two numbers
const add = (num1, num2) => {
  return num1 + num2;
};


const executePlugin = (pluginName, num1, num2) => {
    const pluginPath = path.join(__dirname, 'plugins', `${pluginName}.py`);
  
    if (!fs.existsSync(pluginPath)) {
      console.log(`Plugin for "${pluginName}" not found.`);
      return;
    }
  
    const pluginProcess = spawn('python', [pluginPath, num1, num2]);
  
    pluginProcess.stdout.on('data', (data) => {
      console.log(`Result from ${pluginName} plugin: ${data}`);
    });
  
    pluginProcess.stderr.on('data', (data) => {
      console.error(`Error from ${pluginName} plugin: ${data}`);
    });
  
    pluginProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Plugin ${pluginName} exited with code ${code}`);
      }
    });
  };

const main = () => {
  rl.question('Enter the first number: ', (firstInput) => {
    const num1 = parseFloat(firstInput); // Convert input to a float

    rl.question('Enter the second number: ', (secondInput) => {
      const num2 = parseFloat(secondInput); // Convert input to a float

      rl.question('Enter the operation (add|sub|mul): ', (operation) => {
        // Handling addition operation
        if (operation === 'add') {
          const result = add(num1, num2);
          console.log(`The result of adding ${num1} and ${num2} is ${result}`);
        }        
        else {
            executePlugin(operation, num1, num2); // Execute the plugin if it exists
        }
        
        rl.close(); // Close the readline interface
      });
    });
  });
};

main();
