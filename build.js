const { execSync } = require('child_process');
const path = require('path');

console.log('Building ChoreChamp client...');

const clientDir = path.join(__dirname, 'client');

try {
    console.log('Installing dependencies...');
    execSync('npm install', { cwd: clientDir, stdio: 'inherit' });

    console.log('Running build...');
    execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

    console.log('Build complete!');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
