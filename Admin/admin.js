document.addEventListener("DOMContentLoaded", () => {
    let data = {};
  
    const defaultDataPath = '/Admin/JSON/json-general.json'; // Ruta al JSON original
  
    // Cargar datos: primero desde localStorage o si no existe, desde el JSON original.
    function loadData() {
      const saved = localStorage.getItem("productos");
      if (saved) {
        data = JSON.parse(saved);
        renderSections();
        populateSectionDropdown();
      } else {
        fetch(defaultDataPath)
          .then(res => res.json())
          .then(json => {
            data = json;
            renderSections();
            populateSectionDropdown();
          })
          .catch(err => console.error("Error al cargar el JSON:", err));
      }
    }
  
    // Guardar datos en localStorage
    function saveData() {
      localStorage.setItem("productos", JSON.stringify(data));
    }
  
    // Renderizar secciones y sus productos en el contenedor de administración
    function renderSections() {
      const container = document.getElementById("admin-container");
      container.innerHTML = ""; // Limpiar
  
      Object.keys(data).forEach(section => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "section-admin";
        sectionDiv.innerHTML = `<h3>${section}</h3>`;
  
        if (data[section].length > 0) {
          const list = document.createElement("ul");
          data[section].forEach(product => {
            const li = document.createElement("li");
            li.textContent = product.title;
            list.appendChild(li);
          });
          sectionDiv.appendChild(list);
        } else {
          sectionDiv.innerHTML += "<p>No hay productos en esta sección.</p>";
        }
  
        container.appendChild(sectionDiv);
      });
    }
  
    // Poblamos el dropdown de la sección en el formulario de agregar producto
    function populateSectionDropdown() {
      const dropdown = document.getElementById("product-section-select");
      dropdown.innerHTML = "";
      Object.keys(data).forEach(section => {
        const option = document.createElement("option");
        option.value = section;
        option.textContent = section;
        dropdown.appendChild(option);
      });
    }
  
    // Manejo del formulario para crear una nueva sección
    document.getElementById("add-section-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const sectionInput = document.getElementById("new-section-input");
      const newSection = sectionInput.value.trim().toLowerCase();
      if (newSection === "") return;
  
      if (data.hasOwnProperty(newSection)) {
        alert("La sección ya existe.");
        return;
      }
  
      data[newSection] = []; // Crea la sección vacía
      saveData();
      renderSections();
      populateSectionDropdown();
      sectionInput.value = "";
    });
  
    // Manejo del formulario para agregar un producto
    document.getElementById("add-product-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const section = document.getElementById("product-section-select").value;
      const title = document.getElementById("product-title").value.trim();
      const description = document.getElementById("product-description").value.trim();
      const category = document.getElementById("product-category").value.trim().toLowerCase();
      const price = document.getElementById("product-price").value.trim();
      const image = document.getElementById("product-image").value.trim();
      const colors = document.getElementById("product-colors").value.trim();
  
      if (!section || !title || !category) {
        alert("Completa los campos obligatorios.");
        return;
      }
  
      // Creamos un objeto producto único
      const newProduct = {
        id: Date.now(),
        section: section,  // Sección a la que pertenece (ya que lo tomamos del dropdown)
        title,
        description,
        category,
        price,
        image,
        colors,
        visible: true
      };
  
      // Agregar producto a la sección correspondiente
      if (!data[section]) {
        data[section] = [];
      }
      data[section].push(newProduct);
      saveData();
      renderSections();
      e.target.reset();
    });
  
    // Inicializar la carga de datos
    loadData();
  });
  