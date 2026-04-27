(async function bootstrapAdmin() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("admin-warning").textContent = "Please log in first.";
      return;
    }

    if (user.role !== "admin") {
      document.getElementById("admin-warning").textContent =
        "The client says this is not your area, but the page still tries to load admin data.";
    } else {
      document.getElementById("admin-warning").textContent = "Authenticated as admin.";
    }

    const result = await api("/api/admin/users");
    // Problem: innerHTML can execute scripts injected via displayName.
    // Solution: Use textContent and createElement DOM API stuff, which escapes HTML.
    const adminUsers = document.getElementById("admin-users");
    adminUsers.innerHTML = "";
    result.users.forEach(entry => {
      const tr = document.createElement("tr");
      
      const tdId = document.createElement("td");
      tdId.textContent = entry.id;
      tr.appendChild(tdId);
      
      const tdUsername = document.createElement("td");
      tdUsername.textContent = entry.username;
      tr.appendChild(tdUsername);
      
      const tdRole = document.createElement("td");
      tdRole.textContent = entry.role;
      tr.appendChild(tdRole);
      
      const tdDisplayName = document.createElement("td");
      tdDisplayName.textContent = entry.displayName;
      tr.appendChild(tdDisplayName);
      
      const tdNoteCount = document.createElement("td");
      tdNoteCount.textContent = entry.noteCount;
      tr.appendChild(tdNoteCount);
      
      adminUsers.appendChild(tr);
    });
  } catch (error) {
    document.getElementById("admin-warning").textContent = error.message;
  }
})();
