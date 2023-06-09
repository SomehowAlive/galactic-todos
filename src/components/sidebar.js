import { addProject, editProject, getProjectByName, getProjects, removeProject } from "../controllers/todoController.js";
import Project from "../classes/Project.js";
import { dashboard, renderPage } from "../controllers/Ui.js";
import deleteBtnImg from "../assets/delete-icon.png";
import editBtnImg from "../assets/edit-icon.png";

function addProjectForm(project = null) {
    const cont = document.createElement("form");
    const rowOne = document.createElement("div");
    const projectNameInput = document.createElement("input");
    const projectColorInput = document.createElement("input");
    const rowTwo = document.createElement("div");
    const submitBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");
    const oldName = project ? project.title : null;
    const removeForm = () => document.querySelector(".add-project-form")?.remove();

    submitBtn.type = "button";
    cancelBtn.type = "button";

    projectNameInput.type = "text";
    projectColorInput.type = "color";

    if (project) {
        projectNameInput.value = project.title;
        projectColorInput.value = project.color;
        submitBtn.innerText = "Save";
    } else {
        projectNameInput.placeholder = "project name";
        submitBtn.innerText = "Add";
    }

    cancelBtn.innerText = "Cancel";

    cont.classList.add("add-project-form");
    rowOne.classList.add("add-project-r1");
    projectNameInput.classList.add("inp", "project-name-inp");
    projectColorInput.classList.add("inp", "project-color-inp");
    rowTwo.classList.add("add-project-r2");
    submitBtn.classList.add("add-project-submit-btn");
    cancelBtn.classList.add("add-project-cancel-btn");

    submitBtn.onclick = () => {
        const newProjectName = projectNameInput.value.trim();
        const newProjectColor = projectColorInput.value;
        if (project) {
            if (!getProjects().includes(newProjectName)) {
                editProject(oldName, newProjectName, newProjectColor);
                cont.previousElementSibling.remove();
                cont.insertAdjacentElement("afterend", projectLink(new Project(newProjectName, newProjectColor)));
                removeForm();
                renderPage(getProjectByName(newProjectName));
            }
        } else {
            const projects = getProjects().filter((project) => project.title);
            if (newProjectName !== "" && !projects.includes(newProjectName)) {
                addProject(new Project(newProjectName, newProjectColor));
                removeForm();
                updateProjectsList();
            }
        }
    };

    cancelBtn.onclick = () => {
        cont.previousElementSibling.style.display = "flex";
        removeForm();
    };

    rowOne.appendChild(projectColorInput);
    rowOne.appendChild(projectNameInput);
    rowTwo.appendChild(submitBtn);
    rowTwo.appendChild(cancelBtn);

    cont.appendChild(rowOne);
    cont.appendChild(rowTwo);

    return cont;
}

function addProjectButton() {
    const btn = document.createElement("button");
    btn.textContent = "+ Add Project";

    btn.setAttribute("id", "add-project-btn");
    btn.classList.add("sidebar-link");

    btn.type = "button";

    btn.onclick = (e) => {
        if (!document.querySelector(".add-project-form")) e.currentTarget.insertAdjacentElement("beforebegin", addProjectForm());
    };

    return btn;
}

function sidebarLink(txt) {
    const cont = document.createElement("div");
    const linkTxt = document.createElement("p");

    cont.classList.add("sidebar-link");
    linkTxt.innerText = txt;

    cont.onclick = (e) => {
        document.querySelector(".sidebar-link.active")?.classList.remove("active");
        document.querySelector(".project-link.active")?.classList.remove("active");
        e.currentTarget.classList.add("active");
        if (txt !== "Dashboard") renderPage(txt);
        else {
            const content = document.querySelector(".content");
            if (content) Array.from(content.children).forEach((child) => child.remove());
            content.appendChild(dashboard());
        }
    };

    cont.appendChild(linkTxt);
    return cont;
}

function projectLink(project) {
    const cont = sidebarLink(project.title);
    const projectColorCircle = document.createElement("div");
    const editBtn = document.createElement("button");
    const editBtnIcon = new Image();
    const deleteBtn = document.createElement("button");
    const deleteBtnIcon = new Image();

    cont.classList.add("project-link");
    projectColorCircle.classList.add("project-color");

    cont.setAttribute("id", project.title);

    cont.style.setProperty("--color", project.color);
    cont.style.setProperty("--hover-color", project.color + "5A");

    editBtnIcon.classList.add("icon");
    deleteBtnIcon.classList.add("icon");

    editBtnIcon.src = editBtnImg;
    deleteBtnIcon.src = deleteBtnImg;

    cont.onclick = (e) => {
        document.querySelector(".active")?.classList.remove("active");
        e.currentTarget.classList.add("active");
        renderPage(project);
    };

    editBtn.appendChild(editBtnIcon);
    deleteBtn.appendChild(deleteBtnIcon);

    editBtn.onclick = () => {
        cont.insertAdjacentElement("afterend", addProjectForm(project));
        cont.style.display = "none";
    };

    deleteBtn.onclick = () => {
        removeProject(project.title);
        updateProjectsList();
    };

    cont.appendChild(projectColorCircle);
    cont.appendChild(editBtn);
    cont.appendChild(deleteBtn);

    return cont;
}

function updateProjectsList() {
    const projectsList = document.querySelector(".projects-list");
    Array.from(projectsList.children).forEach((child) => child.remove());
    const projects = getProjects();
    projects.forEach((project) => projectsList.appendChild(projectLink(project)));
    projectsList.appendChild(addProjectButton());
}

export default function sidebar() {
    const sidebar = document.createElement("div");
    const row1 = document.createElement("div");
    const row1Txt = document.createElement("p");
    const dashboardLink = sidebarLink("Dashboard");
    const todayLink = sidebarLink("Today");
    const weekLink = sidebarLink("Week");
    const row2 = document.createElement("div");
    const row2Txt = document.createElement("p");
    const projectsList = document.createElement("div");
    const addProjectBtn = addProjectButton();

    sidebar.classList.add("sidebar");
    row1.classList.add("sidebar-r1");
    row1Txt.classList.add("sidebar-r1-title", "title");
    row2.classList.add("sidebar-r2");
    row2Txt.classList.add("sidebar-r2-title", "title");
    projectsList.classList.add("projects-list");

    row1Txt.innerText = "Home";
    row2Txt.innerText = "Projects";

    dashboardLink.classList.add("active");

    row1.appendChild(row1Txt);
    row1.appendChild(dashboardLink);
    row1.appendChild(todayLink);
    row1.appendChild(weekLink);
    row2.appendChild(row2Txt);
    const projects = getProjects();
    projects.forEach((project) => projectsList.appendChild(projectLink(project)));
    projectsList.appendChild(addProjectBtn);
    row2.appendChild(projectsList);

    sidebar.appendChild(row1);
    sidebar.appendChild(row2);

    return sidebar;
}

export { addProjectForm };
