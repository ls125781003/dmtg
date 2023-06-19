@js:
function init_duanPluin(){
    let sel_title = ['配置选择','编辑解析','程序主页','更新插件','推荐游戏','批量管理','渐变粉色','渐变紫色','米紫配色','黑灰配色','蓝霓紫色','使用说明'].map((it) => {
        if(it==='配置选择'){
            return '🎯️‍️'+it;
        }else if(it==='更新插件'){
            return '🔁'+it;
        }else if(it==='程序主页'){
            return '🔮'+it;
        }else if(it==='推荐游戏'){
            return '🎨'+it;
        }else if(it==='批量管理'){
            return '🚨'+it;
        }else if(it==='渐变粉色'){
            return '🌟'+it;
        }else if(it==='渐变紫色'){
            return '🌟'+it;
        }else if(it==='米紫配色'){
            return '🌟'+it;
        }else if(it==='黑灰配色'){
            return '🌟'+it;
        }else if(it==='蓝霓紫色'){
            return '🌟'+it;
        }else if(it==='使用说明'){
            return '♥'+it;
        }else{
            return '🍀'+it;
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
                let base_search_js = 'hiker://files/rules/dzHouse/js/断插合集.js';
                writeFile(base_search_js,fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=2134'));
                refreshPage(true);
                return 'toast://已更新'
            })
        }else if(/程序主页/.test(input)){
            return "hiker://home@𝑀𝑦𝐹𝑖𝑒𝑙𝑑ᴰⁿ"
        }else if(/推荐游戏/.test(input)){
            return "https://lanmeiguojiang.com/youxi.html"
        }else if(/批量管理/.test(input)){
            return "file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/plglParse.html"
        }else if(/渐变粉色/.test(input)){
            return $('ⓐ确定导入蓝莓个人美化的断插原版设置皮肤吗?   ⓑ此选项会覆盖你当前断插设置的颜色呦   ⓒ温馨提示:导入前请自行前往备份原版Parse_Dn.html文件，路径如下: /sdcard/Android/data/com.example.hikerview/files/Documents/cache/Parse_Dn.html 以免出现不必要问题   ⓓ如您犹豫不决或不明白或想看看皮肤啥样请点击“取消”按钮后请点使用说明选项并查看断插原版皮肤说明').confirm(()=>{
                let base_search_js = 'hiker://files/cache/Parse_Dn.html';
                writeFile(base_search_js,fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=2335'));
                refreshPage(true);
                return 'toast://已导入'
            })
        }else if(/渐变紫色/.test(input)){
            return $('ⓐ确定导入蓝莓个人美化的断插原版设置皮肤吗?   ⓑ此选项会覆盖你当前断插设置的颜色呦   ⓒ温馨提示:导入前请自行前往备份原版Parse_Dn.html文件，路径如下: /sdcard/Android/data/com.example.hikerview/files/Documents/cache/Parse_Dn.html 以免出现不必要问题   ⓓ如您犹豫不决或不明白或想看看皮肤啥样请点击“取消”按钮后请点使用说明选项并查看断插原版皮肤说明').confirm(()=>{
                let base_search_js = 'hiker://files/cache/Parse_Dn.html';
                writeFile(base_search_js,fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=2334'));
                refreshPage(true);
                return 'toast://已导入'
            })
        }else if(/米紫配色/.test(input)){
            return $('ⓐ确定导入蓝莓个人美化的断插原版设置皮肤吗?   ⓑ此选项会覆盖你当前断插设置的颜色呦   ⓒ温馨提示:导入前请自行前往备份原版Parse_Dn.html文件，路径如下: /sdcard/Android/data/com.example.hikerview/files/Documents/cache/Parse_Dn.html 以免出现不必要问题   ⓓ如您犹豫不决或不明白或想看看皮肤啥样请点击“取消”按钮后请点使用说明选项并查看断插原版皮肤说明').confirm(()=>{
                let base_search_js = 'hiker://files/cache/Parse_Dn.html';
                writeFile(base_search_js,fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=2336'));
                refreshPage(true);
                return 'toast://已导入'
            })
        }else if(/黑灰配色/.test(input)){
            return $('ⓐ确定导入蓝莓个人美化的断插原版设置皮肤吗?   ⓑ此选项会覆盖你当前断插设置的颜色呦   ⓒ温馨提示:导入前请自行前往备份原版Parse_Dn.html文件，路径如下: /sdcard/Android/data/com.example.hikerview/files/Documents/cache/Parse_Dn.html 以免出现不必要问题   ⓓ如您犹豫不决或不明白或想看看皮肤啥样请点击“取消”按钮后请点使用说明选项并查看断插原版皮肤说明').confirm(()=>{
                let base_search_js = 'hiker://files/cache/Parse_Dn.html';
                writeFile(base_search_js,fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=2350'));
                refreshPage(true);
                return 'toast://已导入'
            })
        }else if(/蓝霓紫色/.test(input)){
            return $('ⓐ确定导入蓝莓个人美化的断插原版设置皮肤吗?   ⓑ此选项会覆盖你当前断插设置的颜色呦   ⓒ温馨提示:导入前请自行前往备份原版Parse_Dn.html文件，路径如下: /sdcard/Android/data/com.example.hikerview/files/Documents/cache/Parse_Dn.html 以免出现不必要问题   ⓓ如您犹豫不决或不明白或想看看皮肤啥样请点击“取消”按钮后请点使用说明选项并查看断插原版皮肤说明').confirm(()=>{
                let base_search_js = 'hiker://files/cache/Parse_Dn.html';
                writeFile(base_search_js,fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=3514'));
                refreshPage(true);
                return 'toast://已导入'
            })
        }else if(/使用说明/.test(input)){
            return "https://docs.qq.com/doc/DRENaQkRURUtmd1RQ"
        }else{
              return require('https://gitea.com/AI957/Hiker/raw/m/v/Route.js'),setupPages("编辑", 1)
        }
    })
}