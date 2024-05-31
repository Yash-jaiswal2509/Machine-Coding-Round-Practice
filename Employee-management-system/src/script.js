(async function () {
  const response = await fetch("./src/data.json");
  const data = await response.json();

  let employeeData = data;

  let selectedEmployeeId = employeeData[0].id;
  let selectedEmployee = employeeData[0];

  const employeeList = document.querySelector(".employees__names--list");
  const employeeInfo = document.querySelector(".employees__single--info");

  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployeeList();
      renderSingleEmployee();
    }

    if (e.target.tagName === "I") {
      employeeData = employeeData.filter(
        (emp) => emp.id !== parseInt(e.target.parentNode.id, 10)
      );
      renderEmployeeList();
    }

    if (String(selectedEmployeeId) === e.target.parentNode.id) {
      selectedEmployeeId = employeeData[0]?.id || -1;
      selectedEmployee = employeeData[0] || null;
      renderSingleEmployee();
    }

    renderEmployeeList();
  });

  const addEmployeeButton = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee__create");

  addEmployeeButton.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("addEmployee")) {
      addEmployeeModal.style.display = "none";
    }
  });

  const dobInput = document.querySelector(".addEmployee__create--dob");
  dobInput.max = `${new Date().getFullYear() - 18}-${new Date()
    .toISOString()
    .slice(5, 10)}`;

  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const values = [...formData.entries()];

    const newEmployee = {};
    values.forEach((value) => {
      newEmployee[value[0]] = value[1];
    });

    newEmployee.id = employeeData[employeeData.length - 1].id + 1;
    newEmployee.age =
      new Date().getFullYear() - parseInt(dobInput.value.slice(0, 4), 10);
    newEmployee.imageUrl =
      newEmployee.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";

    renderEmployeeList();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });

  const renderEmployeeList = () => {
    employeeList.innerHTML = "";
    employeeData.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employees__names--item");

      if (parseInt(selectedEmployeeId, 10) === emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;
      employeeList.append(employee);
    });
  };

  const renderSingleEmployee = () => {
    if (selectedEmployeeId == -1) {
      employeeInfo.innerHTML = "No Employee Found";
      employeeInfo.style.fontWeight = "700";
      return;
    }

    employeeInfo.innerHTML = `
    <img src="${selectedEmployee.imageUrl}"/>
    <span class="employees__single--heading">
    ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
    </span>
    <span>${selectedEmployee.email}</span>
    <span>${selectedEmployee.address}</span>
    <span>${selectedEmployee.contactNumber}</span>
    <span>DOB -${selectedEmployee.dob}</span>
    `;
  };

  if (selectedEmployee) renderSingleEmployee();
  renderEmployeeList();
})();
