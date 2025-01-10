document.addEventListener("DOMContentLoaded", () => {
    const safelyGetElement = (id) => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`Element with id '${id}' not found.`);
      }
      return element;
    };
  
    // Function to set up UI for a category
    const setupUI = (storageKey, datalistId, listId) => {
      const datalist = safelyGetElement(datalistId);
      const listElement = safelyGetElement(listId);
  
      if (!datalist || !listElement) return;
  
      chrome.storage.sync.get([storageKey], (result) => {
        const items = result[storageKey] || [];
        items.forEach((item) => {
          // Add item to datalist for autocomplete
          const option = document.createElement("option");
          option.value = item;
          datalist.appendChild(option);
  
          // Add item to list for display and removal
          const li = document.createElement("li");
          li.textContent = item;
          li.className = "removable";
          li.addEventListener("click", () => removeItem(item, storageKey, li, option));
          listElement.appendChild(li);
        });
      });
    };
  
    // Function to add new item
    const addItem = (inputId, datalistId, listId, storageKey) => {
      const input = safelyGetElement(inputId);
      const datalist = safelyGetElement(datalistId);
      const listElement = safelyGetElement(listId);
  
      if (!input || !datalist || !listElement) return;
  
      const value = input.value.trim();
      if (value) {
        chrome.storage.sync.get([storageKey], (result) => {
          const items = result[storageKey] || [];
          if (!items.includes(value)) {
            items.push(value);
            chrome.storage.sync.set({ [storageKey]: items }, () => {
              // Add item to datalist
              const option = document.createElement("option");
              option.value = value;
              datalist.appendChild(option);
  
              // Add item to list
              const li = document.createElement("li");
              li.textContent = value;
              li.className = "removable";
              li.addEventListener("click", () => removeItem(value, storageKey, li, option));
              listElement.appendChild(li);
            });
          }
        });
        input.value = "";
      }
    };
  
    // Function to remove an item
    const removeItem = (value, storageKey, listItem, datalistOption) => {
      chrome.storage.sync.get([storageKey], (result) => {
        let items = result[storageKey] || [];
        items = items.filter((item) => item !== value);
        chrome.storage.sync.set({ [storageKey]: items }, () => {
          if (listItem) listItem.remove();
          if (datalistOption) datalistOption.remove();
        });
      });
    };
  
    // Setup UI for all categories
    setupUI("positiveVideos", "positive-videos", "positive-video-list");
    setupUI("deferredVideos", "deferred-videos", "deferred-video-list");
    setupUI("negativeVideos", "negative-videos", "negative-video-list");
    setupUI("collegePortals", "college-portals", "college-portal-list");
    setupUI("acceptanceKeywords", "acceptance-keywords-list", "acceptance-keyword-list");
    setupUI("rejectionKeywords", "rejection-keywords-list", "rejection-keyword-list");
    setupUI("deferralKeywords", "deferral-keywords-list", "deferral-keyword-list");
  
    // Add event listeners for adding new items
    safelyGetElement("add-positive")?.addEventListener("click", () =>
      addItem("positive-video", "positive-videos", "positive-video-list", "positiveVideos")
    );
    safelyGetElement("add-deferred")?.addEventListener("click", () =>
      addItem("deferred-video", "deferred-videos", "deferred-video-list", "deferredVideos")
    );
    safelyGetElement("add-negative")?.addEventListener("click", () =>
      addItem("negative-video", "negative-videos", "negative-video-list", "negativeVideos")
    );
    safelyGetElement("add-college-portal")?.addEventListener("click", () =>
      addItem("college-portal", "college-portals", "college-portal-list", "collegePortals")
    );
    safelyGetElement("add-acceptance-keyword")?.addEventListener("click", () =>
      addItem("acceptance-keyword", "acceptance-keywords-list", "acceptance-keyword-list", "acceptanceKeywords")
    );
    safelyGetElement("add-rejection-keyword")?.addEventListener("click", () =>
      addItem("rejection-keyword", "rejection-keywords-list", "rejection-keyword-list", "rejectionKeywords")
    );
    safelyGetElement("add-deferral-keyword")?.addEventListener("click", () =>
      addItem("deferral-keyword", "deferral-keywords-list", "deferral-keyword-list", "deferralKeywords")
    );

    document.addEventListener("DOMContentLoaded", () => {
        const modeNewWindow = document.getElementById("mode-new-window");
        const modeBottomRight = document.getElementById("mode-bottom-right");
    
        // Load the current setting
        chrome.storage.sync.get("videoDisplayMode", (data) => {
            const mode = data.videoDisplayMode || "bottomRight";
            if (mode === "newWindow") {
                modeNewWindow.checked = true;
            } else {
                modeBottomRight.checked = true;
            }
        });
    
        // Save the selected mode when changed
        const saveMode = (mode) => {
            chrome.storage.sync.set({ videoDisplayMode: mode });
        };
    
        modeNewWindow.addEventListener("change", () => saveMode("newWindow"));
        modeBottomRight.addEventListener("change", () => saveMode("bottomRight"));
    });
  });
  