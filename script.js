let questions = [];

// Elementos
const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.getElementById("result");
const quizDiv = document.getElementById("quiz");

submitBtn.addEventListener("click", submitQuiz);

// =========================
// EMBARALHAR RESPOSTAS
// =========================
function embaralharTodas(questions) {
  questions.forEach(q => {
    q.options.sort(() => Math.random() - 0.5);
  });
}

// =========================
// CARREGAR QUIZ
// =========================
function loadQuiz() {
  quizDiv.innerHTML = "";

  questions.forEach((q, i) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question-block");

    qDiv.innerHTML += `<h3>${i + 1}. ${q.question}</h3>`;

    q.options.forEach(option => {
      qDiv.innerHTML += `
        <label>
          <input type="radio" name="q${i}" value="${option.id}">
          ${option.text}
        </label><br>
      `;
    });

    qDiv.innerHTML += `<div id="feedback${i}" class="feedback"></div>`;

    quizDiv.appendChild(qDiv);
  });

  // adicionar evento progresso depois que renderiza
  document.querySelectorAll("input[type='radio']").forEach(input => {
    input.addEventListener("change", atualizarProgresso);
  });
}

// =========================
// PROGRESSO
// =========================
function atualizarProgresso() {
  const total = questions.length;
  const respondidas = document.querySelectorAll("input[type='radio']:checked").length;
  const porcentagem = Math.round((respondidas / total) * 100);

  document.getElementById("progressBar").style.width = porcentagem + "%";
}

// =========================
// FINALIZAR QUIZ
// =========================
function submitQuiz() {
  let score = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const feedbackDiv = document.getElementById(`feedback${i}`);

    document.querySelectorAll(`input[name="q${i}"]`).forEach(input => {
      input.disabled = true;
    });

    const correctOption = q.options.find(
      option => option.id === q.correctOptionId
    );

    if (selected) {
      if (selected.value === q.correctOptionId) {
        score++;
        feedbackDiv.innerHTML = "✅ Correct answer!";
        feedbackDiv.className = "feedback correct";
      } else {
        feedbackDiv.innerHTML = `❌ Wrong answer. Correct: <b>${correctOption.text}</b>`;
        feedbackDiv.className = "feedback incorrect";
      }
    } else {
      feedbackDiv.innerHTML = `⚠️ Not answered. Correct: <b>${correctOption.text}</b>`;
      feedbackDiv.className = "feedback incorrect";
    }
  });

  const porcentagem = Math.round((score / questions.length) * 100);

  let mensagemFinal = "";

  if (porcentagem === 100) {
    mensagemFinal = "Excellent performance! 🎉";
  } else if (porcentagem >= 70) {
    mensagemFinal = "Very good! 👏";
  } else if (porcentagem >= 50) {
    mensagemFinal = "Good, but you can improve 👍";
  } else {
    mensagemFinal = "You need more practice 📚";
  }

  resultDiv.innerHTML = `
    You got ${score} out of ${questions.length} (${porcentagem}%).
    <br>${mensagemFinal}
  `;

  submitBtn.disabled = true;
  resultDiv.scrollIntoView({ behavior: "smooth" });
}

// =========================
// BUSCAR PERGUNTAS
// =========================
fetch("./perguntas.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    embaralharTodas(questions);
    loadQuiz();
  })
  .catch(error => {
    console.error("Erro ao carregar perguntas:", error);
  });