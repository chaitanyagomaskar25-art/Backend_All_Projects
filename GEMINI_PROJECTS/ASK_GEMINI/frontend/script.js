const form = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const answerDiv = document.getElementById("answer");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  if (!question) {
    answerDiv.textContent = "Please enter a question";
    return;
  } 
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Thinking...";
    answerDiv.textContent = "Gemini is thinking......";
    const response = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong...");
    }

    const markdown = marked.parse(data.answer);
    answerDiv.innerHTML = markdown;
    
  } catch (error) {
    console.error(error);

    answerDiv.textContent = "Sorry, something went wrong. Please try again.";
  } finally {
    submitBtn.disabled = false;

    submitBtn.textContent = "Ask Gemini";
  }
});
