window.addEventListener('load', function() {
    
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
            ctx.fillRect(this.x, this.y, this.length, this.length);
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
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length, this.y);
            ctx.lineTo(this.x + this.length / 2, this.y + this.length);
            ctx.fill();
        }
    }
    
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    const shapeSelect = document.getElementById('shape');
    const sizeInput = document.getElementById('size');
    const colorInput = document.getElementById('color');
    const helpButton = document.getElementById('helpButton');

    helpButton.addEventListener('click', function() {
        alert('To draw a shape, select the shape type, size, and color, then click on the canvas.');
    });

    canvas.addEventListener('click', function(e) {
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
            shape.draw(ctx);
        }
    });
});