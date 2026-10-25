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

  function pulse(button, kind) {
    button.classList.remove("is-ack", "is-warn");
    void button.offsetWidth;
    button.classList.add(kind);
    window.clearTimeout(button._pulse);
    button._pulse = window.setTimeout(function () {
      button.classList.remove(kind);
    }, 900);
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
        pulse(button, "is-ack");
        showToast("Coming soon. No contract address is published yet.");
        return;
      }
      var done = function () {
        pulse(button, "is-ack");
        showToast("Copied the contract address.");
      };
      var fail = function () {
        pulse(button, "is-warn");
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
  var desktopNav = window.matchMedia("(min-width: 1040px)");
  function setMenu(open) {
    if (!menuButton || !menu) return;
    var show = open && !desktopNav.matches;
    menu.classList.toggle("is-open", show);
    menuButton.setAttribute("aria-expanded", show ? "true" : "false");
    menuButton.textContent = show ? "Close" : "Menu";
    menu.inert = !desktopNav.matches && !show;
  }
  if (menuButton && menu) {
    setMenu(false);
    menuButton.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
    if (desktopNav.addEventListener) {
      desktopNav.addEventListener("change", function () {
        setMenu(false);
      });
    }
  }

  var sections = ["home", "team", "story", "meme", "apps", "roadmap", "buy"]
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
    button.setAttribute("aria-haspopup", "dialog");
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

  var header = document.querySelector(".site-header");
  if (header) {
    var syncHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  setupKineticTitle();
  setupMascotClip();

  function setupKineticTitle() {
    var title = document.getElementById("home-title");
    var hero = document.querySelector(".hero");
    if (!title || !hero) return;
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var source = (title.getAttribute("data-label") || title.textContent || "").replace(/\s+/g, "");
    if (!source) return;
    title.setAttribute("data-label", source);
    var letters = [];
    var watching = false;
    var scheduled = false;
    var io = null;

    function plain() {
      stop();
      if (io) io.disconnect();
      title.textContent = source;
      title.removeAttribute("aria-label");
      title.removeAttribute("data-kinetic");
      letters = [];
    }

    function split() {
      if (title.getAttribute("data-kinetic") === "on") return;
      title.textContent = "";
      title.setAttribute("aria-label", source);
      title.setAttribute("data-kinetic", "on");
      letters = [];
      for (var i = 0; i < source.length; i++) {
        var span = document.createElement("span");
        span.className = "k-letter";
        span.setAttribute("aria-hidden", "true");
        span.textContent = source.charAt(i);
        title.appendChild(span);
        letters.push(span);
      }
    }

    function paint() {
      scheduled = false;
      if (!letters.length) return;
      var rect = hero.getBoundingClientRect();
      var passed = Math.max(0, -rect.top);
      var travel = Math.max(1, hero.offsetHeight * 0.38);
      var raw = passed / travel;
      var progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      var last = letters.length - 1 || 1;
      for (var i = 0; i < letters.length; i++) {
        var stagger = 0.4 + (i / last) * 0.6;
        letters[i].style.setProperty("--shift", (-(progress * 16 * stagger)).toFixed(2));
      }
    }

    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(paint);
    }

    function start() {
      if (watching) return;
      watching = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      paint();
    }

    function stop() {
      if (!watching) return;
      watching = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }

    function apply() {
      if (motion.matches) {
        plain();
        return;
      }
      split();
      if ("IntersectionObserver" in window) {
        if (!io) {
          io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) start();
              else {
                paint();
                stop();
              }
            });
          });
        }
        io.observe(hero);
      } else {
        start();
      }
      paint();
    }

    apply();
    if (motion.addEventListener) motion.addEventListener("change", apply);
  }

  function setupMascotClip() {
    var video = document.querySelector("[data-clip]");
    var still = document.querySelector("[data-clip-still]");
    var button = document.querySelector("[data-clip-toggle]");
    if (!video || !button) return;
    var src = video.getAttribute("data-src");
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var ready = false;
    var userPaused = false;

    function ensureSrc() {
      if (ready || !src) return;
      if (still && still.getAttribute("src")) video.poster = still.getAttribute("src");
      video.preload = "none";
      video.src = src;
      ready = true;
    }

    function setPressed(on) {
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.textContent = on ? "Pause clip" : "Play clip";
    }

    function play() {
      ensureSrc();
      var pending = video.play();
      if (pending && pending.catch) {
        pending.catch(function () {
          setPressed(false);
        });
      }
    }

    function pause() {
      if (!video.paused) video.pause();
      setPressed(false);
    }

    video.addEventListener("playing", function () {
      video.hidden = false;
      if (still) still.hidden = true;
      setPressed(true);
    });

    button.addEventListener("click", function () {
      if (!video.paused && !video.hidden) {
        userPaused = true;
        pause();
        return;
      }
      userPaused = false;
      play();
    });

    var seen = false;

    function autoplay() {
      if (motion.matches || userPaused || document.hidden) return;
      if (seen) play();
      else pause();
    }

    if ("IntersectionObserver" in window) {
      var clipRoot = video.closest(".team-card") || video;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          seen = entry.isIntersecting;
          autoplay();
        });
      }, { threshold: 0.4 });
      io.observe(clipRoot);
    }

    if (motion.addEventListener) {
      motion.addEventListener("change", function () {
        if (motion.matches) pause();
        else autoplay();
      });
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause();
      else autoplay();
    });
  }
})();
