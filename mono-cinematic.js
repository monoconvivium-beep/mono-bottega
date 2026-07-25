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
  const AUDIO_STORAGE_KEY = "mono-video-sound";
  const AUDIO_VOLUME = 0.44;
  const audioVideos = new Set();
  const audioControls = new Set();

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

  const readAudioPreference = () => {
    try {
      const value = window.sessionStorage.getItem(AUDIO_STORAGE_KEY);
      return value === "on" || value === "off" ? value : "on";
    } catch (error) {
      return "on";
    }
  };

  const writeAudioPreference = (value) => {
    try {
      window.sessionStorage.setItem(AUDIO_STORAGE_KEY, value);
    } catch (error) {
      document.documentElement.dataset.audioStorage = "unavailable";
    }
  };

  const setVideoMuted = (video, muted) => {
    if (!video) return;
    video.muted = muted;
    video.defaultMuted = muted;
    if (!muted) video.volume = AUDIO_VOLUME;
  };

  const updateAudioButton = (button, video) => {
    if (!button || !video) return;
    const enabled = video.dataset.hasAudio === "true" && !video.muted;
    const label = enabled ? "Disattiva audio" : "Attiva audio";
    button.dataset.audioState = enabled ? "on" : "off";
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", label);
    const labelElement = button.querySelector("[data-cinematic-audio-label]");
    if (labelElement) labelElement.textContent = label;
  };

  const syncAudioControls = () => {
    audioControls.forEach((control) => updateAudioButton(control.button, control.getVideo()));
  };

  const muteOtherVideos = (activeVideo) => {
    audioVideos.forEach((video) => {
      if (video !== activeVideo) setVideoMuted(video, true);
    });
  };

  const setSources = (video, sources, hasAudio = false) => {
    if (!video) return;
    const signature = sources.filter((source) => source?.src).map((source) => `${source.type || ""}:${source.src}`).join("|");
    if (video.dataset.sourceSignature === signature) return;
    video.querySelectorAll("source").forEach((source) => source.remove());
    sources.filter((source) => source?.src).forEach((sourceData) => {
      const source = document.createElement("source");
      source.src = sourceData.src;
      source.type = sourceData.type;
      video.append(source);
    });
    video.dataset.sourceSignature = signature;
    video.dataset.hasAudio = String(Boolean(hasAudio));
    if (hasAudio) audioVideos.add(video);
    try {
      video.load();
    } catch (error) {
      video.dataset.mediaError = "load";
    }
  };

  const safePlay = async (video, { preferSound = true } = {}) => {
    if (!video) return false;
    const hasAudio = video.dataset.hasAudio === "true";
    const wantsSound = hasAudio && preferSound && readAudioPreference() !== "off";

    if (wantsSound) {
      muteOtherVideos(video);
      setVideoMuted(video, false);
      try {
        await video.play();
        syncAudioControls();
        return true;
      } catch (error) {
        video.dataset.audioAutoplay = "blocked";
      }
    }

    setVideoMuted(video, true);
    try {
      await video.play();
      syncAudioControls();
      return true;
    } catch (error) {
      syncAudioControls();
      return false;
    }
  };

  const bindAudioControl = (button, getVideo, owner, prepare = () => {}) => {
    if (!button) return;
    const control = { button, getVideo };
    audioControls.add(control);
    button.addEventListener("click", async () => {
      const video = getVideo();
      if (!video) return;
      prepare(video);
      const enable = video.muted || readAudioPreference() === "off";
      writeAudioPreference(enable ? "on" : "off");
      if (enable) {
        video.dataset.audioAutoplay = "user-enabled";
        await safePlay(video, { preferSound: true });
      } else {
        setVideoMuted(video, true);
        syncAudioControls();
      }
      window.dispatchEvent(new CustomEvent("mono:audio-preference", {
        detail: { enabled, assetId: owner?.dataset?.assetId || "home" }
      }));
      track(enable ? "video_audio_on" : "video_audio_off", owner || button);
    });
    updateAudioButton(button, getVideo());
  };

  const armAutomaticAudioUnlock = () => {
    let armed = true;
    const disarm = () => {
      if (!armed) return;
      armed = false;
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("wheel", unlock);
      document.removeEventListener("keydown", unlock);
    };
    const unlock = async (event) => {
      if (!armed) return;
      if (event.target instanceof Element && event.target.closest("[data-cinematic-audio]")) return;
      if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
      if (readAudioPreference() === "off") {
        disarm();
        return;
      }
      const activeVideo = [...audioVideos].find((video) => !video.paused && !video.ended && video.dataset.hasAudio === "true");
      if (!activeVideo) {
        // La gesture e' arrivata PRIMA che il video partisse (rete lenta del
        // telefono): non sprecarla. Appena un video con audio parte, lo si
        // accende una volta sola. Senza questo, chi tocca lo schermo troppo
        // presto restava muto e credeva che "l'audio non parte da solo".
        // Non si disarma: se questo non basta, un tocco successivo riprova.
        audioVideos.forEach((video) => {
          if (video.dataset.hasAudio !== "true") return;
          video.addEventListener("playing", function accePrimaCheParta() {
            video.removeEventListener("playing", accePrimaCheParta);
            if (readAudioPreference() === "off") return;
            muteOtherVideos(video);
            setVideoMuted(video, false);
            video.play().then(() => {
              writeAudioPreference("on");
              video.dataset.audioAutoplay = "gesture-deferred";
              syncAudioControls();
            }).catch(() => { setVideoMuted(video, true); syncAudioControls(); });
          });
        });
        return;
      }
      muteOtherVideos(activeVideo);
      setVideoMuted(activeVideo, false);
      try {
        await activeVideo.play();
        writeAudioPreference("on");
        activeVideo.dataset.audioAutoplay = "gesture-enabled";
        syncAudioControls();
        track("video_audio_auto_unlocked", activeVideo.closest("[data-cinema-hero], [data-chapter-film]") || activeVideo);
        disarm();
      } catch (error) {
        setVideoMuted(activeVideo, true);
        syncAudioControls();
      }
    };
    // Il PIU' PRESTO possibile: qualunque cosa faccia il visitatore accende
    // l'audio. pointerdown+touchstart = tocco sul telefono; wheel = primo
    // scroll col mouse su PC (la prima cosa che fa quasi tutti). I browser
    // NON permettono l'audio prima di un gesto: questo e' il minimo gesto.
    document.addEventListener("pointerdown", unlock, { passive: true });
    document.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("wheel", unlock, { passive: true });
    document.addEventListener("keydown", unlock);
    window.addEventListener("pagehide", disarm, { once: true });
  };

  armAutomaticAudioUnlock();

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
      replay.setAttribute("aria-label", "Rivedi il video");
      replay.textContent = "Rivedi";
      replay.hidden = true;
      film.append(replay);
    }

    let audio = film.querySelector("[data-cinematic-audio]");
    if (asset.audio && asset.masterAudio && !audio) {
      audio = document.createElement("button");
      audio.className = "cinematic-film__control cinematic-film__audio";
      audio.type = "button";
      audio.dataset.cinematicAudio = "";
      audio.dataset.audioState = "off";
      audio.setAttribute("aria-pressed", "false");
      audio.setAttribute("aria-label", "Attiva audio");
      audio.innerHTML = '<svg class="cinematic-film__audio-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor"/><path class="cinematic-audio-waves" d="M16 8.5c1.3 1.7 1.3 5.3 0 7M19 6c2.8 3.2 2.8 8.8 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path class="cinematic-audio-muted" d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span data-cinematic-audio-label>Attiva audio</span>';
      film.append(audio);
    }

    return { badge, skip, replay, audio };
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
    const playbackSources = asset.audioSources?.length ? asset.audioSources : asset.sources || [];
    const hasAudio = Boolean(asset.audio && asset.masterAudio && asset.audioSources?.length);
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
    setVideoMuted(video, true);
    video.dataset.hasAudio = String(hasAudio);
    if (hasAudio) audioVideos.add(video);
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
        chrome.replay.setAttribute("aria-label", firstManualPlay ? "Guarda il video" : "Rivedi il video");
      }
      dispatchState(film, asset, state);
    };

    const attach = () => setSources(video, playbackSources, hasAudio);
    if (chrome.audio) bindAudioControl(chrome.audio, () => video, film, attach);
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
      const didPlay = await safePlay(video, { preferSound: true });
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

    const fireSources = asset.audioSources?.length ? asset.audioSources : asset.sources || [];
    const pastaSources = asset.companion?.master && asset.companion?.masterAudio
      ? [{ src: asset.companion.master, type: "video/mp4" }]
      : [
          { src: asset.companion?.desktopWebm, type: "video/webm" },
          { src: asset.companion?.desktopMp4, type: "video/mp4" }
        ];
    const fireHasAudio = Boolean(asset.audio && asset.masterAudio && asset.audioSources?.length);
    const pastaHasAudio = Boolean(asset.companion?.audio && asset.companion?.masterAudio && asset.companion?.master);
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
    setVideoMuted(fireVideo, true);
    setVideoMuted(pastaVideo, true);
    fireVideo.dataset.hasAudio = String(fireHasAudio);
    pastaVideo.dataset.hasAudio = String(pastaHasAudio);
    if (fireHasAudio) audioVideos.add(fireVideo);
    if (pastaHasAudio) audioVideos.add(pastaVideo);
    fireVideo.playsInline = pastaVideo.playsInline = true;

    if (chrome.badge) {
      chrome.badge.classList.add("cinema-film-badge");
      stage.append(chrome.badge);
    }
    const controlWrap = document.createElement("div");
    controlWrap.className = "cinema-cinematic-controls";
    if (chrome.audio) controlWrap.append(chrome.audio);
    if (chrome.skip) controlWrap.append(chrome.skip);
    if (chrome.replay) controlWrap.append(chrome.replay);
    hero.querySelector(".cinema-sticky")?.append(controlWrap);
    if (chrome.audio) {
      bindAudioControl(chrome.audio, () => transitioned ? pastaVideo : fireVideo, hero, () => {
        if (transitioned) setSources(pastaVideo, pastaSources, pastaHasAudio);
        else setSources(fireVideo, fireSources, fireHasAudio);
      });
    }

    const sync = (state) => {
      hero.dataset.cinematicState = state;
      chrome.skip && (chrome.skip.hidden = state !== "playing");
      if (chrome.replay) {
        chrome.replay.hidden = !(state === "complete" || state === "poster");
        chrome.replay.textContent = state === "poster" && !finished ? "Guarda" : "Rivedi";
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
    // Se il fuoco viene interrotto mentre suona ancora (rete di sicurezza,
    // "Salta", scorrimento veloce su desktop), tagliare l'audio di netto fa
    // un tonfo. Sfuma in 260ms e poi mette in pausa. Se il video e' gia'
    // finito da solo non c'e' niente da sfumare e si esce subito.
    const sfumaEPausa = (video) => new Promise((resolve) => {
      if (!video || video.paused || video.muted || video.ended || !video.volume) {
        video?.pause();
        resolve();
        return;
      }
      const partenza = video.volume;
      const passi = 8;
      let i = 0;
      const giu = window.setInterval(() => {
        i += 1;
        try { video.volume = Math.max(0, partenza * (1 - i / passi)); } catch (e) { /* ignora */ }
        if (i >= passi) {
          window.clearInterval(giu);
          video.pause();
          try { video.volume = partenza; } catch (e) { /* ignora */ }
          resolve();
        }
      }, 260 / passi);
    });

    const transitionToPasta = async () => {
      if (transitioned || finished) return;
      transitioned = true;
      setSources(pastaVideo, pastaSources, pastaHasAudio);
      await sfumaEPausa(fireVideo);
      hero.classList.add("is-transitioned", "pasta-ready");
      setStage("t");
      try { pastaVideo.currentTime = 0; } catch (error) { pastaVideo.dataset.mediaError = "seek"; }
      if (!paused) {
        const didPlay = await safePlay(pastaVideo, { preferSound: true });
        if (!didPlay) sync("poster");
      }
      syncAudioControls();
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
      setSources(fireVideo, fireSources, fireHasAudio);
      hero.classList.remove("is-transitioned");
      transitioned = false;
      setStage("1");
      try { fireVideo.currentTime = 0; } catch (error) { fireVideo.dataset.mediaError = "seek"; }
      const didPlay = await safePlay(fireVideo, { preferSound: true });
      if (!didPlay) sync("poster");
      if (mobile.matches) {
        // ⚠️ Qui c'era un taglio secco a 1800ms: il fuoco durava 1,8s su 10
        // e la musica veniva troncata a meta'. Ora lo stacco lo decide
        // STACCO_MOBILE sul timeupdate (vedi piu' sotto).
        // Questo timer resta solo come ULTIMA rete di sicurezza, per il caso
        // in cui il video non parta proprio e quindi timeupdate non arrivi
        // mai: senza, il telefono resterebbe piantato sul pentolino.
        // Volutamente piu' lungo dello stacco, cosi' non lo anticipa.
        window.clearTimeout(mobileTimer);
        const durata = Number(fireVideo.duration) || Number(asset.duration) || 10;
        mobileTimer = window.setTimeout(transitionToPasta, durata * 1000 + 2000);
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

    // ---- PUNTO DI STACCO SU TELEFONO ----------------------------------
    // Su desktop il passaggio lo guida lo scorrimento; su telefono no, e
    // serve decidere quando lasciare il fuoco. 1,8s mutilava il filmato,
    // 10s (la fine naturale) tira troppo: l'utente li ha provati entrambi.
    //
    // Scelto misurando quanto cambia l'immagine secondo per secondo:
    //   1,4>2,4s  162.800   la fiammata
    //   3,4>4,4s  120.000   il picco di luce
    //   4,4>5,4s   82.500
    //   5,4>6,4s   47.800
    //   6,4>7,4s   29.300   da qui restano vapore e sfarfallio
    //
    // 22/7 - PORTATO DA 6,4 A 5,0. L'utente ha riferito che 6,4 era
    // diventato troppo lungo (dopo che 1,8 era troppo corto).
    // ⚠️ IL MOTIVO VERO, che a luglio non avevamo considerato: lo stacco
    // NON e' istantaneo. .cinema-video--fire/--pasta hanno
    // "transition: opacity 1000ms" (styles.css:2482-2493) + il lampo
    // .cinema-bridge da 1500ms. Quindi il fuoco resta in scena fino a
    // STACCO_MOBILE + ~1s: con 6,4 il pentolino si vedeva fino a ~7,4s.
    // Alla durata scelta va SEMPRE sommato 1s di dissolvenza.
    // 5,0 tiene tutto cio' che racconta qualcosa - la fiammata (1,4-2,4)
    // e il picco di luce completo (3,4-4,4) - piu' 0,6s di respiro, e
    // taglia solo la coda che si stava gia' spegnendo. Il fuoco sparisce
    // del tutto verso i 6,0s invece che 7,4s.
    // Se va ancora ritoccato: muovere di +/-0,5s. NON scendere sotto 4,4
    // o si taglia il picco di luce a meta' (era il difetto di 1,8s).
    //
    // Legato a currentTime e NON a un setTimeout: su una linea lenta
    // l'orologio corre anche mentre il video e' fermo a caricare, e si
    // finirebbe per mostrarne ancora meno proprio a chi ha la rete
    // peggiore. Cosi' tutti vedono la stessa porzione di film.
    const STACCO_MOBILE = 5.0;
    fireVideo.addEventListener("timeupdate", () => {
      if (!mobile.matches || transitioned || finished || paused) return;
      if (fireVideo.currentTime >= STACCO_MOBILE) transitionToPasta();
    });
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
    version: "20260715-cinematic-audio-v2",
    controlsHome: true,
    mountFilm,
    mountAll,
    mountHome
  });
})();
