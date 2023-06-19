@js:
function init_duanPluin(){
    let sel_title = ['配置选择','解析管理','程序主页','更新插件','批量删除'].map((it) => {
        if(it==='配置选择'){
            return '🎾️‍️'+it;
            }else if(it==='解析管理'){
            return '⚾'+it;
        }else if(it==='更新插件'){
            return '🔁'+it;
        }else if(it==='程序主页'){
            return '🏀'+it;
        }else{
            return '⚽'+it;
        }
    });
    return $(sel_title,2).select(() => {
        function compare(name) {
            return function (it) {
                return it === name;
            }
        }
        if(/配置选择/.test(input)){
            return require('https://gitea.com/AI957/Hiker/raw/m/v/Route.js'),setupPages("设置", 1)
        }else if(/更新/.test(input)){
            return $('确定更新插件吗?').confirm(()=>{
                let base_search_js = 'hiker://files/rules/js/断插合集元素.js';
                writeFile(base_search_js,fetch('https://glot.io/snippets/g6136bp9ix/raw'));
                refreshPage(true);
                return 'toast://已更新'
            })
        }else if(/程序主页/.test(input)){
            return "hiker://home@𝑀𝑦𝐹𝑖𝑒𝑙𝑑ᴰⁿ"
        }else if(/批量删除/.test(input)){
            return "file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/plglParse.html"
        }else{
              return require('https://gitea.com/AI957/Hiker/raw/m/v/Route.js'),setupPages("编辑", 1)
        }
    })
}