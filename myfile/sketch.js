let earthquakes, wgs;


function loadImageErrorOverride(errEvt) {
    const pic = errEvt.target;
    if (!pic.crossOrigin)  {
      return p.print(`Failed to reload ${pic.src}!`);
    }
    p.print(`Attempting to reload ${pic.src} as a tainted image now...`);
    pic.crossOrigin = null;
    pic.src = pic.src;
}

window.onload = function(){
  var earthquake; //宣告要讀取的內容
  var loaded = 0;
  // 基本型
  var mapSketch = function(p5j){
    // 預載入
    p5j.preload = function() {
        var url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?' +
        'format=geojson&starttime=2014-01-01&endtime=2014-01-02';

        p5j.httpGet(url,'jsonp', false, function(response){
          earthquake = response;
        });

    }
    // 執行一次
    p5j.setup = function(){
    	p5j.createCanvas(1200,600);
      //p5j.background(0);
      //console.log(earthquake);
   wgs = p5j.loadImage('./assets/wgs84.png',
        pic => { 
          p.print(wgs = pic);
          p.redraw(); }
        , loadImageErrorOverride);




    }
    // 重複執行
    p5j.draw = function() {

      if(!earthquake){
         return;
       }//else{

        //if(loaded === 1){
            p5j.image(wgs, 0, 0);
          //更直覺的方法 對一個陣列中的每個val物件 其索引值為 i 執行
          earthquake.features.forEach((val)=>{
            let lng = p5j.map(val.geometry.coordinates[0],-180, 180, 0, p5j.width);
            let lat = p5j.map(val.geometry.coordinates[1],-90, 90, 0, p5j.height); 
            let mag = p5j.map(val.properties.mag, 3, 9, 30, 150);

            let place = val.properties.place;

            let txt = val.properties.place;
            //if(i===0){console.log(val.properties.place);}

            // 做範圍
            p5j.ellipseMode(p5j.CENTER);
            p5j.fill(180, 0, 0, 50);
            p5j.stroke(255, 0, 0, 85);
            p5j.ellipse(lng, lat, mag, mag);

            // 做文字
            p5j.fill(0);
            p5j.noStroke();
            p5j.textSize(8);
            p5j.text(txt, lng, lat);

          });
        }
        //loaded +=1;
      //}
    //}
  }

  new p5(mapSketch, 'map');
}