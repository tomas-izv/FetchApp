export default class ResponseRow {

    constructor(parent) {
        this.parent = parent;
    }

    add({ id, name, rating, year }) {
        const div = document.createElement('div');
        div.classList.add('row', 'border-bottom', 'py-2', 'align-items-center');

        const idElement = this.createElement(id, 'col-1');
        const nameElement = this.createElement(name, 'col-1');
        const ratingElement = this.createElement(rating, 'col-1');
        const yearElement = this.createElement(year, 'col-1');

        const btnElement = document.createElement('div');
        btnElement.classList.add('col-2');

        const btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');

        // View Button
        const btnView = this.createButton('View', 'btn-primary', '#viewModal', id, { name, rating, year });
        // Edit Button
        const btnEdit = this.createButton('Edit', 'btn-warning', '#editModal', id, { name, rating, year });
        // Delete Button
        const btnDelete = this.createButton('Delete', 'btn-danger', '#deleteModal', id, { name, rating, year });

        btnGroup.append(btnView, btnEdit, btnDelete);
        btnElement.appendChild(btnGroup);

        div.append(idElement, nameElement, ratingElement, yearElement, btnElement);

        this.parent.appendChild(div);
    }

    createElement(value, colClass) {
        const cell = document.createElement('div');
        cell.classList.add(colClass);
        cell.textContent = value;
        cell.style.padding = '0.5rem';
        return cell;
    }

    createButton(text, btnClass, targetModal, id, data) {
        const btn = document.createElement('a');
        btn.classList.add('btn', 'btn-sm', btnClass);
        btn.textContent = text;
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', targetModal);
        btn.dataset.id = id;
        for (let key in data) {
            btn.dataset[key] = data[key];
        }
        btn.dataset.url = '/film/' + id;
        // Asign the method depending on the text in the button
        switch (text.toLowerCase()) {
            case 'view':
                btn.dataset.method = 'get';
                break;
            case 'edit':
                btn.dataset.method = 'put';
                break;
            case 'delete':
                btn.dataset.method = 'delete';
                break;
        }
        return btn;
    }
}