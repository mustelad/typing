var displayController = (function() {
  return {
      displayText: function(text) {
          [...text].forEach((element, index) => {
              var html = '<span class="id_%id%">%symbol%<span>';
              newHtml = html.replace('%id%', index);
              newHtml = newHtml.replace("%symbol%", element);
              document.querySelector(".content").insertAdjacentHTML('beforeend', newHtml);
          })
          document.querySelector('.id_0').classList.add('current');
          document.querySelector('.content').style.display = 'block';
      },
      removeText: function(text) {
          [...text].forEach((element, index) => {
              id = ".id_" + index;
              document.querySelector(id).parentNode.removeChild(document.querySelector(id));
          })
      },
      rightButton: function(cur) {
          var element = '.id_' + cur;
          var nextElement = '.id_' + (cur + 1);
          document.querySelector(element).classList.toggle('current');
          document.querySelector(element).classList.toggle('correct');
          document.querySelector(nextElement).classList.add('current');
      },
      lastButton: function() {
          document.querySelector('.content').style.display = 'none';
      }
  }
})()

var controller = (function(dC) {
  var cur = 0;
  var text = 'privet menya zovut Eldar';
  var proceed = function(ev) {
      if (ev.key === "n" && ev.ctrlKey === true && ev.altKey === true) {
          dC.removeText(text);
          restore();

      }
      console.log(ev);
      if (ev.key === text[cur]) {

          if (cur + 1 === text.length) {
              dC.lastButton();
          } else {
              dC.rightButton(cur);
              cur++;
          }

      }


  }
  var restore = function() {
      dC.displayText(text);
      cur = 0;
      document.addEventListener('keydown', (event) => proceed(event));
  }
  return {
      init: function() {
          restore();
      }
  }
})(displayController)

controller.init();