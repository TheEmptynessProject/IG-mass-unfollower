// ==UserScript==
// @name         Instagram Auto Unfollow and Close
// @namespace    https://github.com/TheEmptynessProject/IG-mass-unfollower/blob/main/tampermonkey-script.js
// @version      1.1
// @description  Automatically unfollows users and closes the page on Instagram
// @author       TheEmptynessProjet
// @match        https://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForButton(selector, callback) {
        const interval = setInterval(() => {
            const button = document.querySelector(selector);
            if (button) {
                clearInterval(interval);
                callback(button);
            }
        }, 500);
    }

    waitForButton('button._acan._acap._acat._aj1-._ap30', (unfollowButton) => {
        console.log("Unfollow button found. Clicking...");
        unfollowButton.click();

        waitForButton('button._a9--._ap36._a9-_', (confirmButton) => {
            console.log("Confirm unfollow button found. Clicking...");
            confirmButton.click();
        });
    });

    setTimeout(() => {
        console.log("Unfollowed successfully. Closing the page...");
        window.close();
    }, 5000);
})();
