chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
    mode: "newWindow",
      acceptanceKeywords: [
        "we are glad to",
        "pleased to inform",
        "congratulations",
        "admitted",
        "offer you admission",
        "you have been accepted",
        "welcome to our university",
        "thrilled to inform"
      ],
      rejectionKeywords: [
        "unfortunately",
        "we regret to inform",
        "sorry",
        "denied",
        "not admitted",
        "we cannot offer you admission",
        "we are unable to admit",
        "sorry to inform",
        "cannot offer"
      ],
      deferralKeywords: [
        "defer",
        "waitlisted",
        "on hold",
        "alternate list",
        "deferment",
        "your application has been deferred",
        "your application is under review"
      ],
      positiveVideos: [
        "https://youtu.be/QtyBdguPwGM?si=_Mq03CfP7Z6gqPvF&t=116",
        "https://youtu.be/45Xkbwn1p-E?si=yg-57_ApxEsatyax",
        "https://youtu.be/TMzs6GvsZXU?si=h1lDxjxspyc9X-dG",
        "https://youtu.be/wVRF3SqLUi0?si=w0MLaVmE-voxs9-K"
      ],
      deferredVideos: [
        "https://www.youtube.com/embed/8ENfwSADlC0?autoplay=1&muted=1&controls=0&start=3"
      ],
      negativeVideos: [
        "https://youtu.be/M0pQkacbrko?si=pPKlx3-emcK1ospK",
        "https://youtu.be/ULcaooF8Mc8?si=TyDunznKkOLo14Sx",
        "https://youtu.be/EMnQwBTJnMM?si=gRtpW5Gm6kaDDS6J&t=364",
        "https://youtu.be/Dlz_XHeUUis?si=tJLbUeWMp0reyNuI",
        "https://youtu.be/sbTVZMJ9Z2I?si=5RHzQFcp2_oMBmLK&t=11",
        "https://youtu.be/89coO602JNQ?si=wtZ_link6hplw7jY",
        "https://youtu.be/ln1S4uWghz0?si=Z7dl5Ta99hHeJHWg"
      ],
      collegePortals: [
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
        "https://ivyhub-simulators.andressevilla.com/"
      ]
    });
    console.log("Default settings have been loaded.");
  });
  