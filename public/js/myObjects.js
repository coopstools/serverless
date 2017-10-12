function textCrawler(y, x_final, speed) {

  var self = {};
  self._init_x = -100;
  self.x = self._init_x;
  self.y = y;
  self.x_final = x_final;

  self.update = function() {
    self.x = self.x + speed;
  };

  self.display = function() {
    text("request", self.x, self.y);
  };

  self.isPastPoint = function(x) {
    return self.x >= x;
  };

  self.reset = function() {
    self.x = self._init_x;
  };

  return self;
}

function dollarStream(x, y, drop_speed, fade_speed) {

  var self = {};
  self._drop_speed = drop_speed;
  self._fade_speed = fade_speed;
  self._x = x;
  self._y = y;
  self.dollars = [];

  self._frames_since_last_create = 0;

  self.addDollar = function() {
    self.dollars.push({
      _y: self._y,
      _alpha: 255
    });
    self._frames_since_last_create = 0;
  }

  self.update = function() {
    self._frames_since_last_create++;
    self.dollars = self.dollars.map(function(dollar) { return {
      _y: dollar._y + self._drop_speed,
      _alpha: dollar._alpha - self._fade_speed
    };});
    self.dollars = self.dollars.filter(dollar => dollar._y < self._y + 50);
  }

  self.display = function() {
    stroke(0,0,0);
    fill(0, 0, 0);
    textSize(20);
    self.dollars.forEach(dollar => text("$", self._x, dollar._y));
  }

  self.lastCreate = function () {
    return self._frames_since_last_create;
  }

  return self;
}

function buildBox(x, y, w, h) {
  var depth = w / 4;
  quad(x, y, x + w, y, x + w + depth, y - depth, x + depth, y - depth);
  quad(x + w, y, x + w + depth, y - depth, x + w + depth, y + h - depth, x + h, y + h);
  rect(x, y, w, h);
}

function serverElement(y, bg_color) {

  var self = {};
  self._left_edge = 250;
  self._y = y;
  self._front_width = 50;
  self._front_height = 50;

  self._textSize = 16;
  self._request_speed = 6;
  self._request = textCrawler(y + (self._front_height / 2), self._left_edge, self._request_speed);

  self._lost_dollars = dollarStream(
    self._left_edge + (self._front_width / 2),
    self._y - self._front_height,
    3,
    6);

  self._cur_alpha = 255;
  self._fade_rate = 2;
  self._min_alpha = 90;

  self._color = color(196, 79, 54);

  self.update = function() {
    if (self._request.isPastPoint(self._left_edge)) {
      self._cur_alpha = 255;
      self._request.reset();
      self._lost_dollars.addDollar();
    } else {
      self._cur_alpha = self._cur_alpha <= self._min_alpha ? self._cur_alpha : self._cur_alpha - 2;
    }
    self._request.update();
    self._lost_dollars.update();
  };

  self.display = function() {
    stroke(0,0,0);
    fill(255, 255, 255);
    textSize(16);
    self._request.display();

    fill(bg_color);
    noStroke();
    rect(self._left_edge, this._y, 70, 50);

    stroke(0, 0, 0, self._cur_alpha);
    fill(255, 255, 255, self._cur_alpha);
    buildBox(this._left_edge, this._y, 50, 50);

    self._lost_dollars.display();
  };

  return self;
}

function constantServer(y, bg_color) {
  self = serverElement(y, bg_color);
  self.update = function() {
    if (self._request.isPastPoint(self._left_edge)) self._request.reset();
    if (self._lost_dollars.lastCreate() > 15) self._lost_dollars.addDollar();
    self._request.update();
    self._lost_dollars.update();
  }
  return self;
}
