(() => {
  "use strict";

  const mountedFilms = new WeakSet();
  const config = window.MONOExperienceConfig;
  const manifest = window.MONOCinematicAssets;
  const runtime = config?.runtime || {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: Boolean(navigator.connection?.saveData),
    flags: { cinematicAutoplay: true, videoBadges: true }
  };

  const track = (action, element) => {
    if (typeof window.MONOTrackEvent === "function") {
      window.MONOTrackEvent(action, element || document.body);
    }
  };

  const readSeen = (asset) => {
    if (!asset?.sessionMemory || !asset.sessionKey) return false;
    return config?.safeStorage?.get(window.sessionStorage, asset.sessionKey, "false") === "true";
  };

  const writeSeen = (asset, value) => {
    if (!asset?.sessionMemory || !asset.sessionKey) return;
    if (value) config?.safeStorage?.set(window.sessionStorage, asset.sessionKey, "true");
    else config?.safeStorage?.remove(window.sessionStorage, asset.sessionKey);
  };

  const dispatchState = (container, asset, state) => {
    container.dataset.cinematicState = state;
    container.dispatchEvent(new CustomEvent("mono:cinematic-state", {
      bubbles: true,
      detail: { assetId: asset.id, state }
    }));
  };

  const setSources = (video, sources) => {
    if (!video || video.dataset.sourcesAttached === "true") return;
    video.querySelectorAll("source").forEach((source) => source.remove());
    sources.filter((source) => source?.src).forEach((sourceData) => {
      const source = document.createElement("source");
      source.src = sourceData.src;
      source.type = sourceData.type;
      video.append(source);
    });
    video.dataset.sourcesAttached = "true";
    try {
      video.load();
    } catch (error) {
      video.dataset.mediaError = "load";
    }
  };

  const safePlay = (video) => {
    if (!video) return Promise.resolve(false);
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    return playPromise?.then(() => true).catch(() => false) || Promise.resolve(true);
  };

  const ensureFilmChrome = (film, asset) => {
    film.removeAttribute("aria-hidden");
    film.setAttribute("role", "group");
    film.setAttribute("aria-label", asset.title);

    let badge = film.querySelector(".cinematic-film__badge, .chapter-film__badge");
    if (asset.badge && runtime.flags.videoBadges && !badge) {
      badge = document.createElement("span");
      badge.className = film.classList.contains("chapter-film") ? "chapter-film__badge" : "cinematic-film__badge";
      badge.setAttribute("aria-hidden", "true");
      badge.innerHTML = '<img data-cinematic-badge alt="">';
      film.append(badge);
    }

    if (badge) {
      const badgeImage = badge.querySelector("img") || badge.appendChild(document.createElement("img"));
      badgeImage.src = asset.badgeAsset;
      badgeImage.alt = "";
      film.style.setProperty("--video-badge-size", asset.badgeSize || "72px");
      film.style.setProperty("--video-badge-right", asset.badgeRight || "16px");
      film.style.setProperty("--video-badge-bottom", asset.badgeBottom || "16px");
      film.style.setProperty("--video-badge-bg", asset.badgeBackground || "var(--mono-video-badge-bg)");
      film.style.setProperty("--video-badge-logo-scale", String(asset.badgeLogoScale || 0.76));
      film.style.setProperty("--video-badge-border", asset.badgeBorder || "1px solid rgb(var(--mono-gold-rgb) / 0.65)");
      film.style.setProperty("--video-badge-shadow", asset.badgeShadow || "0 10px 30px rgb(var(--mono-anthracite-rgb) / 0.2)");
    }

    let skip = film.querySelector("[data-cinematic-skip]");
    if (asset.skip && !skip) {
      skip = document.createElement("button");
      skip.className = "cinematic-film__control cinematic-film__skip";
      skip.type = "button";
      skip.dataset.cinematicSkip = "";
      skip.dataset.cursorLabel = "SALTA";
      skip.setAttribute("aria-label", "Salta il video");
      skip.textContent = "Salta";
      skip.hidden = true;
      film.append(skip);
    }

    let replay = film.querySelector("[data-cinematic-replay]");
    if (asset.replay && !replay) {
      replay = document.createElement("button");
      replay.className = "cinematic-film__control cinematic-film__replay";
      replay.type = "button";
      replay.dataset.cinematicReplay = "";
      replay.dataset.cursorLabel = "RIVEDI";
      replay.setAttribute("aria-label", "Rivedi il video");
      replay.textContent = "Rivedi";
      replay.hidden = true;
      film.append(replay);
    }

    return { badge, skip, replay };
  };

  const mountFilm = (film) => {
    if (!film || mountedFilms.has(film)) return;
    const asset = manifest?.byId?.[film.dataset.assetId];
    const video = film.querySelector("[data-cinematic-video]");
    const poster = film.querySelector("[data-cinematic-poster]");
    if (!asset || !video || !poster || asset.status === "missing-master" || !asset.posterWebp) return;

    mountedFilms.add(film);
    film.dataset.cinematicMounted = "true";
    const chrome = ensureFilmChrome(film, asset);
    const playOnce = (asset.playbackMode || asset.playback) === "once";
    const motionLimited = runtime.reducedMotion || runtime.saveData || !runtime.flags.cinematicAutoplay;
    const threshold = Math.min(0.9, Math.max(0.05, Number(asset.visibilityThreshold) || 0.35));
    let hasFinished = readSeen(asset);
    let isVisible = false;
    let manual = false;
    let loadObserver;
    let playbackObserver;

    poster.src = asset.posterWebp;
    poster.width = asset.width || 1280;
    poster.height = asset.height || 720;
    poster.decoding = "async";
    video.poster = asset.posterWebp;
    video.width = asset.width || 1280;
    video.height = asset.height || 720;
    video.autoplay = false;
    video.loop = false;
    video.controls = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "none";
    film.style.setProperty("--film-aspect-ratio", asset.aspectRatio || "16 / 9");
    film.style.setProperty("--cinematic-object-fit", asset.objectFit || "cover");
    film.style.setProperty("--cinematic-object-position", asset.objectPosition || "center center");

    const sync = (state) => {
      film.classList.toggle("is-playing", state === "playing");
      film.classList.toggle("is-complete", state === "complete");
      film.classList.toggle("is-poster-only", state === "poster");
      chrome.skip && (chrome.skip.hidden = state !== "playing");
      if (chrome.replay) {
        chrome.replay.hidden = !(state === "complete" || state === "poster");
        const firstManualPlay = state === "poster" && !hasFinished;
        chrome.replay.textContent = firstManualPlay ? "Guarda" : "Rivedi";
        chrome.replay.dataset.cursorLabel = firstManualPlay ? "GUARDA" : "RIVEDI";
        chrome.replay.setAttribute("aria-label", firstManualPlay ? "Guarda il video" : "Rivedi il video");
      }
      dispatchState(film, asset, state);
    };

    const attach = () => setSources(video, asset.sources || []);
    const finish = (reason, remember = true) => {
      hasFinished = true;
      video.pause();
      if (remember) writeSeen(asset, true);
      sync("complete");
      if (reason) track(`video_${reason}`, film);
    };
    const play = async ({ userInitiated = false } = {}) => {
      if (document.hidden || hasFinished || (!isVisible && !userInitiated)) return;
      if (motionLimited && !userInitiated) return;
      manual = manual || userInitiated;
      attach();
      film.classList.add("is-ready");
      if (userInitiated && video.readyState < 1) {
        await new Promise((resolve) => video.addEventListener("loadedmetadata", resolve, { once: true }));
      }
      const didPlay = await safePlay(video);
      if (!didPlay) sync("poster");
    };
    const replay = () => {
      hasFinished = false;
      manual = true;
      writeSeen(asset, false);
      attach();
      const restart = () => {
        try { video.currentTime = 0; } catch (error) { video.dataset.mediaError = "seek"; }
        play({ userInitiated: true });
      };
      if (video.readyState >= 1) restart();
      else video.addEventListener("loadedmetadata", restart, { once: true });
      track("video_replay", film);
    };

    video.addEventListener("playing", () => {
      sync("playing");
      track("video_start", film);
    });
    video.addEventListener("pause", () => {
      if (!hasFinished && !video.ended) sync(motionLimited && !manual ? "poster" : "paused");
    });
    video.addEventListener("ended", () => playOnce && finish("complete"));
    video.addEventListener("timeupdate", () => {
      if (playOnce && video.duration && video.currentTime >= video.duration - 0.18) finish("complete");
    });
    video.addEventListener("error", () => {
      film.dataset.mediaError = "video";
      sync("poster");
      track("video_error", film);
    });
    if (chrome.skip) chrome.skip.onclick = () => finish("skip");
    if (chrome.replay) chrome.replay.onclick = replay;

    if (hasFinished) sync("complete");
    else if (motionLimited) sync("poster");
    else sync("idle");

    if (!("IntersectionObserver" in window)) {
      isVisible = true;
      if (!hasFinished && !motionLimited) play();
      return;
    }

    loadObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !hasFinished && !motionLimited) {
        attach();
        loadObserver.disconnect();
      }
    }, { rootMargin: "420px 0px", threshold: 0.01 });

    playbackObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio >= threshold;
        if (isVisible) play();
        else if (!entry.isIntersecting || !manual) video.pause();
      });
    }, { threshold: [0, threshold, 0.7] });

    loadObserver.observe(film);
    playbackObserver.observe(film);
    const visibilityHandler = () => document.hidden ? video.pause() : play();
    document.addEventListener("visibilitychange", visibilityHandler);
    window.addEventListener("pagehide", () => {
      video.pause();
      loadObserver.disconnect();
      playbackObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityHandler);
    }, { once: true });
  };

  const mountHome = () => {
    const hero = document.querySelector("[data-cinema-hero]");
    const asset = manifest?.byId?.["mono-fire-ravioli"];
    if (!hero || !asset || hero.dataset.cinematicMounted === "true") return;
    hero.dataset.cinematicMounted = "true";

    const trackElement = hero.querySelector("[data-cinema-track]");
    const stage = hero.querySelector(".cinema-stage");
    const fireVideo = hero.querySelector('[data-video="fire"] video');
    const pastaVideo = hero.querySelector('[data-video="pasta"] video');
    const pauseButton = hero.querySelector("[data-cinema-pause]");
    if (!trackElement || !stage || !fireVideo || !pastaVideo) return;

    const fireSources = asset.sources || [];
    const pastaSources = [
      { src: asset.companion?.desktopWebm, type: "video/webm" },
      { src: asset.companion?.desktopMp4, type: "video/mp4" }
    ];
    const motionLimited = runtime.reducedMotion || runtime.saveData || !runtime.flags.cinematicAutoplay;
    const mobile = window.matchMedia("(max-width: 820px)");
    const chrome = ensureFilmChrome(hero, asset);
    let active = false;
    let started = false;
    let transitioned = false;
    let finished = readSeen(asset);
    let paused = false;
    let mobileTimer = 0;
    let scrollFrame = 0;

    hero.setAttribute("role", "group");
    hero.setAttribute("aria-label", "Fuoco e ravioli — film manifesto MONO");
    fireVideo.poster = asset.posterWebp;
    pastaVideo.poster = asset.companion?.posterWebp || asset.posterWebp;
    fireVideo.loop = false;
    pastaVideo.loop = false;
    fireVideo.preload = "none";
    pastaVideo.preload = "none";
    fireVideo.muted = pastaVideo.muted = true;
    fireVideo.defaultMuted = pastaVideo.defaultMuted = true;
    fireVideo.playsInline = pastaVideo.playsInline = true;

    if (chrome.badge) {
      chrome.badge.classList.add("cinema-film-badge");
      stage.append(chrome.badge);
    }
    const controlWrap = document.createElement("div");
    controlWrap.className = "cinema-cinematic-controls";
    if (chrome.skip) controlWrap.append(chrome.skip);
    if (chrome.replay) controlWrap.append(chrome.replay);
    hero.querySelector(".cinema-sticky")?.append(controlWrap);

    const sync = (state) => {
      hero.dataset.cinematicState = state;
      chrome.skip && (chrome.skip.hidden = state !== "playing");
      if (chrome.replay) {
        chrome.replay.hidden = !(state === "complete" || state === "poster");
        chrome.replay.textContent = state === "poster" && !finished ? "Guarda" : "Rivedi";
        chrome.replay.dataset.cursorLabel = state === "poster" && !finished ? "GUARDA" : "RIVEDI";
      }
      dispatchState(hero, asset, state);
    };

    const setStage = (value) => hero.setAttribute("data-stage", value);
    const stopAll = () => {
      fireVideo.pause();
      pastaVideo.pause();
      window.clearTimeout(mobileTimer);
    };
    const finish = (reason = "complete") => {
      if (finished && reason !== "replay") return;
      finished = true;
      transitioned = true;
      stopAll();
      hero.classList.add("is-transitioned", "pasta-ready");
      setStage("3");
      writeSeen(asset, true);
      sync("complete");
      track(`video_${reason}`, hero);
    };
    const updatePastaStage = () => {
      if (pastaVideo.currentTime < 1.6) setStage("t");
      else if (pastaVideo.currentTime < 5) setStage("2");
      else setStage("3");
    };
    const transitionToPasta = async () => {
      if (transitioned || finished) return;
      transitioned = true;
      setSources(pastaVideo, pastaSources);
      fireVideo.pause();
      hero.classList.add("is-transitioned", "pasta-ready");
      setStage("t");
      try { pastaVideo.currentTime = 0; } catch (error) { pastaVideo.dataset.mediaError = "seek"; }
      if (!paused) {
        const didPlay = await safePlay(pastaVideo);
        if (!didPlay) sync("poster");
      }
    };
    const start = async ({ userInitiated = false } = {}) => {
      if (!active && !userInitiated) return;
      if (motionLimited && !userInitiated) return;
      if (started && !userInitiated) {
        if (transitioned) await safePlay(pastaVideo);
        else await safePlay(fireVideo);
        return;
      }
      started = true;
      finished = false;
      writeSeen(asset, false);
      setSources(fireVideo, fireSources);
      hero.classList.remove("is-transitioned");
      transitioned = false;
      setStage("1");
      try { fireVideo.currentTime = 0; } catch (error) { fireVideo.dataset.mediaError = "seek"; }
      const didPlay = await safePlay(fireVideo);
      if (!didPlay) sync("poster");
      if (mobile.matches) {
        window.clearTimeout(mobileTimer);
        mobileTimer = window.setTimeout(transitionToPasta, 1800);
      }
    };
    const resetAndReplay = () => {
      finished = false;
      started = false;
      paused = false;
      writeSeen(asset, false);
      sync("playing");
      start({ userInitiated: true });
      track("video_replay", hero);
    };
    const updateScroll = () => {
      scrollFrame = 0;
      if (!active || paused || mobile.matches || transitioned || finished) return;
      const bounds = trackElement.getBoundingClientRect();
      const total = Math.max(1, trackElement.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -bounds.top / total));
      hero.style.setProperty("--progress", progress.toFixed(4));
      if (progress >= 0.2) transitionToPasta();
    };
    const requestScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    };

    fireVideo.addEventListener("playing", () => sync("playing"));
    fireVideo.addEventListener("ended", transitionToPasta);
    fireVideo.addEventListener("error", transitionToPasta);
    pastaVideo.addEventListener("playing", () => sync("playing"));
    pastaVideo.addEventListener("timeupdate", updatePastaStage);
    pastaVideo.addEventListener("ended", () => finish("complete"));
    pastaVideo.addEventListener("error", () => finish("error"));
    if (chrome.skip) chrome.skip.onclick = () => finish("skip");
    if (chrome.replay) chrome.replay.onclick = resetAndReplay;
    pauseButton?.addEventListener("click", () => {
      paused = !paused;
      if (paused) {
        stopAll();
        pauseButton.textContent = "▶ Riprendi";
        pauseButton.setAttribute("aria-label", "Riprendi l'animazione");
      } else {
        pauseButton.textContent = "⏸ Pausa";
        pauseButton.setAttribute("aria-label", "Metti in pausa l'animazione");
        if (transitioned) safePlay(pastaVideo); else safePlay(fireVideo);
      }
    });

    if (finished || motionLimited) {
      hero.classList.add("is-transitioned", "pasta-ready");
      setStage("3");
      sync(finished ? "complete" : "poster");
    } else {
      sync("idle");
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        active = entries.some((entry) => entry.isIntersecting);
        if (active && !finished && !motionLimited && !paused) start();
        if (!active) stopAll();
      }, { rootMargin: "10% 0px", threshold: 0.01 });
      observer.observe(hero);
      window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
    } else {
      active = true;
      if (!finished && !motionLimited) start();
    }
    window.addEventListener("scroll", requestScroll, { passive: true });
    window.addEventListener("resize", requestScroll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAll();
      else if (active && !finished && !paused && !motionLimited) {
        if (transitioned) safePlay(pastaVideo); else safePlay(fireVideo);
      }
    });
  };

  const mountSupportingStill = () => {
    if (!document.body.classList.contains("convivium-page") || document.querySelector("[data-cinematic-still='mono-hands-team']")) return;
    const asset = manifest?.byId?.["mono-hands-team"];
    const hero = document.querySelector(".convivium-page .hero");
    if (!asset?.posterWebp || !hero) return;
    const still = document.createElement("figure");
    still.className = "mono-cinematic-still";
    still.dataset.cinematicStill = asset.id;
    still.innerHTML = `
      <img src="${asset.posterWebp}" alt="" width="${asset.width || 1280}" height="${asset.height || 720}" loading="lazy" decoding="async">
      <span class="mono-cinematic-still__badge" aria-hidden="true"><img src="${asset.badgeAsset}" alt=""></span>
      <figcaption>${asset.title}</figcaption>`;
    still.style.setProperty("--video-badge-size", asset.badgeSize || "72px");
    still.style.setProperty("--video-badge-right", asset.badgeRight || "16px");
    still.style.setProperty("--video-badge-bottom", asset.badgeBottom || "16px");
    hero.after(still);
  };

  const mountAll = () => {
    document.querySelectorAll("[data-chapter-film]").forEach(mountFilm);
    mountSupportingStill();
  };

  window.MONOCinematicController = Object.freeze({
    version: "20260714-engineering-master-v1",
    controlsHome: true,
    mountFilm,
    mountAll,
    mountHome
  });
})();
