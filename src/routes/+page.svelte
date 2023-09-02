<script>
    import QuestionerView from "$lib/components/QuestionerView.svelte";

    let darkMode = false;

    function toggleDarkMode() {
        darkMode = !darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
</script>

<div class="top-bar">
    <div class="title">Resume Reviewer</div>
    <button on:click={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
</div>

<QuestionerView {darkMode}/>

<style>
    .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #333;
        color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .top-bar .title {
        font-size: 1.5rem;
    }
</style>