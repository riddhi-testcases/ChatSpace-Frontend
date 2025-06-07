/**
 * ChatSpace - Responsive Chat Application
 *
 * Author: Riddhi Chakraborty
 * Created: June 2025
 *
 * This is my chat application built with vanilla JavaScript.
 * I've tried to keep the code clean and well-organized.
 *
 * Features implemented:
 * - Responsive design with collapsible sidebars
 * - Dark/light theme toggle
 * - Typing indicators with smooth animations
 * - Message status indicators (sent/delivered)
 * - Auto-expanding textarea
 * - Smooth message transitions
 * - Bot responses with realistic delays
 * - Separate chat histories for each contact
 * 
 * Also, I have used the exact names of contacts as given in the referrence image
 */

// === GLOBAL VARIABLES ===
// I prefer to keep these at the top for easy reference
let currentTheme = "light"
let sidebarVisible = window.innerWidth > 768
let sidebarCollapsed = false 
let infoPanelVisible = window.innerWidth > 1024
let botIsTyping = false
let messageIdCounter = 1000 
let currentActiveContact = "emma_thompson" 

// === DOM ELEMENT REFERENCES ===
// Getting all the elements I'll need throughout the app
const elements = {
  sidebarToggle: document.getElementById("toggleSidebar"),
  themeSwitch: document.getElementById("themeSwitch"),
  infoPanelToggle: document.getElementById("toggleInfoPanel"),

  chatSidebar: document.getElementById("chatSidebar"),
  infoPanel: document.getElementById("infoPanel"),
  contactsList: document.getElementById("contactsList"),

  messagesArea: document.getElementById("messagesArea"),
  messageTextarea: document.getElementById("messageTextarea"),
  sendButton: document.getElementById("sendMessageBtn"),
  typingIndicator: document.getElementById("typingBubble"),

  chatAvatar: document.getElementById("chatAvatar"),
  chatUserName: document.getElementById("chatUserName"),
  chatStatus: document.getElementById("chatStatus"),

  infoAvatar: document.getElementById("infoAvatar"),
  infoUserName: document.getElementById("infoUserName"),
  infoUserRole: document.getElementById("infoUserRole"),
  contactDetails: document.getElementById("contactDetails"),
  sharedFiles: document.getElementById("sharedFiles"),
}

// === CHAT DATA ===
// I'm using this structure to simulate a real chat app
const chatContacts = [
  {
    id: "emma_thompson",
    name: "Emma Thompson",
    initials: "EM",
    avatarColor: "#3b82f6",
    lastMessage: "I've sent you the latest project files...",
    timestamp: "12:45 PM",
    isOnline: true,
    isActive: true,
    role: "Product Designer",
    email: "emma.thompson@gmail.com",
    phone: "+91 7513703628",
    files: [
      { name: "Client Presentation.pdf", size: "2.4 MB", type: "pdf" },
      { name: "Project Mockup.png", size: "1.8 MB", type: "img" }
    ]
  },
  {
    id: "michael_johnson",
    name: "Michael Johnson",
    initials: "MJ",
    avatarColor: "#22c55e",
    lastMessage: "Are we still meeting for coffee tomorrow?",
    timestamp: "Yesterday",
    isOnline: true,
    isActive: false,
    role: "Software Engineer",
    email: "michael.johnson@gmail.com",
    phone: "+91 8265026591",
    files: [
      { name: "Code Review.pdf", size: "1.2 MB", type: "pdf" },
      { name: "API Documentation.docx", size: "856 KB", type: "doc" }
    ]
  },
  {
    id: "sophia_lee",
    name: "Sophia Lee",
    initials: "SL",
    avatarColor: "#a855f7",
    lastMessage: "The design team loved your presentation!",
    timestamp: "Yesterday",
    isOnline: true,
    isActive: false,
    role: "UX Designer",
    email: "sophia.lee@gmail.com",
    phone: "+91 3816409518",
    files: [
      { name: "Wireframes.fig", size: "3.1 MB", type: "img" },
      { name: "User Research.pdf", size: "2.8 MB", type: "pdf" }
    ]
  },
  {
    id: "robert_brown",
    name: "Robert Brown",
    initials: "RB",
    avatarColor: "#f59e0b",
    lastMessage: "Can you review the budget proposal?",
    timestamp: "Tuesday",
    isOnline: false,
    isActive: false,
    role: "Project Manager",
    email: "robert.brown@gmail.com",
    phone: "+91 3825104629",
    files: [
      { name: "Budget Proposal.xlsx", size: "945 KB", type: "doc" },
      { name: "Timeline.pdf", size: "1.5 MB", type: "pdf" }
    ]
  },
  {
    id: "amelia_wilson",
    name: "Amelia Wilson",
    initials: "AW",
    avatarColor: "#ef4444",
    lastMessage: "Thanks for your help with the client meeting.",
    timestamp: "Monday",
    isOnline: false,
    isActive: false,
    role: "Account Manager",
    email: "amelia.wilson@gmail.com",
    phone: "+91 2740671621",
    files: [
      { name: "Client Notes.pdf", size: "1.1 MB", type: "pdf" },
      { name: "Meeting Recording.mp4", size: "45.2 MB", type: "video" }
    ]
  },
  {
    id: "daniel_martinez",
    name: "Daniel Martinez",
    initials: "DM",
    avatarColor: "#6366f1",
    lastMessage: "Let's schedule a call to discuss the new project.",
    timestamp: "May 25",
    isOnline: false,
    isActive: false,
    role: "Business Analyst",
    email: "daniel.martinez@gmail.com",
    phone: "+91 3849501680",
    files: [
      { name: "Requirements.docx", size: "2.2 MB", type: "doc" },
      { name: "Flowchart.png", size: "1.7 MB", type: "img" }
    ]
  },
]
const conversationHistories = {
  emma_thompson: [
    {
      id: 1,
      content: "Sounds great! I've heard good things about their pasta. Looking forward to it!",
      sender: "emma_thompson",
      timestamp: "12:00 PM",
      status: "read",
    },
    {
      id: 2,
      content: "Oh, I almost forgot - do you have the latest version of the client presentation? I want to make sure we're all on the same page for tomorrow.",
      sender: "emma_thompson",
      timestamp: "12:05 PM",
      status: "read",
    },
    {
      id: 3,
      content: "I've just sent it to your email. It includes all the updates we discussed in the last meeting. Let me know if you need anything else!",
      sender: "user",
      timestamp: "12:15 PM",
      status: "delivered",
    },
    {
      id: 4,
      content: "Got it, thanks! I'll review it before our lunch. See you soon!",
      sender: "emma_thompson",
      timestamp: "12:20 PM",
      status: "read",
    },
    {
      id: 5,
      content: "Looking forward to it! 👍",
      sender: "user",
      timestamp: "12:25 PM",
      status: "sent",
    },
  ],
  michael_johnson: [
    {
      id: 101,
      content: "Hey! How's the new project coming along?",
      sender: "michael_johnson",
      timestamp: "Yesterday",
      status: "read",
    },
    {
      id: 102,
      content: "It's going well! Just finished the initial setup. Are we still meeting for coffee tomorrow?",
      sender: "user",
      timestamp: "Yesterday",
      status: "delivered",
    },
    {
      id: 103,
      content: "Absolutely! Looking forward to catching up and discussing the code review.",
      sender: "michael_johnson",
      timestamp: "Yesterday",
      status: "read",
    },
  ],
  sophia_lee: [
    {
      id: 201,
      content: "The design team loved your presentation! Great work on the user flow diagrams.",
      sender: "sophia_lee",
      timestamp: "Yesterday",
      status: "read",
    },
    {
      id: 202,
      content: "Thank you so much! I'm glad the team found it helpful. The wireframes you shared were really inspiring.",
      sender: "user",
      timestamp: "Yesterday",
      status: "delivered",
    },
  ],
  robert_brown: [
    {
      id: 301,
      content: "Can you review the budget proposal when you get a chance? I need your input on the resource allocation.",
      sender: "robert_brown",
      timestamp: "Tuesday",
      status: "read",
    },
    {
      id: 302,
      content: "Sure thing! I'll take a look at it this afternoon and get back to you with my thoughts.",
      sender: "user",
      timestamp: "Tuesday",
      status: "sent",
    },
  ],
  amelia_wilson: [
    {
      id: 401,
      content: "Thanks for your help with the client meeting. Your insights really made a difference!",
      sender: "amelia_wilson",
      timestamp: "Monday",
      status: "read",
    },
    {
      id: 402,
      content: "Happy to help! The client seemed really engaged. Let me know if you need anything else for the follow-up.",
      sender: "user",
      timestamp: "Monday",
      status: "delivered",
    },
  ],
  daniel_martinez: [
    {
      id: 501,
      content: "Let's schedule a call to discuss the new project requirements. I have some ideas I'd like to run by you.",
      sender: "daniel_martinez",
      timestamp: "May 25",
      status: "read",
    },
    {
      id: 502,
      content: "Sounds good! I'm free tomorrow afternoon. What time works best for you?",
      sender: "user",
      timestamp: "May 25",
      status: "sent",
    },
  ],
}

// Bot responses - I tried to make these sound natural
const botResponseTemplates = {
  emma_thompson: [
    "That sounds perfect! I'll make sure to prepare everything we need.",
    "Thanks for the update. I really appreciate you keeping me in the loop.",
    "I'll review this and get back to you with my thoughts shortly.",
    "The design looks great! I love the attention to detail.",
    "Let me check with the design team and I'll circle back with you.",
  ],
  michael_johnson: [
    "Great! I'll start working on that right away.",
    "That's a really interesting approach! I hadn't considered that angle before.",
    "Could you clarify what you mean by that? I want to make sure I understand correctly.",
    "The code review looks good. Just a few minor suggestions.",
    "I'll push the changes to the repository shortly.",
  ],
  sophia_lee: [
    "I love the creative direction you're taking with this!",
    "The user experience flow is really intuitive.",
    "That's exactly what we needed to move forward with the design.",
    "I'll incorporate your feedback into the next iteration.",
    "The wireframes are looking fantastic!",
  ],
  robert_brown: [
    "I'll review the budget and timeline today.",
    "That timeline works perfectly for me.",
    "Let me coordinate with the team and get back to you.",
    "The project scope looks comprehensive.",
    "I'll make sure all stakeholders are aligned on this.",
  ],
  amelia_wilson: [
    "The client meeting went really well!",
    "I'll follow up with them on the next steps.",
    "Thanks for coordinating everything so smoothly.",
    "The client feedback has been very positive.",
    "I'll schedule the follow-up meeting for next week.",
  ],
  daniel_martinez: [
    "The requirements document is very thorough.",
    "I'll analyze the business impact and get back to you.",
    "That's a solid approach to the problem.",
    "Let me run this by the stakeholders.",
    "The project timeline looks realistic.",
  ],
}

// === INITIALIZATION ===
// This runs when the page loads
function initializeApp() {
  console.log("🚀 ChatSpace initializing...")

  setupEventListeners()

  renderContactsList()
  renderConversation()
  updateChatHeader()
  updateInfoPanel()

  loadSavedTheme()

  handleWindowResize()

  console.log("✅ ChatSpace ready!")
}

// === EVENT LISTENERS ===
function setupEventListeners() {
  
  elements.sidebarToggle.addEventListener("click", toggleChatSidebar)

  elements.infoPanelToggle.addEventListener("click", toggleInfoPanel)

  elements.themeSwitch.addEventListener("click", toggleTheme)

  elements.sendButton.addEventListener("click", handleSendMessage)

  elements.messageTextarea.addEventListener("keydown", handleTextareaKeydown)

  elements.messageTextarea.addEventListener("input", handleTextareaInput)

  window.addEventListener("resize", handleWindowResize)

  document.addEventListener("click", handleOutsideClick)

  // I added this to handle when user comes back to the tab
  document.addEventListener("visibilitychange", handleVisibilityChange)
}

function toggleChatSidebar() {
  if (window.innerWidth <= 768) {
    sidebarVisible = !sidebarVisible
    elements.sidebarToggle.classList.toggle("active", sidebarVisible)
    elements.chatSidebar.classList.toggle("sidebar-open", sidebarVisible)
  } else {
    sidebarCollapsed = !sidebarCollapsed
    elements.chatSidebar.classList.toggle("collapsed", sidebarCollapsed)
    elements.sidebarToggle.classList.toggle("active", sidebarCollapsed)
  }

  console.log(
    `Sidebar ${window.innerWidth <= 768 ? (sidebarVisible ? "opened" : "closed") : sidebarCollapsed ? "collapsed" : "expanded"}`,
  )
}

function toggleInfoPanel() {
  infoPanelVisible = !infoPanelVisible

  if (window.innerWidth <= 1024) {
    elements.infoPanel.classList.toggle("panel-open", infoPanelVisible)
  }

  console.log(`Info panel ${infoPanelVisible ? "opened" : "closed"}`)
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light"
  document.body.classList.toggle("dark-theme", currentTheme === "dark")

  localStorage.setItem("chatspace_theme", currentTheme)

  console.log(`Theme switched to ${currentTheme}`)
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("chatspace_theme")
  if (savedTheme && savedTheme === "dark") {
    currentTheme = "dark"
    document.body.classList.add("dark-theme")
  }
}

// === RESPONSIVE HANDLING ===
function handleWindowResize() {
  const width = window.innerWidth

  if (width > 768) {
    elements.chatSidebar.classList.remove("sidebar-open")
    elements.sidebarToggle.classList.remove("active")
    sidebarVisible = false
  } else {
    elements.chatSidebar.classList.remove("collapsed")
    sidebarCollapsed = false
    elements.sidebarToggle.classList.remove("active")
  }

  if (width > 1024) {
    elements.infoPanel.classList.remove("panel-open")
    infoPanelVisible = false
  }
}

function handleOutsideClick(event) {
  if (
    window.innerWidth <= 768 &&
    sidebarVisible &&
    !elements.chatSidebar.contains(event.target) &&
    !elements.sidebarToggle.contains(event.target)
  ) {
    toggleChatSidebar()
  }
  if (
    window.innerWidth <= 1024 &&
    infoPanelVisible &&
    !elements.infoPanel.contains(event.target) &&
    !elements.infoPanelToggle.contains(event.target)
  ) {
    toggleInfoPanel()
  }
}

function renderContactsList() {
  elements.contactsList.innerHTML = ""

  chatContacts.forEach((contact) => {
    const contactElement = createContactElement(contact)
    elements.contactsList.appendChild(contactElement)
  })
}

function createContactElement(contact) {
  const contactDiv = document.createElement("div")
  contactDiv.className = `contact-item ${contact.id === currentActiveContact ? "active" : ""}`
  contactDiv.dataset.contactId = contact.id

  contactDiv.innerHTML = `
        <div class="contact-avatar" style="background-color: ${contact.avatarColor}">
            ${contact.initials}
            ${contact.isOnline ? '<div class="online-dot"></div>' : ""}
        </div>
        <div class="contact-info">
            <div class="contact-header">
                <span class="contact-name">${contact.name}</span>
                <span class="contact-time">${contact.timestamp}</span>
            </div>
            <div class="contact-preview">${contact.lastMessage}</div>
        </div>
    `
  contactDiv.addEventListener("click", () => selectContact(contact.id))

  return contactDiv
}

function selectContact(contactId) {
  currentActiveContact = contactId

  document.querySelectorAll(".contact-item").forEach((item) => {
    item.classList.remove("active")
  })

  const selectedContact = document.querySelector(`[data-contact-id="${contactId}"]`)
  if (selectedContact) {
    selectedContact.classList.add("active")
  }

  renderConversation()
  updateChatHeader()
  updateInfoPanel()

  if (window.innerWidth <= 768 && sidebarVisible) {
    toggleChatSidebar()
  }

  console.log(`Selected contact: ${contactId}`)
}

function updateChatHeader() {
  const contact = chatContacts.find(c => c.id === currentActiveContact)
  if (contact) {
    elements.chatAvatar.textContent = contact.initials
    elements.chatAvatar.style.backgroundColor = contact.avatarColor
    elements.chatUserName.textContent = contact.name
    elements.chatStatus.textContent = contact.isOnline ? "Online" : "Offline"
    elements.chatStatus.style.color = contact.isOnline ? "var(--online-green)" : "var(--text-secondary)"
  }
}

function updateInfoPanel() {
  const contact = chatContacts.find(c => c.id === currentActiveContact)
  if (contact) {
    elements.infoAvatar.textContent = contact.initials
    elements.infoAvatar.style.backgroundColor = contact.avatarColor
    elements.infoUserName.textContent = contact.name
    elements.infoUserRole.textContent = contact.role

    elements.contactDetails.innerHTML = `
      <p>${contact.email}</p>
      <p>${contact.phone}</p>
    `
    elements.sharedFiles.innerHTML = contact.files.map(file => `
      <div class="file-entry">
        <div class="file-type-icon ${file.type}">${file.type.toUpperCase()}</div>
        <div class="file-info">
          <p class="file-name">${file.name}</p>
          <span class="file-size">${file.size}</span>
        </div>
      </div>
    `).join('')
  }
}

// === MESSAGE HANDLING ===
function renderConversation() {
  elements.messagesArea.innerHTML = ""

  const currentHistory = conversationHistories[currentActiveContact] || []
  
  currentHistory.forEach((message) => {
    const messageElement = createMessageElement(message)
    elements.messagesArea.appendChild(messageElement)
  })
  scrollToBottom()
}

function createMessageElement(message) {
  const messageWrapper = document.createElement("div")
  messageWrapper.className = `message-wrapper ${message.sender === "user" ? "sent" : "received"}`
  messageWrapper.dataset.messageId = message.id

  let statusIndicator = ""
  if (message.sender === "user" && message.status) {
    statusIndicator = `<span class="message-status-icon">${getStatusIcon(message.status)}</span>`
  }

  messageWrapper.innerHTML = `
        <div class="message-bubble">
            <div class="message-text">${message.content}</div>
            <div class="message-footer">
                <span class="message-timestamp">${message.timestamp}</span>
                ${statusIndicator}
            </div>
        </div>
    `

  return messageWrapper
}

function getStatusIcon(status) {
  // I'm using different check marks for different statuses
  switch (status) {
    case "sent":
      return "✓"
    case "delivered":
      return "✓✓"
    case "read":
      return "✓✓" 
    default:
      return ""
  }
}

// === MESSAGE SENDING ===
function handleSendMessage() {
  const messageText = elements.messageTextarea.value.trim()
  if (!messageText) return

  sendUserMessage(messageText)

  elements.messageTextarea.value = ""
  resetTextareaHeight()

  showTypingIndicator()
  generateBotResponse()
}

function sendUserMessage(content) {
  const timestamp = getCurrentTimeString()
  const newMessage = {
    id: ++messageIdCounter,
    content: content,
    sender: "user",
    timestamp: timestamp,
    status: "sent",
  }

  if (!conversationHistories[currentActiveContact]) {
    conversationHistories[currentActiveContact] = []
  }
  conversationHistories[currentActiveContact].push(newMessage)

  const messageElement = createMessageElement(newMessage)
  elements.messagesArea.appendChild(messageElement)

  scrollToBottom()
  setTimeout(() => {
    updateMessageStatus(newMessage.id, "delivered")
  }, 1200)

  console.log("User message sent:", content)
}

function updateMessageStatus(messageId, newStatus) {
  const currentHistory = conversationHistories[currentActiveContact]
  if (currentHistory) {
    const message = currentHistory.find((msg) => msg.id === messageId)
    if (message) {
      message.status = newStatus

      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
      if (messageElement) {
        const statusIcon = messageElement.querySelector(".message-status-icon")
        if (statusIcon) {
          statusIcon.textContent = getStatusIcon(newStatus)
        }
      }
    }
  }
}

function showTypingIndicator() {
  if (botIsTyping) return

  botIsTyping = true
  elements.typingIndicator.style.display = "block"
  scrollToBottom()
}

function hideTypingIndicator() {
  botIsTyping = false
  elements.typingIndicator.style.display = "none"
}

// === BOT RESPONSE GENERATION ===
function generateBotResponse() {
  
  const responseDelay = 2000 + Math.random() * 2000

  setTimeout(() => {
    hideTypingIndicator()

    const contactResponses = botResponseTemplates[currentActiveContact] || botResponseTemplates.emma_thompson
    const randomResponse = contactResponses[Math.floor(Math.random() * contactResponses.length)]

    const timestamp = getCurrentTimeString()
    const botMessage = {
      id: ++messageIdCounter,
      content: randomResponse,
      sender: currentActiveContact,
      timestamp: timestamp,
      status: "read",
    }
    if (!conversationHistories[currentActiveContact]) {
      conversationHistories[currentActiveContact] = []
    }
    conversationHistories[currentActiveContact].push(botMessage)

    const messageElement = createMessageElement(botMessage)
    elements.messagesArea.appendChild(messageElement)

    scrollToBottom()

    console.log("Bot response generated:", randomResponse)
  }, responseDelay)
}

// === TEXTAREA HANDLING ===
function handleTextareaKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

function handleTextareaInput() {
  autoResizeTextarea()
}

function autoResizeTextarea() {
  const textarea = elements.messageTextarea
  textarea.style.height = "auto"
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
}

function resetTextareaHeight() {
  elements.messageTextarea.style.height = "auto"
}

// === UTILITY FUNCTIONS ===
function getCurrentTimeString() {
  const now = new Date()
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function scrollToBottom() {
  // I use a small delay to ensure the DOM has updated
  setTimeout(() => {
    elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight
  }, 50)
}

function handleVisibilityChange() {
  if (!document.hidden) {
    const currentHistory = conversationHistories[currentActiveContact]
    if (currentHistory) {
      currentHistory.forEach((message) => {
        if (message.sender === "user" && message.status === "delivered") {
          updateMessageStatus(message.id, "read")
        }
      })
    }
  }
}

// === APP STARTUP ===
document.addEventListener("DOMContentLoaded", initializeApp)

// if u  reviewing my code and checking the console
console.log("%c👋 Hey there! Welcome to ChatSpace!", "color: #6366f1; font-size: 16px; font-weight: bold;")
console.log("%c🛠️ Built with love by Riddhi Chakraborty using vanilla JavaScript", "font-style: italic; color: #64748b;")
console.log("%c💡 Check out the smooth animations and responsive design!", "color: #22c55e;")

// Export for potential future use or testing
window.ChatSpace = {
  toggleTheme,
  sendUserMessage,
  conversationHistories,
  currentActiveContact,
  selectContact,
  version: "1.0.0",
}