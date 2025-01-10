// Content script to detect decision letters and take action
const browserAPI = typeof browser !== "undefined" ? browser : chrome;
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

const playYouTubeEmbed = (src, new_tab) => {
    const url = new URL(convertToEmbedLink(src));
    if (new_tab) {
        window.open(url, "_blank");
        return;
    }
    // Ensure the URL has autoplay, muted, and controls parameters
    console.log(convertToEmbedLink(src));
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
const getStorageData = (keys, callback) => {
    browserAPI.storage.sync.get(keys, (data) => {
        if (browser.runtime.lastError) {
            console.error("Error accessing storage:", browser.runtime.lastError);
            callback({});
        } else {
            callback(data || {});
        }
    });
};

getStorageData(
    [
        "videoDisplayMode",
      "positiveVideos",
      "deferredVideos",
      "negativeVideos",
      "collegePortals",
      "acceptanceKeywords",
      "rejectionKeywords",
      "deferralKeywords",
    ],
    (data) => {
      const {
        videoDisplayMode = "",
        positiveVideos = [],
        deferredVideos = [],
        negativeVideos = [],
        collegePortals = [],
        acceptanceKeywords = [],
        rejectionKeywords = [],
        deferralKeywords = [],
      } = data;
  
      const currentURL = window.location.href.toLowerCase();
      const pageText = document.body.innerText.toLowerCase();
  
      // Check if the current page URL matches any known college portal URLs
      const isCollegePortal = collegePortals.some((portal) => currentURL.includes(portal.toLowerCase()));
  
      // Check for keywords in the page text
      const containsAcceptance = acceptanceKeywords.some((keyword) => pageText.includes(keyword.toLowerCase()));
      const containsRejection = rejectionKeywords.some((keyword) => pageText.includes(keyword.toLowerCase()));
      const containsDeferral = deferralKeywords.some((keyword) => pageText.includes(keyword.toLowerCase()));
  
      // Determine the type of decision letter
      let decisionType = null;
      if (containsAcceptance) {
        decisionType = "acceptance";
      } else if (containsRejection) {
        decisionType = "rejection";
      } else if (containsDeferral) {
        decisionType = "deferral";
      }
  
      // If it's a decision letter or a known college portal, block the page and show the video
      if (isCollegePortal && decisionType) {
        console.log("Decision detected:", decisionType || "College portal");
  
        const getRandomVideo = (videos) => videos[Math.floor(Math.random() * videos.length)];
        let videoURL = "";
  
        // Choose a video based on the decision type
        if (decisionType === "acceptance") {
          videoURL = getRandomVideo(positiveVideos, true);
        } else if (decisionType === "rejection") {
          videoURL = getRandomVideo(negativeVideos, true);
        } else if (decisionType === "deferral") {
          videoURL = getRandomVideo(deferredVideos, true);
        }

        console.log(videoURL);
        const mode = videoDisplayMode;
        console.log(mode)
        if (mode) {
            console.log("THIS IS THE MODE " + mode)
            playYouTubeEmbed(videoURL, mode == "newWindow");
        }
      } else {
        console.log("No decision-related content detected on this page.");
      }
    }
  );
  