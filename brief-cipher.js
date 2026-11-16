if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const textBlocks = document.querySelectorAll(
    ".bc-section-head > *, .bc-caption, .bc-support-copy, .bc-palette-label, " +
    ".bc-variant figcaption, .bc-guide-sequence figcaption, " +
    ".bc-gameplay__head > *, .bc-gameplay__steps li, .bc-gameplay__outcomes > *"
  );

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -16px 0px" });

  for (const block of textBlocks) {
    block.classList.add("bc-reveal");
    revealOnScroll.observe(block);
  }
  const cards = document.querySelector(".bc-card-touchpoint img");
  if (cards) revealOnScroll.observe(cards);
}
