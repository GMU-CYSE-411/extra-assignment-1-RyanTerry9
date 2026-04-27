// Problem: Template literals with ${} can inject untrusted data as HTML, leading to XSS issues.
// Solution: Replaced those with DOM API stuff, with textContent to escape HTML special characters.
function noteCard(note) {
  const article = document.createElement("article");
  article.className = "note-card";
  
  const h3 = document.createElement("h3");
  h3.textContent = note.title;
  article.appendChild(h3);
  
  const meta = document.createElement("p");
  meta.className = "note-meta";
  meta.textContent = `Owner: ${note.ownerUsername} | ID: ${note.id} | Pinned: ${note.pinned}`;
  article.appendChild(meta);
  
  const body = document.createElement("div");
  body.className = "note-body";
  body.textContent = note.body;
  article.appendChild(body);
  
  return article;
}

async function loadNotes(ownerId, search) {
  const query = new URLSearchParams();

  if (ownerId) {
    query.set("ownerId", ownerId);
  }

  if (search) {
    query.set("search", search);
  }

  const result = await api(`/api/notes?${query.toString()}`);
  const notesList = document.getElementById("notes-list");
  // Problem: innerHTML can execute injected scripts from untrusted data. 
  // Solution: Use appendChild with DOM elements created via textContent.
  notesList.innerHTML = "";
  result.notes.forEach(note => notesList.appendChild(noteCard(note)));
}

(async function bootstrapNotes() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("notes-list").textContent = "Please log in first.";
      return;
    }

    document.getElementById("notes-owner-id").value = user.id;
    document.getElementById("create-owner-id").value = user.id;
    await loadNotes(user.id, "");
  } catch (error) {
    document.getElementById("notes-list").textContent = error.message;
  }
})();

document.getElementById("search-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  await loadNotes(formData.get("ownerId"), formData.get("search"));
});

document.getElementById("create-note-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const payload = {
    ownerId: formData.get("ownerId"),
    title: formData.get("title"),
    body: formData.get("body"),
    pinned: formData.get("pinned") === "on"
  };

  await api("/api/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  await loadNotes(payload.ownerId, "");
  event.currentTarget.reset();
  document.getElementById("create-owner-id").value = payload.ownerId;
});
