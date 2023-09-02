<script lang="ts">
    import {writable} from "svelte/store";

    let resume: string = '';
    let description: string = '';
    let separatorY = 50;
    let isDragging = false;

    let newQuestion = "";

    let allQuestions = [];
    const questions = writable([]);
    const answers = {};

    let draggedItemIndex = null;

    questions.subscribe((qs) => allQuestions = qs);

    function addQuestion() {
        const question = newQuestion.trim();
        if (question !== "") {
            questions.update(qs => [...qs, question]);
            newQuestion = "";
            answerQuestion(resume, description, question);
        }
    }

    function deleteQuestion(index) {
        questions.update(qs => {
            qs.splice(index, 1);
            return [...qs];
        });
    }

    function dragStart(event, index) {
        draggedItemIndex = index;
        event.dataTransfer.effectAllowed = "move";
    }

    function drop(event, index) {
        questions.update(qs => {
            const item = qs[draggedItemIndex];
            qs.splice(draggedItemIndex, 1);
            qs.splice(index, 0, item);
            return [...qs];
        });
        draggedItemIndex = null;
    }

    function onMouseDown() {
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(event: MouseEvent) {
        if (isDragging) {
            separatorY = (event.clientY / window.innerHeight) * 100;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    $: if (resume || description) {
        for(const question of allQuestions) {
          answerQuestion(resume, description, question);
        }
    }

    async function answerQuestion(resume: string, description: string, question: string) {
        const response = await fetch('/api/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resume, description, question })
        });

        if (response.ok) {
            const data = await response.json();
            answers[question] = data.answer;
            console.log(data.answer); // You can use or display the answer as needed.
        } else {
            console.error("Failed to get the answer");
        }
    }
</script>

<style>
    :global(body) {
        font-family: 'Arial', sans-serif;
        margin: 0;
        background-color: #f4f4f8;
        overflow: hidden; /* Prevents outer scroll */
    }

    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #fff;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
    }

    textarea {
        width: 100%;
        padding: 1rem;
        resize: none;
        border: none;
        outline: none;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        background-color: #f9f9fc;
        box-sizing: border-box; /* Ensures padding and borders are included in total width/height */
    }

    .separator {
        height: 8px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(220, 220, 220, 0.5), rgba(255, 255, 255, 0));
        cursor: ns-resize;
    }

    .header {
        height: 32px;
        text-align: center;
        padding: 0.5rem 0;
        font-size: 18px;
        background-color: #e7e7ec;
        color: #333;
        box-sizing: border-box;
    }

    .right-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #f6f6f9;
        padding: 1rem;
        overflow-y: auto;
    }

    .questions-list {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 1rem;
    }

    .question-item {
        padding: 0.5rem;
        background-color: #fff;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        cursor: move;
    }

    .input-section {
        display: flex;
        justify-content: space-between;
    }

    input[type="text"] {
        flex: 1;
        margin-right: 1rem;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: #fff;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }

    .delete-btn {
        background-color: red;
        color: white;
        border: none;
        padding: 5px;
        border-radius: 50%;
        cursor: pointer;
    }

    .delete-btn:hover {
        background-color: darkred;
    }

    .content-area {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }

    .textarea-container {
        width: 50%; /* Adjust width if needed */
        display: flex;
        flex-direction: column;
    }
</style>

<div class="container">
  <div class="content-area">
    <div class="textarea-container">
      <div class="header">Resume</div>
      <textarea bind:value={resume} placeholder="Paste the resume here..." style="height: calc({separatorY}% - 40px);"></textarea>
      <div class="separator" on:mousedown={onMouseDown}></div>
      <div class="header">Job Description</div>
      <textarea bind:value={description} placeholder="Paste the job description here..."
                style="height: calc({100 - separatorY}% - 40px);"></textarea>
    </div>
    <div class="right-panel">
      <div class="questions-list">
        {#each $questions as question, index}
          <div class="question-item" draggable="true" on:dragstart={e => dragStart(e, index)}
               on:drop={e => drop(e, index)} on:dragover={e => e.preventDefault()}>
            <div>
              <p>{question}</p>
              <p>{answers[question]}</p>
            </div>
            <button class="delete-btn" on:click={() => deleteQuestion(index)}>X</button>
          </div>
        {/each}
      </div>

      <div class="input-section">
        <input type="text" bind:value={newQuestion} on:keyup={(e) => e.key === 'Enter' && addQuestion()}
               placeholder="Add a question..."/>
        <button on:click={addQuestion}>Add</button>
      </div>
    </div>
  </div>
</div>