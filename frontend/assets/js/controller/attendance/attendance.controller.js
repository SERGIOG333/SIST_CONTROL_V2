document.addEventListener("DOMContentLoaded", () => {
  const qrForm = document.getElementById('qrForm');
  const qrInput = document.getElementById('qrInput');
  const studentCard = document.getElementById('studentCard');
  const studentPhoto = document.getElementById('studentPhoto');
  const studentName = document.getElementById('studentName');
  const studentLastName = document.getElementById('studentLastName');
  const studentId = document.getElementById('studentId');
  const studentEmail = document.getElementById('studentEmail');
  const studentHora = document.getElementById('studentHora');
  const studentFecha = document.getElementById('studentFecha');
  const addToTable = document.getElementById('addToTable');
  const arrivalTableBody = document.querySelector('#arrivalTable tbody');

  let counter = 1;
  let currentStudent = null;

  qrForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = qrInput.value.trim();

    try {
      const res = await fetch(`${URL_STUDENT}${id}`);
      if (!res.ok) throw new Error("Estudiante no encontrado");

      const json = await res.json();
      const data = json.data;

      currentStudent = {
        student_fk: data.student_id,
        name: data.student_name,
        lastName: data.student_last_name,
        id: data.student_identificacion,
        email: data.student_email,
        photo: data.student_photo || "https://via.placeholder.com/100"
      };

      const now = new Date();
      const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const fecha = now.toISOString().split('T')[0];

      studentPhoto.src = currentStudent.photo;
      studentName.textContent = currentStudent.name;
      studentLastName.textContent = currentStudent.lastName;
      studentId.textContent = currentStudent.id;
      studentEmail.textContent = currentStudent.email;
      studentHora.textContent = hora;
      studentFecha.textContent = fecha;

      studentCard.classList.remove('d-none');
    } catch (err) {
      alert("Estudiante no encontrado.");
      console.error(err);
      studentCard.classList.add('d-none');
    }

    qrForm.reset();
  });

  addToTable.addEventListener('click', async function () {
    if (!currentStudent) return;

    try {
      const response = await fetch(URL_ATTENDANCE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ student_fk: currentStudent.student_fk })
      });

      if (!response.ok) throw new Error("Error al registrar asistencia");

      const now = new Date();
      const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const fecha = now.toISOString().split('T')[0];

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${counter++}</td>
        <td><img src="${currentStudent.photo}" class="student-photo" style="width: 50px; height: 50px;"></td>
        <td>${currentStudent.name}</td>
        <td>${currentStudent.lastName}</td>
        <td>${currentStudent.id}</td>
        <td>${currentStudent.email}</td>
        <td>${hora}</td>
        <td>${fecha}</td>
      `;
      arrivalTableBody.appendChild(newRow);
      studentCard.classList.add('d-none');
      currentStudent = null;

    } catch (err) {
      alert("Error al registrar asistencia.");
      console.error(err);
    }
  });
});
