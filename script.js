let root = { type: 'folder', name: '/', children: [] };
let currentPath = [];
let currentFolder = root;

function showModal(type) {
    document.getElementById(`${type}Modal`).style.display = 'block';
}

function closeModal(type) {
    document.getElementById(`${type}Modal`).style.display = 'none';
}

function createItem(type) {
    const name = document.getElementById(`${type}Name`).value.trim();
    if (!name) {
        alert(`Please enter a ${type} name.`);
        return;
    }

    const newItem = { type, name, children: type === 'folder' ? [] : null };
    currentFolder.children.push(newItem);
    renderFileSystem();
    document.getElementById(`${type}Name`).value = ''; // Clear the input
    closeModal(type);
}

let detailedView = false;

function renderFileSystem() {
  const pathDiv = document.getElementById('currentPath');
  const fileSystemDiv = document.getElementById('fileSystem');

    if (!detailedView) {
        const fileSystemDiv = document.getElementById('fileSystem');
        fileSystemDiv.innerHTML = '';
        const pathDiv = document.getElementById('currentPath');
        pathDiv.innerHTML = '';
      
        let pathClickable = '';
        currentPath.forEach((folderName, index) => {
            pathClickable += `/${folderName}`;
            const pathSegment = document.createElement('span');
            pathSegment.textContent = `/${folderName}`;
            pathSegment.style.cursor = 'pointer';
            pathSegment.onclick = () => navigateToPath(pathClickable, index + 1);
            pathDiv.appendChild(pathSegment);
        });

        currentFolder.children.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = item.name;
            itemDiv.style.cursor = 'pointer';
            itemDiv.onclick = () => navigateTo(item);
            fileSystemDiv.appendChild(itemDiv);
        });
    } else {
      renderAll(root, fileSystemDiv); // Render all for detailed view
    }

    pathDiv.innerHTML = currentPath.length ? '/' + currentPath.join('/') : '/';

}


function navigateTo(item) {
    if (item.type === 'folder') {
        currentPath.push(item.name);
        currentFolder = item;
        detailedView = false;  // Exit detailed view when navigating
        renderFileSystem();
    } else {
        alert('You have opened the file: ' + item.name);
    }
}

function navigateUp() {
    if (currentPath.length > 0) {
        currentPath.pop();
        let folder = root;
        currentPath.forEach(path => {
            folder = folder.children.find(child => child.type === 'folder' && child.name === path);
        });
        currentFolder = folder;
        renderFileSystem();
    } else {
        alert("You're already at the root level.");
    }
}

function navigateToPath(path, depth) {
    currentPath = currentPath.slice(0, depth);
    let folder = root;
    currentPath.forEach(folderName => {
        folder = folder.children.find(child => child.type === 'folder' && child.name === folderName);
    });
    currentFolder = folder || root;
    renderFileSystem();
}

function toggleDetailedView() {
    detailedView = !detailedView;
    renderFileSystem();
}

function renderAll(folder, parentElement) {
  parentElement.innerHTML = '';  // Clear previous content
  const ul = document.createElement('ul');
  ul.className = 'tree';
  parentElement.appendChild(ul);

  folder.children.forEach(item => {
      const li = document.createElement('li');
      li.className = 'tree-item';

      const icon = item.type === 'folder' ? '📁' : '📄';
      const textSpan = document.createElement('span');
      textSpan.textContent = item.name;
      
      li.appendChild(textSpan);
      textSpan.style.cursor = 'pointer';
      
      textSpan.onclick = (event) => {
          event.stopPropagation();  // Prevents the li from also responding to the click
          if (item.type === 'folder') {
              currentPath = getCurrentPath(item);
              currentFolder = item;
              detailedView = false;
              renderFileSystem();
          } else {
              alert('You have opened the file: ' + item.name);
          }
      };
      
      ul.appendChild(li);

      if (item.type === 'folder') {
          const childrenContainer = document.createElement('div');
          li.appendChild(childrenContainer);
          renderAll(item, childrenContainer); // Recursive call for nested folders
      }
  });
}


function getCurrentPath(item) {
    let path = [];
    let currentItem = item;
    while (currentItem && currentItem !== root) {
        path.unshift(currentItem.name);
        currentItem = findParent(root, currentItem);
    }
    return path;
}

function findParent(currentFolder, item) {
    if (currentFolder.children.includes(item)) {
        return currentFolder;
    }
    for (let child of currentFolder.children) {
        if (child.type === 'folder') {
            const found = findParent(child, item);
            if (found) return found;
        }
    }
    return null;
}

function goToRootAndExpandAll() {
  currentPath = [];
  currentFolder = root;
  detailedView = true;
  renderFileSystem();
}


// Initial rendering of the file system
renderFileSystem();
