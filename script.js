(function () {
  "use strict";

  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = stored || (prefersDark ? "dark" : "light");

  const toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else node.setAttribute(k, v);
      }
    }
    if (children) {
      for (const c of children) if (c) node.appendChild(c);
    }
    return node;
  }

  function renderLinks(links) {
    return links.map((l) => {
      const a = el("a", { href: l.url, text: l.label });
      if (!l.url.startsWith("mailto:") && !l.url.startsWith("#")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      return a;
    });
  }

  function renderItem(item) {
    const head = el("div", { class: "item-head" }, [el("h3", { text: item.name })]);
    const card = el("div", { class: "item" }, [head]);

    if (item.description) card.appendChild(el("p", { class: "desc", text: item.description }));

    if (item.tags && item.tags.length) {
      const tags = el("div", { class: "tags" });
      for (const t of item.tags) tags.appendChild(el("span", { class: "tag", text: t }));
      card.appendChild(tags);
    }

    if (item.links && item.links.length) {
      const linksWrap = el("div", { class: "item-links" });
      for (const link of renderLinks(item.links)) linksWrap.appendChild(link);
      card.appendChild(linksWrap);
    }

    return card;
  }

  function renderSection(section) {
    const head = el("div", { class: "platform-head" }, [
      el("h2", { id: "section-" + section.id, text: section.title }),
      section.subtitle ? el("p", { class: "subtitle", text: section.subtitle }) : null,
    ]);
    const items = el("div", { class: "items" });
    for (const it of section.items) items.appendChild(renderItem(it));
    return el("section", { class: "platform" }, [head, items]);
  }

  function renderProfile(p) {
    document.title = `${p.handle} — portfolio`;
    document.getElementById("name").textContent = p.name + (p.handle ? ` · @${p.handle}` : "");
    document.getElementById("tagline").textContent = p.tagline || "";
    const linksWrap = document.getElementById("profile-links");
    for (const link of renderLinks(p.links || [])) linksWrap.appendChild(link);
  }

  function renderNav(sections) {
    const nav = document.getElementById("nav");
    for (const s of sections) {
      const a = el("a", { href: "#section-" + s.id, text: s.title });
      nav.appendChild(a);
    }
  }

  function renderError(msg) {
    const main = document.querySelector("main");
    const div = el("div", { class: "more" }, [el("p", { text: msg })]);
    main.appendChild(div);
  }

  fetch("data.json", { cache: "no-cache" })
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then((data) => {
      renderProfile(data.profile);
      renderNav(data.sections);
      const container = document.getElementById("sections");
      for (const s of data.sections) container.appendChild(renderSection(s));
    })
    .catch((err) => {
      console.error(err);
      renderError("Impossible de charger data.json — " + err.message);
    });
})();
