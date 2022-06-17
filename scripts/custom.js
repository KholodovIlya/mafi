const characters = ["МИРНЫЙ", "МАФИЯ", "МАНЬЯК"];
const characters_count = [];
const current_characters = [];

seed = (new Date()).getMilliseconds();

const plusImage = new Image();
plusImage.src = "resources/images/plus.png"
const minusImage = new Image();
minusImage.src = "resources/images/minus.png"
const arrowImage = new Image();
arrowImage.src = "resources/images/arrow.png"

function drawText(text, x, y) {
  layers[0].context.fillStyle = "white";
  layers[0].context.font = "bold 30px Arial";
  layers[0].context.fillText(text, x, y);
}

class NameText extends GameObject { constructor(x, y, name) { super(x, y, 0, 0); drawText(name, this.transform.position.x, this.transform.position.y); } }

class CountText extends GameObject {
  constructor(x, y) { super(x, y, 40, 40); this.count = 0; this.setCount(0); }

  setCount(value) {
    if(value > 9 | value < 0) return;
    this.count = value; clearTransform(this.transform, 0);
    drawText(this.count, this.transform.position.x - 10, this.transform.position.y + 10);
  }

  getCount() { return this.count; }
}

class ChangeButton extends Button {
  constructor(x, y, value, id, image) {
    super(x, y, 60, 60);
    this.image = image;
    this.value = value; this.id = id;
  }

  animate(value) {
    this.transform.size.x += value;
    this.transform.size.y += value;
  }

  update() { super.update(); clearTransform(this.transform, 0); renderImage(this.image, this.transform, 0); }

  onPress() { this.animate(-10); }
  onInterrupt() { this.animate(10); }
  onRelease() { characters_count[this.id].setCount(characters_count[this.id].getCount() + this.value); this.animate(10); }
}

class StartButton extends Button {
  constructor() {
    super(layers[0].canvas.width - 50, layers[0].canvas.height / 2, 100, layers[0].canvas.height);
  }

  update() { super.update(); renderImage(arrowImage, this.transform, 0); }

  onRelease() {
    clearTransform(new Transform(layers[0].canvas.width / 2, layers[0].canvas.height / 2, layers[0].canvas.width, layers[0].canvas.height), 0);
    for (let x = 0; x < characters.length; x++) {
      for (let y = 0; y < characters_count[x].getCount(); y++) current_characters.push(characters[x]);
    }

    for (let q = 0; q < current_characters.length; q++) {
      const c = current_characters.splice(q, 1);
      current_characters.splice(float2int(random() * (current_characters.length + 1)), 0, c[0]);
    }

    current_characters.unshift("ВЕДУЩИЙ");
    current_characters.push("ВЕДУЩИЙ");

    for (let i = 1; i < objects.length; i++) objects[i].destroyed = true;
    objects.push(new Card());
  }
}

class Card extends Button {
  constructor() {
    super(layers[0].canvas.width / 2, layers[0].canvas.height / 2, 500, 915);
    this.image = new Image(); this.frame = 0; this.change();
  }

  update() { super.update(); renderImage(this.image, this.transform, 0); }

  change() {
    if(current_characters.length == this.frame) return;
    this.image.src = "resources/images/" + current_characters[this.frame] + ".png";
    this.frame += 1;
  }

  onRelease() { this.change(); }
}

let currentID = 0;
function pasteCharacter(name) {
  const position = new Vector2(layers[0].canvas.width / 2, (layers[0].canvas.height / 2) + (currentID * 70) - ((characters.length - 1) * 35));
  objects.push(new NameText(position.x, position.y + 10, name));
  const countText = new CountText(position.x - 20, position.y);
  objects.push(countText); characters_count.push(countText);
  objects.push(new ChangeButton(position.x - 70, position.y, 1, currentID, plusImage));
  objects.push(new ChangeButton(position.x - 150, position.y, -1, currentID, minusImage));
  currentID += 1;
}

plusImage.onload = function() { for (let i = 0; i < characters.length; i++) pasteCharacter(characters[i]); objects.push(new StartButton()); }
