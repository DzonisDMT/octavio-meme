(function () {
  var config = window.OCTAVIO_CONFIG || {};

  function isPlaceholder(value) {
    if (value == null) return true;
    var text = String(value).trim();
    if (!text) return true;
    if (/^\[?\s*ca\s*\]?$/i.test(text)) return true;
    if (/coming soon/i.test(text)) return true;
    if (/placeholder/i.test(text)) return true;
    return false;
  }

  function httpUrl(value) {
    if (!value) return "";
    try {
      var url = new URL(String(value).trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") return "";
      return url.href;
    } catch (error) {
      return "";
    }
  }

  var toast = document.querySelector("[data-toast]");
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-on");
    }, 2800);
  }

  var ca = config.ca;
  var placeholder = isPlaceholder(ca);
  var caText = placeholder ? "[CA]" : String(ca).trim();

  document.querySelectorAll("[data-ca-value]").forEach(function (node) {
    node.textContent = caText;
  });

  document.querySelectorAll("[data-ca-status]").forEach(function (node) {
    node.textContent = placeholder ? "Coming soon" : "Published";
    node.classList.toggle("is-live", !placeholder);
  });

  document.querySelectorAll("[data-ca-help]").forEach(function (node) {
    node.hidden = !placeholder;
  });

  document.querySelectorAll("[data-copy-ca]").forEach(function (button) {
    if (placeholder) {
      button.textContent = "CA coming soon";
      button.setAttribute("aria-label", "Contract address coming soon");
    } else {
      button.textContent = "Copy CA";
      button.setAttribute("aria-label", "Copy contract address");
    }
    button.addEventListener("click", function () {
      if (placeholder) {
        showToast("Coming soon. No contract address is published yet.");
        return;
      }
      var done = function () {
        showToast("Copied the contract address.");
      };
      var fail = function () {
        showToast("Could not copy. Select the address and copy it yourself.");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(caText).then(done).catch(fail);
      } else {
        fail();
      }
    });
  });

  var menuButton = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector("[data-nav]");
  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        menu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  var sections = ["home", "story", "meme", "apps", "roadmap", "buy"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav] a"));

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var on = link.getAttribute("href") === "#" + entry.target.id;
            if (on) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  var dialog = document.querySelector("[data-lightbox]");
  var lightboxImg = document.querySelector("[data-lightbox-img]");
  var lightboxCap = document.querySelector("[data-lightbox-cap]");

  document.querySelectorAll("[data-beat]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!dialog || !lightboxImg) return;
      var img = button.querySelector("img");
      lightboxImg.src = img ? img.src : "";
      lightboxImg.alt = img ? img.alt : "";
      if (lightboxCap) lightboxCap.textContent = button.getAttribute("data-caption") || "";
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
  });

  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  }

  var card = document.querySelector("[data-dapp='pixellotto']");
  var siteUrl = httpUrl(config.pixellottoUrl);
  if (card && siteUrl) {
    var status = card.querySelector("[data-dapp-status]");
    var note = card.querySelector("[data-dapp-note]");
    if (status) {
      status.textContent = "Site";
      status.classList.add("is-live");
    }
    if (note) {
      note.hidden = false;
      var link = document.createElement("a");
      link.href = siteUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "text-link";
      link.textContent = "Open PixelLotto";
      var hint = document.createElement("span");
      hint.className = "sr-only";
      hint.textContent = " (opens in a new tab)";
      link.appendChild(hint);
      note.textContent = "";
      note.appendChild(link);
    }
  }
})();
