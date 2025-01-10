// ==UserScript==
// @name         Decision Detector
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Detects decisions on .edu websites plays random YouTube video depending on decision status.
// @author       Nano-AI
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Get the hostname and text content of the page
    const hostname = window.location.hostname.toLowerCase();
    let pageText = document.body.innerText.toLowerCase();

    // Check if the site is a .edu domain
    const isEduDomain = hostname.endsWith('.edu');

    const collegePortals = [
        "https://bealonghorn.admissions.utexas.edu/portal/mystatus?tab=admissions",
        "https://apply.purdue.edu/apply/status",
        "https://yes.umass.edu/apply/status",
        "https://buckeyelink.erp.osu.edu/psc/sps/EMPLOYEE/CAMP/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL?CONTEXTIDPARAMS",
        "https://mypennstate.psu.edu/index.cfm/home/index",
        "https://myillini.illinois.edu/Apply/Application/Status",
        "https://madison.sis.wisc.edu/psc/sissso/EMPLOYEE/SA/c/SAD_APPLICANT_FL.SAD_APPLICANT_FL.GBL?Page=SAD_APPL_STATUS_FL&Action=L",
        "https://admit.umn.edu/apply/status",
        "https://ugrad.apply.colorado.edu/apply/status?tab=home",
        "https://terpengage.umd.edu/tap/s/",
        "https://apply.northeastern.edu/portal/app_status",
        "https://admit.vt.edu/portal/status?tab=app",
        "https://ugrdslate.scu.edu/apply/status",
        "https://sdb.admin.uw.edu/admissions/uwnetid/appstatus.asp",
        "https://application.gatech.edu/apply/status",
        "https://ivyhub-simulators.andressevilla.com",
        "https://admit.umn.edu/apply/"
    ];

    // Check if the site is likely a decision-related website
    const decisionKeywords = ['admissions', 'decision', 'application', 'status'];
    const isCloseToPortalURL = (currentURL, portals) => {
        return portals.some((portal) => {
            const portalURL = new URL(portal);
            const currentURLObj = new URL(currentURL);

            // Compare hostnames and the start of paths for similarity
            return (
                portalURL.hostname === currentURLObj.hostname &&
                currentURLObj.pathname.startsWith(portalURL.pathname)
            );
        });
    };

    // Check if the current site is likely a decision-related website
    const isDecisionWebsite = isCloseToPortalURL(window.location.href, collegePortals);

    if (isDecisionWebsite) {
        console.log("Detected a potential .edu or decision website.");

        // YouTube video lists
        const positiveVideos = [
            "https://youtu.be/QtyBdguPwGM?si=_Mq03CfP7Z6gqPvF&t=116",
            "https://youtu.be/45Xkbwn1p-E?si=yg-57_ApxEsatyax",
            "https://youtu.be/TMzs6GvsZXU?si=h1lDxjxspyc9X-dG",
            "https://youtu.be/wVRF3SqLUi0?si=w0MLaVmE-voxs9-K"
        ];
        const deferredVideos = [
            "https://www.youtube.com/embed/8ENfwSADlC0?autoplay=1&muted=1&controls=0&start=3",
        ];
        const negativeVideos = [
            "https://www.youtube.com/embed/M0pQkacbrko?autoplay=1&muted=1&controls=0&start=45",
            "https://youtu.be/ULcaooF8Mc8?si=TyDunznKkOLo14Sx",
            "https://youtu.be/EMnQwBTJnMM?si=gRtpW5Gm6kaDDS6J&t=364",
            "https://youtu.be/Dlz_XHeUUis?si=tJLbUeWMp0reyNuI",
            "https://youtu.be/sbTVZMJ9Z2I?si=5RHzQFcp2_oMBmLK&t=11",
            "https://youtu.be/89coO602JNQ?si=wtZ_link6hplw7jY",
            "https://youtu.be/ln1S4uWghz0?si=Z7dl5Ta99hHeJHWg"
        ];

        // Helper function to pick a random video from a list
        const getRandomVideo = (videos) => videos[Math.floor(Math.random() * videos.length)];

        // List of common phrases to look for
        const positivePhrases = [
            "we are glad to",
            "pleased to",
            "congratulations",
            "enrollment confirmation"
            // "admitted",
            // "offer you admission",
        ];
        const negativePhrases = [
            "unfortunately",
            "we regret to inform",
            "sorry",
            "denied",
            "not admitted",
            "unable to offer"
        ];
        const deferredPhrases = [
            "defer",
            "waitlisted",
            "on hold",
            "alternate list",
            "deferment",
        ];

        // Function to check for phrases in image attributes
        const checkImageAttributes = () => {
            const images = document.querySelectorAll('img');
            for (const img of images) {
                const src = img.src.toLowerCase();
                const alt = img.alt ? img.alt.toLowerCase() : '';
                if (
                    [...positivePhrases, ...negativePhrases, ...deferredPhrases].some(
                        (phrase) => src.includes(phrase) || alt.includes(phrase)
                    )
                ) {
                    return true;
                }
            }
            return false;
        };

        // Check for the presence of phrases
        const foundPositive = positivePhrases.some((phrase) => pageText.includes(phrase));
        const foundNegative = negativePhrases.some((phrase) => pageText.includes(phrase));
        const foundDeferred = deferredPhrases.some((phrase) => pageText.includes(phrase));
        const foundInImages = checkImageAttributes();

        // Function to block the page content
        const blockPage = () => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'black';
            overlay.style.zIndex = 9999;
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            // document.body.innerHTML = ''; // Clear the page content
            document.body.appendChild(overlay);
        };

        const convertToEmbedLink = (url) => {
            try {
                const urlObj = new URL(url);

                let videoId = urlObj.searchParams.get("v");
                if (!videoId) {
                    videoId = urlObj.pathname.slice(1);
                }
                if (videoId) {
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

                    // Add other parameters like autoplay, muted, controls
                    const autoplay = urlObj.searchParams.get("autoplay") || "1";
                    const muted = urlObj.searchParams.get("muted") || "1";
                    const controls = urlObj.searchParams.get("controls") || "0";
                    const start = urlObj.searchParams.get("start") || urlObj.searchParams.get("t");
                    console.log(urlObj.searchParams);

                    // Construct the embed URL with additional parameters
                    return `${embedUrl}?autoplay=${autoplay}&muted=${muted}&controls=${controls}${start ? `&start=${start}` : ""}`;
                }
            } catch (error) {
                console.error("Error converting to embed link:", error);
                return url; // Return the original URL if conversion fails
            }
        };


        // Store the original page content
        const originalContent = document.body.innerHTML;

        const playYouTubeEmbed = (src) => {
            // Ensure the URL has autoplay, muted, and controls parameters
            console.log(convertToEmbedLink(src));
            const url = new URL(convertToEmbedLink(src));
            url.searchParams.set('autoplay', '1');
            url.searchParams.set('muted', '1');
            url.searchParams.set('controls', '0');

            // Create the overlay with the iframe
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.bottom = 0;
            overlay.style.right = 0;
            overlay.style.width = '25%';
            overlay.style.height = '25%';
            overlay.style.float = "right";
            // overlay.style.backgroundColor = 'black';
            overlay.style.zIndex = 9999;
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';

            // Add the iframe
            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = url.toString();
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; encrypted-media';
            iframe.allowFullscreen = true;
            overlay.appendChild(iframe);

            // Add the unblock button
            const unblockButton = document.createElement('button');
            unblockButton.textContent = 'Close';
            unblockButton.style.marginTop = '20px';
            unblockButton.style.padding = '10px 20px';
            unblockButton.style.fontSize = '16px';
            unblockButton.style.cursor = 'pointer';
            unblockButton.style.border = 'none';
            unblockButton.style.borderRadius = '5px';
            unblockButton.style.backgroundColor = '#007bff';
            unblockButton.style.color = 'white';
            unblockButton.addEventListener('click', () => {
                document.body.innerHTML = originalContent;
            });
            overlay.appendChild(unblockButton);

            // Clear the page content and add the overlay
            // document.body.innerHTML = '';
            document.body.appendChild(overlay);
        };
        // Block and redirect based on detection
        if (foundPositive || foundInImages || positivePhrases.some((phrase) => pageText.includes(phrase))) {
            playYouTubeEmbed(getRandomVideo(positiveVideos));
        } else if (foundDeferred || foundInImages || deferredPhrases.some((phrase) => pageText.includes(phrase))) {
            playYouTubeEmbed(getRandomVideo(deferredVideos));
        } else if (foundNegative || foundInImages || negativePhrases.some((phrase) => pageText.includes(phrase))) {
            playYouTubeEmbed(getRandomVideo(negativeVideos));
        } else {
            // blockPage();
            // alert("Unable to get application status");
        }
    } else {
        console.log("This is not a .edu or decision-related website.");
    }
})();
