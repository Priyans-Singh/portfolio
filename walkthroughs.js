'use strict';

(() => {
  const motionReduced = () => document.documentElement.dataset.motion === 'paused';
  const desktopMode = matchMedia('(min-width: 761px)');
  const duration = 13000;
  const phaseStarts = { before: 0, bridge: 4500, after: 7000 };
  const copy = {
    copilot: {
      title: 'Customer Copilot Rep',
      before: 'Before · Call and manual lookup',
      bridge: 'Integration · Live call context',
      after: 'After · Contextual guidance'
    },
    notes: {
      title: 'AI Notes Summarizer',
      before: 'Before · Reading through notes',
      bridge: 'Integration · Streamed response',
      after: 'After · Structured summary'
    },
    bi: {
      title: 'Agentic BI platform',
      before: 'Before · Spreadsheet work',
      bridge: 'Integration · Ask your data',
      after: 'After · In-platform dashboard'
    }
  };
  const icons = {
    play: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4.5 15 10l-9 5.5Z" fill="currentColor"/></svg>',
    thumbnail: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4" width="14" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m4 14 4-4 3 3 2-2 3 3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="13" cy="8" r="1.2" fill="currentColor"/></svg>'
  };

  class Walkthrough {
    constructor(root) {
      this.root = root;
      this.card = root.closest('.project');
      this.button = root.querySelector('.demo-play-button');
      this.pauseButton = root.querySelector('.demo-pause-button');
      this.icon = root.querySelector('.demo-control-icon');
      this.label = root.querySelector('.demo-control-label');
      this.status = root.querySelector('.demo-status');
      this.badge = root.querySelector('.demo-phase-badge');
      this.playback = root.querySelector('.demo-playback');
      this.text = copy[root.dataset.demo];
      this.elapsed = 0;
      this.state = 'idle';
      this.phase = 'before';
      this.lastTime = null;
      this.frame = null;
      this.hoverTimer = null;
      this.hovered = this.card.matches(':hover');
      this.loops = 0;
      this.root.dataset.loop = "0";
      this.inView = false;
      this.resumeWhenVisible = false;
      this.typed = [...root.querySelectorAll('[data-typewriter]')].map(node => ({
        node,
        fullText: node.textContent,
        phase: node.closest('[data-scene]').dataset.scene,
        start: Number(node.dataset.start || 0),
        speed: Number(node.dataset.speed || 30)
      }));
      // Each transcript starts only after the preceding utterance is complete.
      root.querySelectorAll('.copilot-transcript-pane').forEach(pane => {
        let startsAt = 0;
        pane.querySelectorAll('[data-typewriter]').forEach(node => {
          const entry = this.typed.find(item => item.node === node);
          entry.start = startsAt;
          entry.bubble = node.closest('.copilot-utterance');
          startsAt += entry.fullText.length / entry.speed * 1000 + 180;
        });
      });
      // Summary sections arrive in reading order; later sections occupy no space yet.
      if (root.dataset.demo === 'notes') {
        let startsAt = 160;
        root.querySelectorAll('[data-summary-entry]').forEach(section => {
          const node = section.querySelector('[data-typewriter]');
          const entry = this.typed.find(item => item.node === node);
          entry.start = startsAt;
          entry.bubble = section;
          startsAt += entry.fullText.length / entry.speed * 1000 + 160;
        });
        this.summaryCompleteAt = phaseStarts.after + startsAt - 160;
      }
      this.answerCards = [...root.querySelectorAll('[data-appear]')];
      this.newestAnswer = root.querySelector('.demo-policy[data-appear]');
      this.olderAnswer = root.querySelector('.demo-next-action[data-appear]');
      this.summaryLabels = root.dataset.demo === 'notes' ? [
        [root.querySelector('.demo-summary-state'), 'Summary ready', 'Generating summary…'],
        [root.querySelector('.demo-stream-label'), 'Complete', 'Generating'],
        [root.querySelector('.demo-notes-after .demo-window-badge'), 'Summary ready', 'Generating summary'],
        [root.querySelector('.demo-button-done'), '✓ Summarized', 'Summarizing…']
      ] : [];
      this.tick = this.tick.bind(this);
      this.card.tabIndex = 0;
      this.card.setAttribute('aria-label', `${this.text.title} project. Hover or focus to preview the walkthrough.`);
      this.pauseButton.addEventListener('click', () => {
        if (this.state === 'playing') this.pause();
        else this.play();
      });
      this.button.addEventListener('click', () => {
        this.resumeWhenVisible = false;
        if (this.state !== 'idle') {
          this.reset();
          if (!desktopMode.matches) this.root.querySelector('.demo-stage').scrollIntoView({ behavior: motionReduced() ? 'auto' : 'smooth', block: 'center' });
        }
        else this.play();
      });
      this.root.querySelector('.demo-stage').addEventListener('click', event => {
        if ((!desktopMode.matches || motionReduced()) && this.state === 'idle' && !event.target.closest('button')) this.play();
      });
      this.card.addEventListener('pointerenter', () => {
        this.hovered = true;
        if (!desktopMode.matches || motionReduced()) return;
        clearTimeout(this.hoverTimer);
        this.hoverTimer = setTimeout(() => {
          if (this.hovered && this.inView && !document.hidden && this.state === 'idle') this.play();
        }, 180);
      });
      this.card.addEventListener('pointerleave', () => {
        this.hovered = false;
        clearTimeout(this.hoverTimer);
        if (desktopMode.matches && !this.hasKeyboardFocus()) this.reset();
      });
      this.card.addEventListener('focusin', event => {
        if (desktopMode.matches && !motionReduced() && event.target.matches(':focus-visible') && this.inView && this.state === 'idle') this.play();
      });
      this.card.addEventListener('focusout', event => {
        if (desktopMode.matches && !this.hovered && !this.card.contains(event.relatedTarget)) this.reset();
      });
      root.querySelectorAll('.bi-region-controls button').forEach(button => {
        button.addEventListener('click', () => {
          const region = button.dataset.region;
          const regions = {
            north: 'North: $34,000 revenue across 170 orders.',
            south: 'South: $27,000 revenue across 135 orders.',
            west: 'West: $23,000 revenue across 115 orders.'
          };
          root.dataset.selectedRegion = region;
          button.closest('.bi-chat-response').querySelector('.bi-region-insight').textContent = regions[region];
          root.querySelectorAll('.bi-region-controls button').forEach(option => {
            option.setAttribute('aria-pressed', String(option === button));
          });
        });
      });
      const chartResponse = root.querySelector('[data-scene="after"] .bi-chat-response');
      if (chartResponse) {
        chartResponse.addEventListener('focusin', event => {
          if (event.target.matches(':focus-visible') && this.state === 'playing') {
            this.pause();
            this.resumeAfterChartFocus = true;
          }
        });
        chartResponse.addEventListener('focusout', event => {
          if (!chartResponse.contains(event.relatedTarget) && this.resumeAfterChartFocus) {
            this.resumeAfterChartFocus = false;
            if (this.inView && !document.hidden) this.play();
          }
        });
      }
      document.addEventListener('portfolio:motionchange', () => {
        this.reset();
        this.syncControls();
        if (!motionReduced() && desktopMode.matches && this.inView && this.wantsDesktopPreview()) this.play();
      });
      desktopMode.addEventListener('change', () => {
        this.reset();
        this.hovered = this.card.matches(':hover');
        this.syncControls();
        if (desktopMode.matches && !motionReduced() && this.inView && this.wantsDesktopPreview()) this.play();
      });
      this.render();
      this.syncControls();
    }

    play() {
      clearTimeout(this.hoverTimer);
      if (this.state === 'ended' || this.state === 'idle') this.elapsed = 0;
      this.state = 'playing';
      this.resumeWhenVisible = false;
      this.lastTime = null;
      this.root.classList.add('has-started', 'is-playing');
      this.root.classList.remove('is-paused', 'is-ended');
      this.render();
      this.syncControls();
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(this.tick);
    }

    hasKeyboardFocus() {
      return this.card.matches(':focus-visible') || !!this.card.querySelector(':focus-visible');
    }

    wantsDesktopPreview() {
      return this.hovered || this.hasKeyboardFocus();
    }

    reset() {
      clearTimeout(this.hoverTimer);
      cancelAnimationFrame(this.frame);
      this.elapsed = 0;
      this.loops = 0;
      this.root.dataset.loop = '0';
      this.state = 'idle';
      this.lastTime = null;
      this.resumeWhenVisible = false;
      this.resumeAfterChartFocus = false;
      this.root.classList.remove('has-started', 'is-playing', 'is-paused', 'is-ended');
      this.render();
      this.syncControls();
    }

    pause() {
      if (this.state !== 'playing') return;
      this.state = 'paused';
      this.lastTime = null;
      cancelAnimationFrame(this.frame);
      this.root.classList.remove('is-playing');
      this.root.classList.add('is-paused');
      this.syncControls();
    }

    tick(now) {
      if (this.state !== 'playing') return;
      if (this.lastTime !== null) this.elapsed = Math.min(duration, this.elapsed + now - this.lastTime);
      this.lastTime = now;
      this.render();
      if (this.elapsed >= duration) {
        if (motionReduced()) {
          this.state = 'ended';
          this.root.classList.remove('is-playing');
          this.root.classList.add('is-ended');
          this.syncControls();
          return;
        }
        this.elapsed = 0;
        this.root.dataset.loop = String(++this.loops);
        this.render();
      }
      this.frame = requestAnimationFrame(this.tick);
    }

    render() {
      const nextPhase = this.elapsed >= phaseStarts.after ? 'after' : this.elapsed >= phaseStarts.bridge ? 'bridge' : 'before';
      if (nextPhase !== this.phase) {
        this.phase = nextPhase;
        this.root.dataset.phase = nextPhase;
        this.syncControls();
      }
      if (this.badge.textContent !== this.text[this.phase]) this.badge.textContent = this.text[this.phase];
      this.typed.forEach(({ node, fullText, phase, start, speed, bubble }) => {
        const localTime = this.elapsed - phaseStarts[phase] - start;
        if (bubble) {
          const hidden = phase !== this.phase || localTime < 0;
          if (bubble.hidden !== hidden) bubble.hidden = hidden;
        }
        const count = motionReduced() ? fullText.length : Math.max(0, Math.min(fullText.length, Math.floor(localTime * speed / 1000)));
        const nextText = fullText.slice(0, count);
        if (node.textContent !== nextText) node.textContent = nextText;
      });
      this.answerCards.forEach(card => {
        const visible = this.phase === 'after' && this.elapsed - phaseStarts.after >= Number(card.dataset.appear);
        if (card.hidden === visible) card.hidden = !visible;
      });
      if (this.olderAnswer && this.newestAnswer) {
        this.olderAnswer.classList.toggle('is-shifted', !this.newestAnswer.hidden && !this.olderAnswer.hidden);
      }
      if (this.summaryLabels.length) {
        const complete = this.elapsed >= this.summaryCompleteAt;
        this.summaryLabels.forEach(([node, ready, generating]) => {
          const next = complete ? ready : generating;
          if (node.textContent !== next) node.textContent = next;
        });
      }
    }

    syncControls() {
      const desktopPreview = desktopMode.matches && !motionReduced();
      // Expose the interactive BI chart only while its scene is actually visible.
      this.playback.setAttribute('aria-hidden', String(!(this.root.dataset.demo === 'bi' && this.phase === 'after' && this.state !== 'idle')));
      this.root.classList.toggle('is-desktop-loop', desktopPreview);
      this.card.tabIndex = desktopPreview ? 0 : -1;
      this.card.setAttribute('aria-label', `${this.text.title} project. ${desktopPreview ? 'Hover or focus to preview the walkthrough.' : 'Tap the thumbnail or select Play walkthrough to preview.'}`);
      this.root.querySelector('.demo-hover-hint').textContent = this.state === 'idle' ? 'Hover to preview' : this.state === 'paused' ? 'Preview paused' : 'Looping preview';
      this.pauseButton.textContent = this.state === 'paused' ? 'Resume' : 'Pause';
      this.pauseButton.setAttribute('aria-label', `${this.state === 'paused' ? 'Resume' : 'Pause'} ${this.text.title} walkthrough`);
      const label = this.state === 'idle' ? 'Play walkthrough' : 'Show thumbnail';
      const icon = this.state === 'idle' ? 'play' : 'thumbnail';
      this.label.textContent = label;
      this.icon.innerHTML = icons[icon];
      this.button.setAttribute('aria-label', this.state === 'idle' ? `Play ${this.text.title} walkthrough` : `Show ${this.text.title} thumbnail`);
      if (this.state === 'idle') {
        this.status.textContent = motionReduced() ? '13 seconds · Select play' : 'Tap thumbnail to preview';
      } else if (this.state === 'ended') {
        this.status.textContent = 'Complete · Return to thumbnail';
      } else {
        this.status.textContent = `${this.state === 'paused' ? 'Paused · ' : ''}${this.text[this.phase]}`;
      }
    }

    setVisible(visible) {
      this.inView = visible;
      if (!visible) {
        if (desktopMode.matches) this.reset();
        else if (this.state === 'playing') {
          this.pause();
          this.resumeWhenVisible = true;
        }
      } else if (!document.hidden && (this.resumeWhenVisible || (desktopMode.matches && !motionReduced() && this.wantsDesktopPreview() && this.state === 'idle'))) {
        this.play();
      }
    }
  }

  const walkthroughs = [...document.querySelectorAll('.project-demo')].map(root => new Walkthrough(root));
  const byStage = new Map(walkthroughs.map(demo => [demo.root.querySelector('.demo-stage'), demo]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => byStage.get(entry.target).setVisible(entry.isIntersecting && entry.intersectionRatio >= .1));
  }, { threshold: [0, .1] });
  byStage.forEach((demo, stage) => observer.observe(stage));
  document.addEventListener('visibilitychange', () => {
    walkthroughs.forEach(demo => {
      if (document.hidden && demo.state === 'playing') {
        demo.pause();
        demo.resumeWhenVisible = true;
      } else if (!document.hidden && demo.inView && demo.resumeWhenVisible && (!desktopMode.matches || demo.wantsDesktopPreview())) {
        demo.play();
      }
    });
  });
})();
