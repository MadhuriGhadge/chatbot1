document.addEventListener("DOMContentLoaded", async function () {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatPanel = document.getElementById("chat-panel");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    let faqData = [];

    // Fetch FAQs from the JSON file
    async function fetchFAQs() {
        try {
            const response = await fetch("faq.json"); // Adjust path if needed
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const data = await response.json();
            faqData = data.faqs || [];
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            faqData = [{ question: "Example Question?", answer: "Example Answer." }]; // Fallback
        }
    }

    await fetchFAQs(); // Load FAQs on startup

    chatbotBtn.addEventListener("click", () => chatPanel.style.display = "flex");
    closeBtn.addEventListener("click", () => {
        chatPanel.style.display = "none";
        chatBody.innerHTML = ""; // Clear chat on close
    });

    sendBtn.addEventListener("click", handleUserMessage);
    userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") handleUserMessage();
    });

    async function handleUserMessage() {
        let userText = userInput.value.trim();
        if (!userText) return;

        addMessage("You: " + userText, "user");
        userInput.value = "";

        setTimeout(() => {
            let botResponse = checkFAQ(userText);
            
            // Check if there's no response from the FAQ
            if (!botResponse) {
                const searchLink = `https://kthmcollege.ac.in/department-computer-science/profile`;
                botResponse = `I'm sorry, I couldn't find an answer for that. You can <a href="${searchLink}" target="_blank">click here</a> for more information.`;
            }
        
            // Add the bot's response as a message
            addMessage("Bot: " + botResponse, "bot");
        }, 500);
    }

    function checkFAQ(userText) {
        if (!faqData || !faqData.length) return null;

        const options = {
            keys: ["question"],
            threshold: 0.4,
            includeScore: true
        };

        let fuse = new Fuse(faqData, options);
        let result = fuse.search(userText);

        if (result.length > 0) {
            return result[0].item.answer;
        }
        return null;
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        
        messageDiv.className = sender; // e.g., "bot" or "user"
        messageDiv.innerHTML = text;  //  innerHTML to allow rendering HTML links
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to the latest message
    }
});
