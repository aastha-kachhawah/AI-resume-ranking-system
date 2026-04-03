import './style.css'
let resumes = [];
async function rank() {
  const jobDesc = document.getElementById('jobDesc').value;
  const loading = document.getElementById('loading');
  const list = document.getElementById('results');

  list.innerHTML = '';
  loading.style.display = 'block';

  try {
    const res = await fetch('http://127.0.0.1:5000/rank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
     body: JSON.stringify({
  job_description: jobDesc,
  resumes: resumes
})
    });

    const data = await res.json();

    loading.style.display = 'none';

    data.slice(0, 5).forEach(item => {
      const li = document.createElement('li');

      li.innerHTML = `
        <strong>${item.resume}</strong>
        <div class="bar" style="width:${item.score * 100}%"></div>
        <small>Score: ${(item.score * 100).toFixed(1)}%</small>
      `;

      list.appendChild(li);
    });

  } catch (error) {
    loading.style.display = 'none';
    alert("Backend not responding!");
    console.error(error);
  }
}
function addResume() {
  const input = document.getElementById('resumeInput');
  const list = document.getElementById('resumeList');

  if (input.value.trim() === '') return;

  resumes.push(input.value);

  const li = document.createElement('li');
  li.textContent = input.value;
  list.appendChild(li);

  input.value = '';
}
window.rank = rank;
window.addResume = addResume;