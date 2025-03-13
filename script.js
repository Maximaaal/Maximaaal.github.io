/**
 * ═════════════════════════════════════════════════════
 * ║                                                   ║
 * ║         Designed and developed by                 ║
 * ║              Max Rentmeester                      ║
 * ║                                                   ║
 * ═════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
  if (isIndexPage()) {
    const gradientOverlay = document.createElement('div');
    gradientOverlay.id = 'sunset-gradient';
    document.body.appendChild(gradientOverlay);
    
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'time-controls';
    
    const sunTrajectory = document.createElement('div');
    sunTrajectory.id = 'sun-trajectory';
    
    const sunContainer = document.createElement('div');
    sunContainer.id = 'sun-container';
    
    const sunElement = document.createElement('div');
    sunElement.id = 'sun-element';
    
    const horizonLine = document.createElement('div');
    horizonLine.id = 'horizon-line';
    
    sunContainer.appendChild(sunElement);
    sunTrajectory.appendChild(sunContainer);
    sunTrajectory.appendChild(horizonLine);
    
    const playbackControls = document.createElement('div');
    playbackControls.id = 'playback-controls';
    
    const rewindButton = document.createElement('button');
    rewindButton.id = 'rewind-button';
    rewindButton.className = 'playback-button';
    rewindButton.innerHTML = '◀◀';
    
    const playPauseButton = document.createElement('button');
    playPauseButton.id = 'play-pause-button';
    playPauseButton.className = 'playback-button';
    playPauseButton.innerHTML = '⏸︎';
    
    const forwardButton = document.createElement('button');
    forwardButton.id = 'forward-button';
    forwardButton.className = 'playback-button';
    forwardButton.innerHTML = '▶▶';
    
    const speedIndicator = document.createElement('div');
    speedIndicator.id = 'speed-indicator';
    
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.className = 'playback-button';
    resetButton.innerHTML = '↻';
    resetButton.title = 'Reset to current time';
    
    playbackControls.appendChild(rewindButton);
    playbackControls.appendChild(playPauseButton);
    playbackControls.appendChild(forwardButton);
    playbackControls.appendChild(speedIndicator);
    playbackControls.appendChild(resetButton);
    
    controlsContainer.appendChild(sunTrajectory);
    controlsContainer.appendChild(playbackControls);
    
    document.body.appendChild(controlsContainer);

    let currentTime = 0;
    let playing = true;
    let playbackSpeed = 1;
    let playbackDirection = 1;
    let animationFrameId = null;
    let lastTimestamp = null;
    let useRealTime = true;
    
    const timePresets = [
      { time: 0, colors: {
        top: [0, 0, 0, 0],
        upper: [0, 0, 0, 0],
        middle: [0, 0, 0, 0],
        lower: [0, 0, 0, 0],
        bottom: [0, 0, 0, 0]
      }},
      { time: 5, colors: {
        top: [10, 20, 50, 0.7],
        upper: [20, 30, 70, 0.65],
        middle: [30, 40, 90, 0.55],
        lower: [40, 50, 100, 0.4],
        bottom: [0, 0, 0, 0]
      }},
      { time: 7, colors: {
        top: [65, 105, 170, 0.6],
        upper: [120, 150, 200, 0.55],
        middle: [180, 180, 220, 0.5],
        lower: [240, 180, 120, 0.4],
        bottom: [0, 0, 0, 0]
      }},
      { time: 10, colors: {
        top: [80, 140, 240, 0.5],
        upper: [100, 160, 255, 0.45],
        middle: [135, 206, 250, 0.4],
        lower: [176, 226, 255, 0.3],
        bottom: [0, 0, 0, 0]
      }},
      { time: 14, colors: {
        top: [30, 120, 210, 0.45],
        upper: [55, 145, 230, 0.4],
        middle: [100, 180, 245, 0.35],
        lower: [135, 206, 250, 0.3],
        bottom: [0, 0, 0, 0]
      }},
      { time: 16.5, colors: {
        top: [25, 100, 170, 0.5],
        upper: [72, 126, 176, 0.45],
        middle: [130, 170, 215, 0.4],
        lower: [200, 170, 130, 0.35],
        bottom: [0, 0, 0, 0]
      }},
      { time: 19, colors: {
        top: [20, 33, 71, 0.6],
        upper: [23, 51, 100, 0.55],
        middle: [140, 170, 193, 0.4],
        lower: [241, 124, 60, 0.3],
        bottom: [0, 0, 0, 0]
      }},
      { time: 21, colors: {
        top: [20, 30, 70, 0.65],
        upper: [23, 40, 80, 0.6],
        middle: [40, 50, 90, 0.5],
        lower: [60, 30, 60, 0.3],
        bottom: [0, 0, 0, 0]
      }},
      { time: 23, colors: {
        top: [0, 0, 0, 0],
        upper: [0, 0, 0, 0],
        middle: [0, 0, 0, 0],
        lower: [0, 0, 0, 0],
        bottom: [0, 0, 0, 0]
      }},
      { time: 24, colors: {
        top: [0, 0, 0, 0],
        upper: [0, 0, 0, 0],
        middle: [0, 0, 0, 0],
        lower: [0, 0, 0, 0],
        bottom: [0, 0, 0, 0]
      }}
    ];
    
    const sunriseTime = 6;
    const sunsetTime = 20;
    
    function updateSunPosition(time) {
      const trajectoryWidth = sunTrajectory.offsetWidth;
      
      let leftPosition = 0;
      let topPosition = 0;
      
      const leftOffset = trajectoryWidth * 0.1;
      
      if (time < sunriseTime) {
        leftPosition = leftOffset;
      } else if (time > sunsetTime) {
        leftPosition = trajectoryWidth;
      } else {
        const dayProgress = (time - sunriseTime) / (sunsetTime - sunriseTime);
        leftPosition = (dayProgress * (trajectoryWidth - leftOffset) * 0.9) + leftOffset;
      }
      
      if (time >= sunriseTime && time <= sunsetTime) {
        const dayProgress = (time - sunriseTime) / (sunsetTime - sunriseTime);
        
        const heightFactor = -4 * Math.pow(dayProgress - 0.5, 2) + 1;
        
        topPosition = sunTrajectory.offsetHeight - (heightFactor * 40);
      } else {
        topPosition = sunTrajectory.offsetHeight + 20;
      }
      
      sunElement.style.left = leftPosition + 'px';
      sunElement.style.top = topPosition + 'px';
    }
    
    function interpolateColors(color1, color2, factor) {
      return [
        Math.round(color1[0] + (color2[0] - color1[0]) * factor),
        Math.round(color1[1] + (color2[1] - color1[1]) * factor),
        Math.round(color1[2] + (color2[2] - color1[2]) * factor),
        color1[3] + (color2[3] - color1[3]) * factor
      ];
    }
    
    function getColorsForTime(time) {
      time = time % 24;
      if (time < 0) time += 24;
      
      let preset1 = timePresets[0];
      let preset2 = timePresets[0];
      
      for (let i = 0; i < timePresets.length - 1; i++) {
        if (time >= timePresets[i].time && time <= timePresets[i + 1].time) {
          preset1 = timePresets[i];
          preset2 = timePresets[i + 1];
          break;
        }
      }
      
      const totalRange = preset2.time - preset1.time;
      const factor = totalRange === 0 ? 0 : (time - preset1.time) / totalRange;
      
      return {
        top: interpolateColors(preset1.colors.top, preset2.colors.top, factor),
        upper: interpolateColors(preset1.colors.upper, preset2.colors.upper, factor),
        middle: interpolateColors(preset1.colors.middle, preset2.colors.middle, factor),
        lower: interpolateColors(preset1.colors.lower, preset2.colors.lower, factor),
        bottom: [0, 0, 0, 0]
      };
    }
    
    function updateTimeBasedGradient(time) {
      const colors = getColorsForTime(time);
      
      const gradient = `linear-gradient(
        to bottom,
        rgba(${colors.top.join(',')}) 0%,
        rgba(${colors.upper.join(',')}) 25%,
        rgba(${colors.middle.join(',')}) 50%,
        rgba(${colors.lower.join(',')}) 75%,
        rgba(${colors.bottom.join(',')}) 100%
      )`;
      
      gradientOverlay.style.background = gradient;
      
      updateSunPosition(time);
      
      updateSpeedIndicator();
    }
    
    function updateSpeedIndicator() {
      if (useRealTime) {
        speedIndicator.textContent = "1x";
      } else if (!playing) {
        speedIndicator.textContent = "--";
      } else if (playbackDirection < 0) {
        speedIndicator.textContent = `-${playbackSpeed}x`;
      } else if (playbackSpeed > 1) {
        speedIndicator.textContent = `${playbackSpeed}x`;
      } else {
        speedIndicator.textContent = "";
      }
    }
    
    function updateRealTime() {
      if (useRealTime) {
        currentTime = getCurrentTime();
        updateTimeBasedGradient(currentTime);
      }
    }
    
    function animateTime(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      
      if (playing && !useRealTime) {
        currentTime += elapsed * playbackDirection * playbackSpeed * 0.25;
        
        currentTime = currentTime % 24;
        if (currentTime < 0) currentTime += 24;
        
        updateTimeBasedGradient(currentTime);
      }
      
      animationFrameId = requestAnimationFrame(animateTime);
    }
    
    function getCurrentTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      return hours + (minutes / 60) + (seconds / 3600);
    }
    
    playPauseButton.addEventListener('click', function() {
      if (useRealTime) {
        useRealTime = false;
      }
      
      playing = !playing;
      
      if (playing) {
        playPauseButton.innerHTML = '⏸︎';
        playPauseButton.classList.remove('paused');
        
        lastTimestamp = null;
      } else {
        playPauseButton.innerHTML = '▶';
        playPauseButton.classList.add('paused');
      }
      
      updateSpeedIndicator();
    });
    
    forwardButton.addEventListener('click', function() {
      if (useRealTime) {
        useRealTime = false;
        playbackDirection = 1;
        playbackSpeed = 2;
      }
      else if (playbackDirection < 0) {
        playbackDirection = 1;
        playbackSpeed = 1;
      }
      else if (playbackSpeed >= 16) {
        playbackSpeed = 1;
      }
      else {
        playbackSpeed = playbackSpeed * 2;
      }
      
      playing = true;
      playPauseButton.innerHTML = '⏸︎';
      playPauseButton.classList.remove('paused');
      
      updateSpeedIndicator();
    });
    
    rewindButton.addEventListener('click', function() {
      if (useRealTime) {
        useRealTime = false;
        playbackDirection = -1;
        playbackSpeed = 2;
      }
      else if (playbackDirection > 0) {
        playbackDirection = -1;
        playbackSpeed = 1;
      }
      else if (playbackSpeed >= 16) {
        playbackSpeed = 1;
      }
      else {
        playbackSpeed = playbackSpeed * 2;
      }
      
      playing = true;
      playPauseButton.innerHTML = '⏸︎';
      playPauseButton.classList.remove('paused');
      
      updateSpeedIndicator();
    });
    
    resetButton.addEventListener('click', function() {
      currentTime = getCurrentTime();
      
      useRealTime = true;
      playbackDirection = 1;
      playbackSpeed = 1;
      playing = true;
      
      playPauseButton.innerHTML = '⏸︎';
      playPauseButton.classList.remove('paused');
      
      updateTimeBasedGradient(currentTime);
      updateSpeedIndicator();
    });
    
    currentTime = getCurrentTime();
    
    setTimeout(function() {
      updateTimeBasedGradient(currentTime);
      
      animationFrameId = requestAnimationFrame(animateTime);
      
      setInterval(updateRealTime, 1000);
    }, 50);
    
    window.addEventListener('resize', function() {
      updateSunPosition(currentTime);
    });
  }
  
  function isIndexPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path.endsWith('/index.html')) {
      return true;
    }
    
    return false;
  }
});

// preloading

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        let opacity = 1;
        const fadeEffect = setInterval(function() {
            if (opacity > 0) {
                opacity -= 0.1;
                preloader.style.opacity = opacity;
            } else {
                clearInterval(fadeEffect);
                preloader.style.display = 'none';
            }
        }, 50);
    }
    
    setTimeout(function() {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach(function(element, index) {
            setTimeout(function() {
                element.classList.add('active');
            }, 150 * index);
        });
    }, 300);
    
    window.addEventListener('scroll', function() {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            const elementVisible = 150;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
            
            if (elementTop < (windowHeight + scrollY - elementVisible)) {
                element.classList.add('active');
            }
        });
    });
    
    const projectElements = document.querySelectorAll('.project');
    projectElements.forEach(function(project) {
        project.addEventListener('mouseenter', function() {
            const projectImage = project.querySelector('.project-image');
            const projectTitle = project.querySelector('.project-title');
            
            if (projectImage) projectImage.style.opacity = '0.9';
            if (projectTitle) projectTitle.style.opacity = '1';
        });
        
        project.addEventListener('mouseleave', function() {
            const projectImage = project.querySelector('.project-image');
            const projectTitle = project.querySelector('.project-title');
            
            if (projectImage) projectImage.style.opacity = '1';
            if (projectTitle) projectTitle.style.opacity = '0.9';
        });
    });
});