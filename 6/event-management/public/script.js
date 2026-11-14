const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// Fetch all events
async function loadEvents() {
    const res = await fetch("/events", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    if (!res.ok) {
        logout();
        return;
    }

    const events = await res.json();

    document.getElementById("eventList").innerHTML =
        events.map(e => `
        <div class="event-card">
            <h3>${e.title}</h3>
            <p>Category: ${e.category}</p>
            <p>Date: ${e.date}</p>
            <p>Location: ${e.location}</p>
            <p>${e.description}</p>

            <button onclick="editEvent('${e._id}')">
                Edit
            </button>

            <button onclick="deleteEvent('${e._id}')">
                Delete
            </button>
        </div>
    `).join("");
}

// Add or Update Event
async function saveEvent() {
    const id = document.getElementById("eventId").value;

    const event = {
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        location: document.getElementById("location").value,
        description: document.getElementById("description").value
    };

    if (!event.title || !event.date) {
        alert("Please enter event title and date");
        return;
    }

    const url = id ? `/events/${id}` : "/events";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify(event)
    });

    if (res.ok) {
        alert(id ? "Event Updated!" : "Event Added!");
        clearForm();
        loadEvents();
    } else {
        alert("Operation failed");
    }
}

// Edit Event
async function editEvent(id) {
    const res = await fetch("/events", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const events = await res.json();
    const e = events.find(event => event._id === id);

    if (!e) return;

    document.getElementById("eventId").value = e._id;
    document.getElementById("title").value = e.title;
    document.getElementById("category").value = e.category;
    document.getElementById("date").value = e.date;
    document.getElementById("location").value = e.location;
    document.getElementById("description").value = e.description;
}

// Delete Event
async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?"))
        return;

    const res = await fetch(`/events/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token
        }
    });

    if (res.ok) {
        alert("Event Deleted!");
        loadEvents();
    }
}

// Clear Form
function clearForm() {
    document.getElementById("eventId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    document.getElementById("location").value = "";
    document.getElementById("description").value = "";
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

loadEvents();