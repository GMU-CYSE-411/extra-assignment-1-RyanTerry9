// Problem: Code accepted session ID from URL query parameter, attacker could hijack via malicious links.
// Solution: Removed that, which is hopefully fine to do. Only server-generated session IDs via cookies are accepted.

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());

  try {
    const result = await api("/api/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    writeJson("login-output", result);
  } catch (error) {
    writeJson("login-output", { error: error.message });
  }
});
