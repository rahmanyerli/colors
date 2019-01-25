class DragDrop {

	static init() {
		// find draggable elements
		const draggables = document.querySelectorAll("[draggable=true]");
		for (const draggable of draggables) {
			draggable.addEventListener("dragstart", DragDrop.dragstart);
			draggable.addEventListener("dragend", DragDrop.dragend);
		}

		// find dropzones
		const dropzones = document.querySelectorAll("[dropzone=move]");
		for (const dropzone of dropzones) {
			dropzone.addEventListener("dragover", DragDrop.dragover);
			dropzone.addEventListener("dragenter", DragDrop.dragenter);
			dropzone.addEventListener("dragleave", DragDrop.dragleave);
			dropzone.addEventListener("drop", DragDrop.drop);
		}
	}

	static dragstart() {
		// determine the drag type of draggable element (move or copy)
		// decide the type according to the parent node's dropzone attribute!
		if (this.parentNode.getAttribute("dropzone") === "copy") {
			// clone the draggable element
			const clone = this.cloneNode(true);
			// clone.id = "color-" + Math.floor(Math.random() * (10000));
			clone.addEventListener("dragstart", DragDrop.dragstart);
			clone.addEventListener("dragend", DragDrop.dragend);
			clone.classList.remove("span-2");
			clone.classList.add("span-1");
			DragDrop.box = clone;
			DragDrop.box.style.animation = "wiggle 1s ease";
			this.classList.add("swing");
			setTimeout(() => {
				this.classList.remove("swing");
			}, 1000);
		}
		else {
			DragDrop.box = this;
			setTimeout(() => {
				if (this.parentNode.id === "colorMix") {
					setTimeout(() => {
						mixall();
					}, 100);
				}
				this.remove();
			}, 0);
		}
	}

	static dragend() {
		this.classList.remove("removed");
	}

	static dragover(e) {
		e.preventDefault();
	}

	static dragenter(e) {
		e.preventDefault()
		this.classList.add("bg-2");
	}

	static dragleave() {
		this.classList.remove("bg-2");
	}

	static drop() {
		const em = this.querySelector("em");
		if (em) {
			em.remove();
		}
		this.classList.remove("bg-2");
		this.append(DragDrop.box);
		mixall();
	}
}
document.addEventListener("DOMContentLoaded", DragDrop.init);