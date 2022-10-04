const get_APPID = kintone.app.getId();

(function () {

  "use strict";

  kintone.events.on('app.record.index.show', function (event) {

    button_click();
  });

})();
async function button_click() {


  let myIndexButton = document.createElement('button');
  myIndexButton.style.cssText = "padding:7.5px;";
  myIndexButton.id = 'field_JSON';
  myIndexButton.innerText = 'フィールド閲覧';
  //「作成」ボタンを押したとき
  myIndexButton.onclick = async function () {

    //選定されたレコード番号があるとき
    let field_json = await JSON_PRE(get_APPID);
    let array1 = await field_info(field_json);
    console.log(array1);

    download_CSV(array1);


  }

  kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);

}


const JSON_PRE = (get_APPID) => {
  const param = { "app": get_APPID, "lang": "default" };

  return kintone.api('/k/v1/form.json', 'GET', param).then(async resp => {

    return await resp;

  });
};
function field_info(field_json) {
  let param = [];
  param[0] = ["フィールド名", "フィールドコード", "テーブル名", "テーブルコード"];
  let i = 1;
  field_json.properties.forEach((properties) => {
    if (properties.type == "SUBTABLE") {
      param[i] = [`${properties.label}`, `${properties.code}`, "", ""];
      i = i + 1;
      properties.fields.forEach((table) => {
        param[i] = [`${table.label}`, `${table.code}`, `${properties.label}`, `${properties.code}`];

        i = i + 1;
      });
      i = i - 1;
    }
    else {
      param[i] = [`${properties.label}`, `${properties.code}`, "", ""];
    }
    i = i + 1;
  });
  return param;
}
function download_CSV(return_param) {
  let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  let data = return_param.map((record) => record.join(',')).join('\r\n');
  let blob = new Blob([bom, data], { 'type': 'text/csv' });

  let downloadLink = document.createElement('a');
  downloadLink.download = 'sample.csv';
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.dataset.downloadurl = ['text/plain', downloadLink.download, downloadLink.href].join(':');
  downloadLink.click();


}
