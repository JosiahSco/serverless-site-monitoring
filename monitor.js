const { readFile, writeFile } = require('fs/promises');
const fetch = require('node-fetch');
const sites = [
    'https://josiahscott.dev',
    'https://asteroidinc.josiahscott.dev',
    'https://weather.josiahscott.dev',
    'https://typing.josiahscott.dev',
]

async function checkStatus() {
    for (let site of sites) {
        try {
            const startTime = Date.now();
            const response = await fetch(site);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const status = response.ok ? '🟩UP' : '🟥DOWN';
            const siteInfo = `## ${site}\nStatus: ${status}  \nResponse Time: ${responseTime}ms\n\n`;
            let oldText = await readFile(`README.md`);

            if (oldText.includes(`${site}`)) {
                oldText = oldText.toString().replace(new RegExp(`## ${site}[^#]*`), siteInfo);
            } else {
                oldText += `\n${siteInfo}`;
                // oldText = oldText.toString().replace(/Status: .*/, `Status: ${status}`);
                // oldText = oldText.toString().replace(/Response Time: .*/, `Response Time: ${responseTime}ms`);
            }
            await writeFile(`readme.md`, oldText);            
        } catch (error) {
            console.log('Error: ', error);            
        }
    }
}

checkStatus();