export default class BootstrapTableComponent {
	constructor(element) {
		this.container = element;
		this.config = this.configuration();
		this.createWrapper();
		this.createTable();
	}

	createWrapper() {
		this.wrapper = this.createElementWithClasses('div','table-responsive');
		this.appendChildren(this.container,this.wrapper)
	}

	createTable() {
		this.tableElement = this.createElementWithClasses('table','table', 'table-striped', 'table-hover');
		this.appendChildren(this.wrapper,this.tableElement);
		this.createThead();
		this.createTbody();
		this.createTfooter();
	}

	createThead() {
		const thead = this.createElementWithClasses('thead');
		const tr = this.createElementWithClasses('tr');
		this.appendChildren(this.tableElement,thead)
		this.appendChildren(thead,tr)

		this.config.columns.forEach((column) => {
			const th = this.createElementWithClasses('th');
			th.setAttribute('scope', 'row');
			th.textContent = column.name;
			this.appendChildren(tr,th)
		});
	}

	createTbody() {
		this.tbody = this.createElementWithClasses('tbody');
		this.appendChildren(this.tableElement,this.tbody);
	}

	createTfooter() {
		const tfooter = this.createElementWithClasses('div');
		this.appendChildren(this.tableElement,tfooter);
	}

	onData(data, sub) {
		console.log('onData', data);
		const array = this.config.topElement(data);
		const maxRows = 10;

		array.forEach((rowData) => {
			const tr = this.createElementWithClasses('tr');
			this.appendChildren(this.tbody,tr);

			this.config.columns.forEach(async (column) => {
				const td = this.createElementWithClasses('td');
				const textCell = this.createElementWithClasses('span');
				textCell.textContent = column.cell(rowData);
				this.appendChildren(tr,td);
				this.appendChildren(td,textCell);

				if (column.rendering) {
					const div = await column.rendering(column.cell(rowData));
					td.removeChild(textCell);
					this.appendChildren(td,div);
				}
			});
			if (sub) {
				this.tbody.insertBefore(tr, this.tbody.firstChild);
				if (this.tbody.childElementCount > maxRows) {
					this.tbody.removeChild(this.tbody.lastChild);
				}
			} else {
				this.appendChildren(this.tbody,tr);
			}
		});
	}
	createElementWithClasses(elementType, ...classes) {
		const element = document.createElement(elementType);
		element.classList.add(...classes);
		return element;
	 }
	appendChildren(parent, ...children) {
		children.forEach(child => parent.appendChild(child));
	 }
}
