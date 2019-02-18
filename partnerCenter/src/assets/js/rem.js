
/**
 * Created by Administrator on 2017/5/9.
 */
(function (doc, win) {
  let docEl = doc.documentElement
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  let recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) { return }
    //docEl.style.fontSize = 20 * (clientWidth / 750) + 'px'
    docEl.style.zoom = clientWidth / 375
    console.log(clientWidth / 375)
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
