//KEEP IN MIND THIS SCRIPT IS UNRELIABLE AND MAY THROW ERRORS. EVEN WITH THE CATCH, IT IS POSSIBLE IT WILL STILL BREAK THE SCRIPT
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PENDING_REQUESTS_FILE = 'pending_follow_requests.json';

(async () => {
    const data = fs.readFileSync(PENDING_REQUESTS_FILE, 'utf-8');
    const {
        relationships_follow_requests_sent
    } = JSON.parse(data);

    let usersToUnfollow = relationships_follow_requests_sent.map(item =>
        item.string_list_data[0].value
    );

    const browser = await puppeteer.launch({
        headless: false
    });
    let page = await browser.newPage();

    await page.goto('https://www.instagram.com/accounts/login/', {
        waitUntil: 'networkidle2'
    });
    console.log("Press Enter after completing any 2FA or login steps...");

    process.stdin.once('data', async () => {
        console.log('Starting the unfollow process...');

        for (const username of usersToUnfollow) {
            try {
                console.log(`Navigating to ${username}'s profile...`);
                await page.goto(`https://www.instagram.com/${username}/`, {
                    waitUntil: 'networkidle2'
                });

                const unfollowButtonSelector = 'button._acan._acap._acat._aj1-._ap30';
                await page.waitForSelector(unfollowButtonSelector, {
                    timeout: 5000
                });

                await page.click(unfollowButtonSelector);

                await new Promise(resolve => setTimeout(resolve, 1000));

                const confirmButtonSelector = 'button._a9--._ap36._a9-_';
                await page.waitForSelector(confirmButtonSelector, {
                    timeout: 5000
                });
                await page.click(confirmButtonSelector);

                console.log(`Unfollowed ${username}`);

                usersToUnfollow = usersToUnfollow.filter(user => user !== username);
                fs.writeFileSync(PENDING_REQUESTS_FILE, JSON.stringify({
                    relationships_follow_requests_sent: usersToUnfollow.map(user => ({
                        string_list_data: [{
                            value: user
                        }]
                    }))
                }, null, 2));
            } catch (error) {
                console.log(`Could not unfollow ${username}: ${error.message}`);

                if (error.message.includes('Waiting for selector') || error.message.includes('timeout')) {
                    console.log(`Removing ${username} from the list due to timeout.`);
                    usersToUnfollow = usersToUnfollow.filter(user => user !== username);
                    fs.writeFileSync(PENDING_REQUESTS_FILE, JSON.stringify({
                        relationships_follow_requests_sent: usersToUnfollow.map(user => ({
                            string_list_data: [{
                                value: user
                            }]
                        }))
                    }, null, 2));
                }

                if (error.message.includes('detached Frame')) {
                    console.log('Attempting to reload the page...');

                    await page.close();

                    page = await browser.newPage();

                    await page.goto(`https://www.instagram.com/${username}/`, {
                        waitUntil: 'networkidle2'
                    });
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    });

    browser.close();
})();
