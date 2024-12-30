// ==UserScript==
// @name         Instagram Auto Unfollow
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mass Unfollower Userscript for IG
// @author       TheEmptynessProject
// @match        https://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
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
        unfollowButton.click();

        waitForButton('button._a9--._ap36._a9-_', (confirmButton) => {
            confirmButton.click();

            setTimeout(() => {
                window.close();
            }, 1000);
        });
    });
})();
