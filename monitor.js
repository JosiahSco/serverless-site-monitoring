const { readFile, writeFile } = require('fs/promises');
const fetch = require('node-fetch');
const sites = [
    'https://josiahscott.dev',
    'https://asteroidinc.josiahscott.dev',
    'https://weather.josiahscott.dev',
    'https://typing.josiahscott.dev',
]

async function checkStatus() {
    let text = await readFile('README.md');
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
    const newText = text.toString().replace(/Last Status Check: .* CST/, `Last Status Check: ${timestamp} CST`)
    
    await writeFile(`README.md`, newText);

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
            }
            await writeFile(`README.md`, oldText);
        } catch (error) {
            console.log('Error: ', error);
        }
    }
}

checkStatus();