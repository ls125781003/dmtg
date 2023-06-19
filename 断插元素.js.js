@js:
function init_duanPluin(){
    let sel_title = ['配置选择','规则解析','程序主页','更新'].map((it) => {
        if(it==='配置选择'){
            return '👁️‍🗨️'+it;
        }else if(it==='更新'){
            return '🔄'+it;
        }else if(it==='程序主页'){
            return '🏡'+it;
        }else{
            return '🎚️'+it;
        }
    });
    return $(sel_title,2).select(() => {
        function compare(name) {
            return function (it) {
                return it === name;
            }
        }
        if(/配置选择/.test(input)){
            return 'hiker://page/Route?rule=MyFieldᴰⁿ&type=设置#noHistory#'
        }else if(/更新/.test(input)){
            return $('确定更新元素吗?').confirm(()=>{
                let base_search_js = 'hiker://files/rules/dzHouse/js/断插元素.js';
                writeFile(base_search_js,fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=1790'));
                refreshPage(true);
                return 'toast://已更新'
            })
        }else if(/程序主页/.test(input)){
            let home = base64Decode("aGlrZXI6Ly9ob21l");
            let ruleList = JSON.parse(request(home));
            let appName = 'MyFieldᴰⁿ';
            let hasRule = ruleList.some(item => item.title === appName);
            if (!hasRule) {
                return 'toast://找不到本地叫做' + appName+'的小程序';
            }
            let ruleJson = ruleList.filter(item => item.title === appName)[0];
            return $("hiker://empty#noHistory#").rule((ruleJson)=>{
                // log(ruleJson.find_rule);
                eval(ruleJson.find_rule);
            },ruleJson)
            // return 'hiker://home@MyFieldᴰⁿ'
        }else{
            // return 'hiker://home@MyFieldᴰⁿ'
            return $("hiker://empty#noHistory#").rule(()=>{
                // let d = [];
                // d.push({
                //     col_type:'text_1',
                //     title:'打开断插主页新窗口',
                //     url:'hiker://home@MyFieldᴰⁿ',
                //     extra:{newWindow: true}
                // });
                // setResult(d);
                this.d=[];
                $.require("hiker://page/jxItem?rule=MyFieldᴰⁿ").jxList();
                setResult(d);
            })
        }
    })
}