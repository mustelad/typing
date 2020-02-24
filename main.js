var displayController = (function() {
    var removeStyles = function(id) {
        document.querySelector(id).classList.remove('correct');
        document.querySelector(id).classList.remove('wrong');
        document.querySelector(id).classList.remove('current');
    }
    return {
        displayText: function(text) {
            [...text].forEach((element, index) => {
                var html = '<span class="id_%id% symbol">%symbol%<span>';
                newHtml = html.replace('%id%', index);
                newHtml = newHtml.replace("%symbol%", element);
                document.querySelector(".content").insertAdjacentHTML('beforeend', newHtml);
            })
            document.querySelector('.id_0').classList.add('current');
            document.querySelector('.content').style.display = 'block';
        },
        removeText: function(text) {
            for (var i = 0; i < text; i++) {
                id = ".id_" + i;
                document.querySelector(id).parentNode.removeChild(document.querySelector(id));
            }
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
            document.querySelector('.writer').src = "./type-Copy.png"
        },
        oneSymbolBack: function(cur) {
            var element = '.id_' + cur;
            var nextElement = '.id_' + (cur + 1);
            removeStyles(element);
            document.querySelector(element).classList.add('current');
            document.querySelector(nextElement).classList.remove('current');
        },
        wrongSymbol: function(cur) {
            var element = '.id_' + cur;
            var next = '.id_' + (cur + 1);
            removeStyles(element);
            document.querySelector(element).classList.add('wrong');
            document.querySelector(next).classList.add('current');
        },
        updateWPM: function(wpm) {

            document.querySelector('.number').innerHTML = wpm;
        }
    }
})()

var statistic = (function() {
    var TotalMSec = 0.1;
    return {
        wpmCount: function(cur) {
            var wpm = Math.round((cur / 5) / (TotalMSec / 60000));
            return wpm;
        },
        increase: function() {
            TotalMSec = TotalMSec + 1000;
        },
        start: function() {
            TotalMSec = 0.00001;
        }
    }
})();

var controller = (function(dC, stat) {
    var cur = 0;
    var textLength;
    var intervalSec, intervalWPM;
    var text = `This is Paris, and I'm an American who lives here. My name is Jerry Mulligan, and I'm an ex G.I. In 1945 when the army told me to find my own job, I stayed on. And I'll tell you why: I'm a painter, and all my life that's all I've ever wanted to do. For a painter, the mecca of the world for study, for inspiration, and for living is here on this star called Paris.`;
    var proceed = function(ev) {
        if (cur + 1 >= text.length) {
            dC.lastButton();
        }
        if (cur === 0) {
            stat.start();
        }
        if (ev.key === "n" && ev.ctrlKey === true && ev.altKey === true) {
            dC.removeText(textLength);
            restore();
        } else {
            if (ev.key === text[cur]) {
                if (cur + 1 === text.length) {
                    dC.lastButton();
                } else {
                    dC.rightButton(cur);
                    cur++;
                }
            } else {
                if (ev.key === "Backspace" && cur !== 0) {
                    cur--;
                    dC.oneSymbolBack(cur);

                } else {
                    if (ev.key !== "Shift" && ev.key !== 'Control' && ev.key !== 'Alt' && ev.key !== 'Backspace') {
                        dC.wrongSymbol(cur);
                        cur++;
                    }
                }
            }
        }
        if (cur === 1) {
            stat.start();
        }
    }
    var updateWPM = function() {
        if (cur !== 0 && cur + 1 !== text.length) {
            dC.updateWPM(stat.wpmCount(cur));
        }

    }
    var restore = function() {
        dC.displayText(text);
        textLength = text.length;
        cur = 0;
    }
    var redo = function() {
        dC.removeText(textLength);
        dC.displayText(text);
        cur = 0;

    }
    var next = function() {
        dC.removeText(textLength);
        dC.displayText(text);
        cur = 0;
        textLength = text.length;
    }
    var randomText = function() {
        var id = Math.round(Math.random() * 2) + 1;
        fetch(`./texts/${id}.txt`)
            .then(r => r.text())
            .then(t => text = t)
            .then(t => next());
    }
    return {
        init: function() {
            restore();
            document.addEventListener('keydown', (event) => proceed(event));
            document.querySelector('.repeat').addEventListener('click', redo);
            document.querySelector('.next').addEventListener('click', randomText);
            intervalSec = window.setInterval(stat.increase, 1000);
            intervalWPM = window.setInterval(updateWPM, 1000);
        }
    }
})(displayController, statistic)

controller.init();