(() => {
  const src = "${STATS_SCRIPT_URL}";
  const websiteId = "${STATS_WEBSITE_ID}";
  const domain = "${STATS_DOMAIN}";

  if (!src.startsWith("https://") || !/^[0-9a-f-]{36}$/i.test(websiteId)) {
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.dataset.websiteId = websiteId;
  if (domain) {
    script.dataset.domains = domain;
  }

  document.head.appendChild(script);
})();
