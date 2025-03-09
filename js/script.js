window.addEventListener('load', function () {

    class Circle {
        constructor(radius, red, green, blue, x, y) {
            this.radius = radius;
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.x = x;
            this.y = y;
        }

        draw(ctx) {
            ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    class Square {
        constructor(length, red, green, blue, x, y) {
            this.length = length;
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.x = x;
            this.y = y;
        }

        draw(ctx) {
            ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
            ctx.fillRect(this.x - this.length, this.y - this.length, this.length * 2, this.length * 2);
        }
    }

    class Triangle {
        constructor(length, red, green, blue, x, y) {
            this.length = length;
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.x = x;
            this.y = y;
        }

        draw(ctx) {
            ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.length); // Top vertex
            ctx.lineTo(this.x - this.length, this.y + this.length); // Bottom left vertex
            ctx.lineTo(this.x + this.length, this.y + this.length); // Bottom right vertex
            ctx.closePath();
            ctx.fill();
        }
    }
    class PencilStroke {
        constructor(points, color, size) {
            this.points = points;
            this.color = color;
            this.size = size;
        }

        draw(ctx) {
            if (this.points.length < 2) return;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            this.points.forEach(point => {
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            });
            ctx.closePath();
        }
    }

    class MemeImage {
        constructor(x, y, width, height) {
            this.src = 'Image/unnamed.jpg';
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.image = new Image();
            this.image.src = this.src;
            this.image.onload = () => redrawCanvas();
        }
    
        draw(ctx) {
            if (this.image.complete && this.image.naturalWidth > 0) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                console.error("Image not fully loaded yet: " + this.src);
            }
        }
    }
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let objects = [];
    let drawing = false;
    let currentStroke = null; 

    const shapeSelect = document.getElementById('shape');
    const sizeInput = document.getElementById('size');
    const colorInput = document.getElementById('color');
    const helpButton = document.getElementById('helpButton');
    const clearButton = document.getElementById('clearButton');
    const undoButton = document.getElementById('undoButton');

    colorInput.addEventListener('input', function () {
        let colorPreview = document.getElementById('colorPreview');
        colorPreview.style.backgroundColor = colorInput.value;
    });
    canvas.addEventListener('mousedown', function (e) {
        if (shapeSelect.value === 'pencil') {
            drawing = true;
            currentStroke = new PencilStroke([], colorInput.value, parseInt(sizeInput.value));
            objects.push(currentStroke);
        }
    });

    canvas.addEventListener('mousemove', function (e) {
        if (drawing && currentStroke) {
            currentStroke.points.push({ x: e.offsetX, y: e.offsetY });
            redrawCanvas();
        }
    });

    canvas.addEventListener('mouseup', function () {
        drawing = false;
        currentStroke = null;
        saveObjects();
    });


    // Load objects from local storage
    if (localStorage.getItem('objects')) {
        objects = JSON.parse(localStorage.getItem('objects')).map(obj => {
            switch (obj.type) {
                case 'circle':
                    return new Circle(obj.radius, obj.red, obj.green, obj.blue, obj.x, obj.y);
                case 'square':
                    return new Square(obj.length, obj.red, obj.green, obj.blue, obj.x, obj.y);
                case 'triangle':
                    return new Triangle(obj.length, obj.red, obj.green, obj.blue, obj.x, obj.y);
                case 'pencil':
                    return new PencilStroke(obj.points, obj.color, obj.size);
                case 'meme':
                    return new MemeImage(obj.x, obj.y, obj.width, obj.height);
            }
        });
        redrawCanvas();
    }
    canvas.addEventListener('click', function (e) {
        if (shapeSelect.value === 'meme') {
            const meme = new MemeImage(e.offsetX, e.offsetY, 100, 100);
            objects.push(meme);
            saveObjects();
            redrawCanvas();
        }
    });
    helpButton.addEventListener('click', function () {
        let helpText = document.getElementById("helptext");
        if (helpText.style.display === "none" || helpText.style.display === "") {
            helpText.style.display = "block";
        } else {
            helpText.style.display = "none";
        }
    });

    clearButton.addEventListener('click', function () {
        objects = [];
        saveObjects();
        redrawCanvas();
    });

    undoButton.addEventListener('click', function () {
        objects.pop();
        saveObjects();
        redrawCanvas();
    });

    canvas.addEventListener('click', function (e) {
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;
        let size = parseInt(sizeInput.value);
        let color = colorInput.value;
        let red = parseInt(color.slice(1, 3), 16);
        let green = parseInt(color.slice(3, 5), 16);
        let blue = parseInt(color.slice(5, 7), 16);

        let shapeType = shapeSelect.value;
        let shape;
        switch (shapeType) {
            case 'circle':
                shape = new Circle(size, red, green, blue, mouseX, mouseY);
                break;
            case 'square':
                shape = new Square(size, red, green, blue, mouseX, mouseY);
                break;
            case 'triangle':
                shape = new Triangle(size, red, green, blue, mouseX, mouseY);
                break;
        }
        if (shape) {
            objects.push(shape);
            saveObjects();
            redrawCanvas();
        }
    });
    
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objects.forEach(shape => shape.draw(ctx));
    }

    function saveObjects() {
        localStorage.setItem('objects', JSON.stringify(objects.map(obj => {
            if (obj instanceof Circle) {
                return { type: 'circle', radius: obj.radius, red: obj.red, green: obj.green, blue: obj.blue, x: obj.x, y: obj.y };
            } else if (obj instanceof Square) {
                return { type: 'square', length: obj.length, red: obj.red, green: obj.green, blue: obj.blue, x: obj.x, y: obj.y };
            } else if (obj instanceof Triangle) {
                return { type: 'triangle', length: obj.length, red: obj.red, green: obj.green, blue: obj.blue, x: obj.x, y: obj.y };
            }else if (obj instanceof PencilStroke) {
                return { type: 'pencil', points: obj.points, color: obj.color, size: obj.size };
            }else if (obj instanceof MemeImage) {
                return { type: 'meme', x: obj.x, y: obj.y, width: obj.width, height: obj.height };
            }
        })));
    }
});