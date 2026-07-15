document.addEventListener('DOMContentLoaded', () => {
  const videos = Array.from(document.querySelectorAll('video[data-sync-group]'));
  const groups = new Map();
  const programmatic = new WeakSet();

  videos.forEach((video) => {
    const groupName = video.dataset.syncGroup;
    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName).push(video);
  });

  function playGroup(trigger) {
    const group = groups.get(trigger.dataset.syncGroup) || [];

    group.forEach((video) => {
      if (video !== trigger) {
        video.currentTime = trigger.currentTime || 0;
      }
      programmatic.add(video);
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
      window.setTimeout(() => programmatic.delete(video), 200);
    });
  }

  function pauseGroup(trigger) {
    const group = groups.get(trigger.dataset.syncGroup) || [];
    group.forEach((video) => {
      if (video !== trigger) {
        programmatic.add(video);
        video.pause();
        window.setTimeout(() => programmatic.delete(video), 200);
      }
    });
  }

  videos.forEach((video) => {
    video.addEventListener('play', () => {
      if (!programmatic.has(video)) {
        playGroup(video);
      }
    });

    video.addEventListener('pause', () => {
      if (!programmatic.has(video) && !video.ended) {
        pauseGroup(video);
      }
    });
  });
});
