function 一级() {
    var d = [];
    addListener('onClose', $.toString(() => {
        initConfig({}); //清空配置,避免炸视界
    }));
    initConfig({
        html: ''
    }); //清空二级记录
    //log(config.html)
    //log(url)
    if (/empty##/.test(MY_URL)) {
        var url = MY_URL.replace('hiker://empty##', '');
        var html = request(url);
    } else {
        var url = MY_URL;
        var html = getResCode();
    }

    //过宝塔检测
    if (html.indexOf('检测中') != -1) {
        let cook = JSON.parse(fetchCookie(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA
            }
        })).join(';');
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cook
            }
        });
    };
    try {
        var list = pdfa(html, 列表);
    } catch (e) {
        var list = ''
    }
    //log(list.length);
    //log(list)
    //看看list是什么
    if (list != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }
        list.forEach(it => {
            //log(pic_url)
            d.push({
                title: pdfh(it, 标题),
                desc: pdfh(it, 描述),
                // pic_url: pd(it, 图片)+ '@Referer=',
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 链接) + "#immersiveTheme#"
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '',
                //content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}

function 搜索() {
    var d = [];
    addListener('onClose', $.toString(() => {
        initConfig({}); //清空配置,避免炸视界
    }));
    initConfig({
        html: ''
    }); //清空二级记录
    //log(config.html)
    //log(url)
    if (/empty##/.test(MY_URL)) {
        var url = MY_URL.replace('hiker://empty##', '');
        var html = request(url);
    } else {
        var url = MY_URL;
        var html = getResCode();
    }

    //过宝塔检测
    if (html.indexOf('检测中') != -1) {
        let cook = JSON.parse(fetchCookie(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA
            }
        })).join(';');
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cook
            }
        });
    };
    try {
        var list = pdfa(html, 列表);
    } catch (e) {
        var list = ''
    }
    //log(list.length);
    //log(list)
    //看看list是什么
    if (list != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }
        list.forEach(it => {
            //log(pic_url)
            d.push({
                title: pdfh(it, 标题),
                content: '描述🔸' + pdfh(it, 描述),
                // pic_url: pd(it, 图片)+ '@Referer=',
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 链接) + "#immersiveTheme#"
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                //desc: it.desc || '',
                content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}


function 二级() {
    var d = [];
    //一级向二级传递参数    
    var parent = MY_PARAMS || {};
    try {
        var ua = UA
    } catch (e) {
        var ua = 0
    }

    if (!config.html || getMyVar('last') !== MY_URL) {
        var url = MY_URL.replace('hiker://empty##', '').split('#')[0];
        var html = ua == 1 ? fetch(url) : request(url);
        log("当前UA： " + ua)
        initConfig({
            html: html
        });
        putMyVar('last', MY_URL);
        // putMyVar('last',true_url);
    } else {
        var html = config.html;
    }
    var 通免 = $("").lazyRule(() => {
        //const {lazyParse} = $.require('hiker://page/globalParse?rule=道长仓库Pro');
        const {lazyParse} = $.require('hiker://files/rules/模板/仓库通免.js');
        return lazyParse(input)
        //require('hiker://files/rules/模板/香免.js');
        //return x5rule(input, input);
    });

    lazy = (typeof(lazy) === 'undefined' || !lazy) ? false : lazy;
    _reChange = (typeof(_reChange) === 'undefined' || !_reChange) ? false : _reChange;
    lazy = lazy || 通免;
    //  lazy = lazy || '';

    //过宝塔检测
    if (html.indexOf('检测中') != -1) {
        let cook = JSON.parse(fetchCookie(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA
            }
        })).join(';');
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cook
            }
        });
    };
    var tabs = [];
    var lists = [];
    var arts = pdfa(html, 线路列表);
    var conts = pdfa(html, 选集列表);
    for (var i in conts) {
        lists.push(pdfa(conts[i], 选集标签));
        tabs.push(pdfh(arts[i], 线路标签).replace(//g, ''))
    }

    d.push({
        title: getHead5(parent.title) + '\n',
        desc: getHead6('描述🔸') + getHead6(parent.desc || parent.content).replace('描述🔸', ''),
        img: parent.img,
        //url:调用断插==1?"hiker://page/Route?rule=MyFieldᴰⁿ&type=设置#noHistory#":MY_URL.replace('hiker://empty##',''),
        url: MY_URL.replace('hiker://empty##', ''),
        col_type: 'movie_1_vertical_pic_blur',
        extra: {
            gradient: false,
            lineVisible: false

        }
    });

    //折叠需要用到的
    blank(5, 3, 13) //空白行
    //log(blank(20, 20))

    function setTabs(tabs, vari) {
        d.push({
            title: '💫',
            url: $("#noLoading#").lazyRule(() => {
                if (getMyVar('选集排序') == '1') {
                    putMyVar('选集排序', '0');
                } else {
                    putMyVar('选集排序', '1')
                };
                refreshPage(false);
                return 'toast://切换排序成功'
            }),
            col_type: 'scroll_button',
            extra: {
                gradient: false,
                lineVisible: false
            }
        });
        for (var i in tabs) {
            var tabname = tabs[i];
            d.push({
                title: getVar('vari', '0') == i ? getHead7(tabname) : getHead2(tabname),
                col_type: 'scroll_button',
                url: $("#noLoading#").lazyRule((tabname, i) => {
                    putVar('当前线路名', tabname);
                    putVar('vari', i)
                    refreshPage(false);
                    return 'hiker://empty'
                }, tabname, i)
            });
        }
    }

    function setLists(lists, index) {
        blank(0, 3, 15);
        if (lists.length != '') {
            if (index > lists.length - 1) {
                index = 0
            }
            var list = lists[index] || lists[0];
            try {
                if (pdfh(list[0], "a&&Text").match(/(\d+)/)[0] > pdfh(list.slice(-1)[0], "a&&Text").match(/(\d+)/)[0]) list.reverse();
            } catch (e) {}
            for (var j = 0; j < lists.length; j++) {
                var title = pdfh(list[j], 'a&&Text');
                if (title == '') {
                    var title = '暂无，等待上传'
                } else {
                    var title = title
                }
                /*
                                let type = "text_3";
                                let max = 0;
                                for (let j = 0; j < list.length; j++) {
                                    var jm = pdfh(list[j], 'a&&Text').replace(/第|期|集|话/g, '');
                                    max = Math.max(max, jm.length);
                                }
                                if (max < 5) {
                                    type = 'text_5';
                                } else if (max <= 6) {
                                    type = 'text_3';
                                } else if (max <= 13) {
                                    type = 'text_2';
                                } else {
                                    type = 'text_1'
                                }
                */
                let type = "text_5";
                for (let j = 0; j < list.length; j++) {
                    var jm = pdfh(list[j], 'a&&Text');
                    if (jm.length < 5) {
                        var type = 'text_5';
                        break;
                    } else if (jm.length < 8) {
                        var type = 'text_3';
                        break;
                    } else if (jm.length < 12) {
                        var type = 'text_2';
                        break;
                    } else {
                        var type = 'text_1';
                        break;
                    }
                }


                function playLists() {
                    var jm = pdfh(list[j], 'a&&Text').replace(/第|期|集|话|最新/g, '');
                    // log(type)
                    try {

                        var url = pd(list[j], 'a&&href') + lazy;
                        // var url = lazy ? pd(list[j], 'a&&href') + lazy : 'video://' + pd(list[j], 'a&&href');
                        //var url = lazy ? pd(list[j], 'a&&href') + lazy : pd(list[j], 'a&&href')+通免;

                    } catch (e) {
                        var url = 'toast://未知链接';
                    }
                    d.push({
                        title: getHead4(jm),
                        url: url,
                        col_type: type,
                        extra: {
                            blockRules: ['baidu.*.png', '.jpg', '.mp3', '.mp4', '.m3u8', '.flv', '.avi', '.3gp', '.mpeg', '.wmv', '.mov', '.rmvb', '.gif', '.jpg', '.jpeg', '.png', '.ico', '.svg']
                        }
                    });
                }
            }
            // 开始选集分区
            addListener('onClose', $.toString(() => {
                clearMyVar('当前线路名');
                clearMyVar('分集起');
                clearMyVar('分集终');
            }));
            //选集＞则启用选集分区（list替换成你的选集数组）
            var 选集数组 = list; //改
            //选集＞则启用选集分区
            if (list.length > 71) {
                if (list.length > 151) {
                    var page_number = 100;
                } else {
                    var page_number = 70;
                }
                var star = getMyVar('分集起', '1');
                var end = getMyVar('分集终', JSON.stringify(page_number));
                var total = Math.ceil(list.length / page_number);
                var catalogue = []
                for (let i = 0; i < total; i++) {
                    catalogue += i * page_number + ',';
                    catalogue = catalogue.split(',');
                }
                for (var i = 0; i < catalogue.length - 1; i++) {
                    var total1 = parseInt(catalogue[i]) + 1;
                    var total2 = parseInt(catalogue[i + 1]);
                    if (i == (catalogue.length - 2))
                        var total2 = list.length;
                    d.push({
                        // title: star == total1 ? '‘‘' + total1 + '-' + total2 + '’’' : '‘‘’’<font color="#222222">' + total1 + '-' + total2,
                        title: star == total1 ? getHead7(total1) + '-' + getHead7(total2) : '‘‘’’<font color="#222222">' + total1 + '-' + total2,

                        url: $("#noLoading#").lazyRule((total1, total2) => {
                            putMyVar('分集起', total1);
                            putMyVar('分集终', total2);
                            refreshPage(false);
                            return 'hiker://empty'
                        }, total1, total2),
                        col_type: 'scroll_button'
                    });
                }
                if (getMyVar('选集排序') == 1) {
                    for (var j = end - 1; j >= star - 1; j--) {
                        playLists()
                    }
                } else {
                    for (var j = star - 1; j < end; j++) {
                        playLists();
                    }
                }
                blank(10, 1, 15) //空白行
                var yema = Math.ceil(end / page_number);
                d.push({
                    title: getHead3('上一页'),
                    url: $("#noLoading#").lazyRule((star, end, page_number, total, 选集数组) => {
                        var s = parseInt(star) - page_number;
                        var e = parseInt(end) - page_number;
                        if (end = 选集数组.length) var e = s + page_number - 1;
                        if (s < 1) {
                            var s = 1;
                            var e = page_number;
                        }
                        if (s > 0) {
                            putMyVar('分集起', s);
                            putMyVar('分集终', e);
                            refreshPage(false);
                        }
                        return 'hiker://empty'
                    }, star, end, page_number, total, 选集数组),
                    col_type: 'flex_button'
                });
                d.push({
                    title: '‘‘’’<small>' + getHead2('\t\t\t༺第') + '</front>' + '\t\t\t' + getHead1(yema) + '\t\t\t' + getHead2('页༻\t\t\t\t') + '</front>',
                    url: $("#noLoading#").lazyRule((page_number) => {
                        putMyVar('分集起', '1');
                        putMyVar('分集终', page_number);
                        refreshPage(false);
                        return 'hiker://empty'
                    }, page_number),
                    col_type: "flex_button",
                    extra: {
                        lineVisible: false
                    }
                })
                d.push({
                    title: getHead3('下一页'),
                    url: $("#noLoading#").lazyRule((star, end, page_number, total, 选集数组) => {
                        var s = parseInt(star) + page_number;
                        var e = parseInt(end) + page_number;
                        if (e > 选集数组.length) {
                            var s = (total - 1) * page_number + 1;
                            var e = 选集数组.length;
                        }
                        putMyVar('分集起', s);
                        putMyVar('分集终', e);
                        refreshPage(false);
                        return 'hiker://empty'
                    }, star, end, page_number, total, 选集数组),
                    col_type: 'flex_button'
                });
            } // 结束选集分区
            else {
                if (getMyVar('选集排序') == 1) {
                    for (var j = list.length - 1; j >= 0; j--) {
                        playLists()
                    }
                } else {
                    for (var j = 0; j < list.length; j++) {
                        playLists()
                    }
                }
            }
            blank(20, 0, 0);
        } else {
            d.push({
                title: '当前线路暂无集数,请检查选集是否正确',
                url: 'toast://当前线路暂无集数,请检查选集是否正确',
                col_type: 'text_1'
            });
        }
    }
    setTabs(tabs, getVar('vari', '0'));
    setLists(lists, getVar('vari', '0'));
    setResult(d);

    function blank(num, num1, num2) {
        for (let i = 0; i < num; i++) {
            d.push({
                col_type: 'blank_block'
            })
        }
        for (let i = 0; i < num1; i++) {
            d.push({
                col_type: 'line'
            })
        }
        for (let i = 0; i < num2; i++) {
            d.push({
                col_type: 'blank_block'
            })
        }
    }
}

function 二级加密() {
    var d = [];
    var html = getResCode()
    var parent = MY_PARAMS || {};
    try {
        var ua = UA
    } catch (e) {
        var ua = "0"
    }
    if (!config.html || getMyVar('last') !== MY_URL) {
        if (ua == "1") {
            var html = fetch(MY_URL.split('##')[1]);
            log("当前UA： " + 'PC_UA')
        } else {
            var html = request(MY_URL.split('##')[1]);
            //log("当前UA：  "+'安卓_UA')
        }
        initConfig({
            html: html
        });
        putMyVar('last', MY_URL);
    } else {
        var html = config.html;
    }

    function blank(num, num1, num2) {
        for (let i = 0; i < num; i++) {
            d.push({
                col_type: 'blank_block'
            })
        }
        for (let i = 0; i < num1; i++) {
            d.push({
                //  col_type: 'line_blank'
                col_type: 'line'
            })
        }
        for (let i = 0; i < num2; i++) {
            d.push({
                col_type: 'blank_block'
            })
        }
    }


    //通用匹配
    putVar("_x5", $.toString(() => {
        var urls = _getUrls();
        for (var i in urls) {
            if (urls[i].match(/\.mp4|\.m3u8|\.flv|\.avi|\.mpeg|\.wmv|\.mov|\.rmvb|\.dat|qqBFdownload|mime=video%2F|video_mp4/)) {
                fy_bridge_app.log(urls[i]);
                return urls[i].replace(/https.*url=/, '').replace(/http.*url=/, '').replace(/https.*v=/, '').replace(/&from=.*/, '')
            }
        }
    }))
    通免 = "@lazyRule=.js:showLoading('通用免嗅解析中，请稍候....');'x5Rule://'+input+'@' + getVar('_x5')";

    d.push({
        title: getHead5(parent.title) + '\n',
        desc: getHead6('状态🔸') + getHead6(parent.desc || parent.content).replace('状态🔸', ''),
        img: parent.img,
        //url:调用断插==1?"hiker://page/Route?rule=MyFieldᴰⁿ&type=设置#noHistory#":MY_URL.replace('hiker://empty##',''),
        url: MY_URL.replace('hiker://empty##', '').replace('hiker://empty#', ''),
        col_type: 'movie_1_vertical_pic_blur'
    });

    html = pdfh(html, 'script,-1&&Html').split('ipfslist')[0]


    if (html.length < 31999) {
        var video = request('https://tv.cnvercel.cf/api/dandan?' + encodeURIComponent(html)).split('@@@');
    } else {
        var video = fetch('https://tv.cnvercel.cf/api/dandan', {
            method: 'POST',
            body: 'txt=' + encodeURIComponent(html),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).split('@@@');
    }
    hideLoading();
    var tabs = [];
    var lists = [];

    var conts = video

    for (var i in conts) {
        if (conts[i] != '') {
            tabs.push(conts[i].split('!!!')[0])
            lists.push(conts[i].split('!!!')[1].split('|'))

        }
    }

    blank(8, 5, 13) //空白行
    function setTabs(tabs, vari) {
        d.push({
            title: (getVar('shsort') == '1') ? '💫' : '💫',
            url: `#noLoading#@lazyRule=.js:let conf = getVar('shsort');if(conf=='1'){putVar({key:'shsort', value:'0'});}else{putVar({key:'shsort', value:'1'})};refreshPage();'toast://切换排序成功'`,
            col_type: 'scroll_button'
        })
        for (var i = 0; i < tabs.length; i++) {
            var url = "#noLoading#@lazyRule=.js:putVar('" + vari + "', '" + i + "');refreshPage(false);'toast://切换成功！';'#noHistory#hiker://empty'";
            d.push({
                title: getVar(vari, '0') == i ? getHead7(tabs[i]) : getHead2(tabs[i]),
                url: url,
                col_type: 'scroll_button'
            })
        }
    }

    function setLists(lists, index) {
        blank(0, 5, 15) //空白行
        var list = lists[index];
        if (getVar('shsort') == '1') {
            var list = lists[index].reverse();
        }
        for (var j in list) {
            if (list[j] != '') {
                let params = list[j].split('$');
                let t = params[0];
                let jm = params[0].replace(/第|集|期/g, '');

                let u = params[1];
                if (!u.startsWith('http')) {

                    try {
                        url = u + lazy;
                    } catch (e) {
                        url = u + 通免;
                    }
                }
                if (jm.length < 5) {
                    var clt = 'text_5';
                } else if (jm.length < 16) {
                    var clt = 'text_2';
                } else {
                    var clt = 'text_1';
                }
                d.push({

                    title: getHead4(jm),
                    url: url,
                    col_type: clt,

                });
            }
        }
    }


    setTabs(tabs, MY_URL);
    setLists(lists, getVar(MY_URL, '0'));

    setResult(d);
}

//页码数字颜色
function getHead1(title) {
    return '‘‘’’<strong><font color="#FF9966">' + title + '</strong></front>';
}
//页码文字颜色
function getHead2(title) {
    return '‘‘’’<font color="#333333">' + title + '</front>';
}
//下一页按钮颜色
function getHead3(title) {
    return '‘‘’’<strong><font color="#87CEFA">' + title + '</small></front>';
}
//选集列表颜色
function getHead4(title) {
    return '‘‘’’<font color="#111111">' + title + '</front>';
}
//标题颜色
function getHead5(title) {
    return '‘‘’’<big><b><font color="#222222">' + title + '</bog></front>';
}
//描述颜色
function getHead6(title) {
    return '‘‘’’<b><font color="#FF99FF">' + title + '</b></front>';
}
//线路切换颜色
function getHead7(title) {
    return '‘‘’’<font color="#FF9966">' + title + '</font>';
}


function 章节() {
    if (MY_URL.indexOf('hiker://empty##') > -1) {
        var html = fetch(MY_URL.split('##')[1])
    } else {
        var html = getResCode()
    }
    var conts = parseDomForArray(html, 选集列表)[0]
    var list = parseDomForArray(conts, 选集标签)
    var title = parseDomForHtml(list[list.length - 1], 'a&&Text')
    setResult("更新至: " + title);
}

function 搜索验证() {
    var d = [];
    addListener('onClose', $.toString(() => {
        initConfig({}); //清空配置,避免炸视界
    }));
    initConfig({
        html: ''
    }); //清空二级记录
    //log(config.html)
    //log(url)
    if (/empty##/.test(MY_URL)) {
        var url = MY_URL.replace('hiker://empty##', '');
        var html = request(url);
    } else {
        var url = MY_URL;
        var html = getResCode();
    }

    //过宝塔检测
    if (html.indexOf('检测中') != -1) {
        let cook = JSON.parse(fetchCookie(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA
            }
        })).join(';');
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cook
            }
        });
    };
    try {
        var 图片ua = pic
    } catch (e) {
        var 图片ua = 0
    }
    d = JSON.parse(html).list.map(
        data => ({
            title: data.name,
            img: 图片ua == 1 ? data.pic : (data.pic + '@Referer='),
            url: 'hiker://empty##' + MY_HOME + 片源链接 + data.id + '.html#immersiveTheme#',
            // content: '描述🔸' + MY_HOME,
        })
    )

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '',
                content: it.content || '暂无描述',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}

function 数字验证() {
    var d = [];

    //log(config.html)
    //log(url)
    if (/empty##/.test(MY_URL)) {
        var url = MY_URL.replace('hiker://empty##', '');
        var html = request(url);
    } else {
        var url = MY_URL;
        var html = getResCode();
    }
    //过宝塔检测
    if (html.indexOf('检测中') != -1) {
        let cook = JSON.parse(fetchCookie(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA
            }
        })).join(';');
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cook
            }
        });
    };
    //…………验证代码开始…………

    //更新时间 2022.6.7
    if (/验证码|系统安全验证/.test(html)) {

        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL
        };
        //eval(JSON.parse(request('hiker://page/jxhs?rule=模板·Q')).rule);
        //evalPrivateJS(ssyz);
        function getVCode2(img, headers, type) {
            const MAP_NUM = {
                a: 4,
                b: 6,
                d: 0,
                e: 9,
                g: 9,
                i: 1,
                l: 1,
                m: 3,
                s: 5,
                t: 7,
                o: 0,
                q: 9,
                u: 4,
                z: 2
            };
            const MAP_ALPHA = {
                4: 'a',
                6: 'b',
                9: 'q',
                1: 'l',
                3: 'm',
                5: 's',
                7: 't',
                0: 'o',
                2: 'z'
            };

            function ocr(hex) {
                let ret = request('http://ocr.nokia.press/dz6/api/ocr', {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: 'hex=' + hex,
                    method: 'POST'
                });
                return ret
            }
            let hex = request(img, {
                headers: JSON.parse(headers),
                toHex: true
            });
            let ret = JSON.parse(ocr(hex));
            log(ret)
            let result = ret.ret.split('');
            for (i = 0; i < result.length; i++) {
                if (type == 'num' && MAP_NUM[result[i]]) result[i] = MAP_NUM[result[i]];
                else if (type == 'alpha' && MAP_ALPHA[result[i]]) result[i] = MAP_ALPHA[result[i]];
            }
            ret.text = result.join('');
            return JSON.stringify(ret);
        }
        let vcode = getVCode2(MY_HOME + '/index.php/verify/index.html?', JSON.stringify(headers), 'num');
        fetch(MY_HOME + html.match(/\/index.php.*?verify=/)[0] + JSON.parse(vcode).ret, {
            headers: headers,
            method: 'POST'
        })
        var yz = MY_TYPE == 'home' ? true_url : MY_URL
        log(yz)
        html = fetch(yz, {
            headers: headers
        });
    }
    if (/8秒|频繁/.test(html) && !MY_TYPE == 'home') {
        d.push({
            title: '搜索间隔8秒，下拉刷新'
        })
    }
    //…………验证代码结束…………
    //log(html)
    try {
        var list = pdfa(html, 列表);
    } catch (e) {
        var list = ''
    }
    //log(list.length);
    //log(list)
    //看看list是什么
    if (list != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }
        list.forEach(it => {
            //log(pic_url) 
            d.push({
                title: pdfh(it, 标题),
                content: '描述🔸' + pdfh(it, 描述),
                // pic_url: pd(it, 图片)+ '@Referer=',
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 链接) + "#immersiveTheme#"
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '',
                content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}


function 滑动验证() {
    var d = [];

    addListener('onClose', $.toString(() => {
        initConfig({}); //清空配置,避免炸视界
    }));
    initConfig({
        html: ''
    }); //清空二级记录
    //log(config.html)
    //log(url)

    //…………验证代码开始…………

    //更新时间2022.6.7

    function getVCode(img, headers, type) {
        let html = "";
        if (/btbdys|52bdys|mp4er|bde4/.test(img)) {
            let api = 'https://ocr.hiker.eu.org/bde/hex/text';
            let api1 = 'https://py.hiker.eu.org/bdeocr';
            let hex = request(img, {
                headers: JSON.parse(headers),
                toHex: true
            });

            html = request(api, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: 'hex=' + hex,
                method: 'POST'
            });

        } else {
            let api = base64Decode("aHR0cHM6Ly9jb2RlLmNudmVyY2VsLmNmL3hvY3J4P3VybD0=");
            let url = api + img + "&type=" + type + "&headers=" + headers;
            html = fetch(url, {
                timeout: 12000
            });
        }
        return html;
    }

    function getVCode2(img, headers, type, sleepSec) {
        let begin = new Date().getSeconds();
        sleepSec = (sleepSec == undefined) ? 0 : sleepSec;
        const MAP_NUM = {
            a: 4,
            b: 8,
            d: 0,
            e: 9,
            g: 9,
            i: 1,
            l: 1,
            m: 3,
            s: 5,
            t: 7,
            o: 0,
            q: 9,
            u: 4,
            z: 2
        };
        const MAP_ALPHA = {
            4: 'a',
            6: 'b',
            8: 'b',
            9: 'q',
            1: 'l',
            3: 'm',
            5: 's',
            7: 't',
            0: 'o',
            2: 'z'
        };

        function ocr(hex) {
            api0 = 'http://ocr.nokia.press/dz/api/ocr';
            api1 = 'http://www.zruiry.com:9898/ocr/hex/json';
            api2 = 'https://ocr.hiker.eu.org/ocr/hex/json';
            api = api1;
            //let now=new Date().getHours();
            //if(now>7 && now<24) api=api1;
            //else api=api0;
            let ret = request(api, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: 'hex=' + hex,
                method: 'POST'
            });
            return ret
        }

        let hex = request(img, {
            headers: JSON.parse(headers),
            toHex: true
        });
        let ret = JSON.parse(ocr(hex));
        let result = ret.ret.split('');
        for (i = 0; i < result.length; i++) {
            if (type == 'num' && MAP_NUM[result[i]] != undefined) result[i] = MAP_NUM[result[i]];
            else if (type == 'alpha' && MAP_ALPHA[result[i]] != undefined) result[i] = MAP_ALPHA[result[i]];
        }
        ret.text = result.join('');
        if (sleepSec) {
            //sleep       
            let end = new Date().getSeconds();
            let s = sleepSec - (end - begin);
            if (s > 0) sleep(s);
        }

        return JSON.stringify(ret);

    }

    function getRandIP() {
        if (getVar('zhenbuka$ip'))
            return getVar('zhenbuka$ip');
        var ip = []
        for (var i = 0; i < 4; i++) {
            ip = ip + Math.floor(Math.random() * 256) + "."
        }
        ip = ip.substr(0, ip.length - 1)
        putVar('zhenbuka$ip', ip)
        return ip
    }

    function bypassZBK(img, headers) {
        let api = 'https://py.hiker.eu.org/scode';
        let api1 = 'https://ocr.hiker.eu.org/zbk/compare/hex/text';
        //let url = api + img + "&headers=" + headers;
        let hex = request(img, {
            headers: JSON.parse(headers),
            toHex: true
        });
        let html = fetch(api, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: 'hex=' + hex,
            method: 'POST'
        });
        return html;
    }


    function sleep(n) {
        //n为整数，单位秒
        /*t1=(new Date()).getTime();
        while((new Date()).getTime()-t1<n);*/
        //n=n>=1000?Math.ceil(n/1000):n;
        fetch('https://py.hiker.eu.org/api/sleep?' + n, {
            timeout: n * 1000
        })

    }
    let headers = {
        "User-Agent": MOBILE_UA,
        "referer": MY_HOME,
        //  "cookie": getVar('zhenbuka$cookie')
    };
    let url = MY_URL.replace("hiker://empty##", '');
    let searchPage = fetch(url, {
        method: "POST",
        headers: headers
    });

    if (searchPage.indexOf("验证页面") != -1) {

        let vcode = bypassZBK(MY_HOME + '/extend/tncode/tncode.php', JSON.stringify(headers));
        fetch(MY_HOME + '/index.php/vodsearch/-------------/?tn_r=' + vcode, {
            method: "GET",
            headers: headers
        });

        searchPage = fetch(url, {
            method: "POST",
            headers: headers
        });
    }
    //…………验证代码结束…………

    try {
        var tabs = pdfa(searchPage, 列表);
    } catch (e) {
        var tabs = ''
    }
    //log(list.length);
    //log(list)
    //看看list是什么
    if (tabs != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }

        tabs.forEach(it => {
            d.push({
                title: pdfh(it, 标题),
                content: '描述🔸' + pdfh(it, 描述),
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 'a&&href') + '#immersiveTheme#',
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '暂无描述',
                content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}

function 一级A() {

    var d = [];
    //  var html = getResCode()
    if (/empty##/.test(MY_URL)) {
        var url = MY_URL.replace('hiker://empty##', '');
        var html = request(url);
    } else {
        var url = MY_URL;
        var html = getResCode();
    }
    if (html.indexOf('系统安全验证') > -1) {

        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL
        };

        function getVCode2(img, headers, type) {
            const MAP_NUM = {
                a: 4,
                b: 6,
                d: 0,
                e: 9,
                g: 9,
                i: 1,
                l: 1,
                m: 3,
                s: 5,
                t: 7,
                o: 0,
                q: 9,
                u: 4,
                z: 2
            };
            const MAP_ALPHA = {
                4: 'a',
                6: 'b',
                9: 'q',
                1: 'l',
                3: 'm',
                5: 's',
                7: 't',
                0: 'o',
                2: 'z'
            };

            function ocr(hex) {
                let ret = request('http://ocr.nokia.press/dz/api/ocr', {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: 'hex=' + hex,
                    method: 'POST'
                });
                return ret
            }
            let hex = request(img, {
                headers: JSON.parse(headers),
                toHex: true
            });
            let ret = JSON.parse(ocr(hex));
            let result = ret.ret.split('');
            for (i = 0; i < result.length; i++) {
                if (type == 'num' && MAP_NUM[result[i]]) result[i] = MAP_NUM[result[i]];
                else if (type == 'alpha' && MAP_ALPHA[result[i]]) result[i] = MAP_ALPHA[result[i]];
            }
            ret.text = result.join('');
            return JSON.stringify(ret);
        }

        let vcode = getVCode2(MY_HOME + '/index.php/verify/index.html?', JSON.stringify(headers), 'num');
        fetch(MY_HOME + html.match(/\/index.php.*?verify=/)[0] + JSON.parse(vcode).ret, {
            headers: headers,
            method: 'POST'
        })
        var yz = !/search/.test(MY_URL) ? true_url : MY_URL
        html = fetch(yz, {
            headers: headers
        });
    }

    // log(html)

    try {
        var list = pdfa(html, 列表);
    } catch (e) {
        var list = ''
    }
    //log(list.length);
    //log(list)
    if (list != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }
        list.forEach(it => {
            //log(pic_url)
            d.push({
                title: pdfh(it, 标题),
                desc: pdfh(it, 描述),
                // pic_url: pd(it, 图片)+ '@Referer=',
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 链接) + "#immersiveTheme#"
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '',
                content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}


function 一级动态分类() {
    var d = d || []
    addListener('onClose', $.toString(() => {
        initConfig({}); //清空配置,避免炸视界
    }));
    initConfig({
        html: ''
    }); //清空二级记录
    //log(config.html)
    //log(url)

    // log(config.html)
    var 分类颜色 = '#8B008B';
    MY_URL = MY_URL.replace('hiker://empty##', '') || MY_URL
    // log(config.html)
    var 分类颜色 = '#800080';
    var page = MY_PAGE;
    var true_url = getMyVar('header.url', MY_URL);

    var 链接处理工具 = require('http://hiker.nokia.press/hikerule/rulelist.json?id=2849');
    //var 链接处理工具 = require('hiker://files/rules/模板/动态分类/UrlProcessor.js');
    true_url = 链接处理工具
        .链接(true_url)
        .页码(page)
        .获取处理结果();
    var html = request(true_url)

    if (html.indexOf('系统安全验证') > -1) {

        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL
        };

        function getVCode2(img, headers, type) {
            const MAP_NUM = {
                a: 4,
                b: 6,
                d: 0,
                e: 9,
                g: 9,
                i: 1,
                l: 1,
                m: 3,
                s: 5,
                t: 7,
                o: 0,
                q: 9,
                u: 4,
                z: 2
            };
            const MAP_ALPHA = {
                4: 'a',
                6: 'b',
                9: 'q',
                1: 'l',
                3: 'm',
                5: 's',
                7: 't',
                0: 'o',
                2: 'z'
            };

            function ocr(hex) {
                let ret = request('http://ocr.nokia.press/dz/api/ocr', {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: 'hex=' + hex,
                    method: 'POST'
                });
                return ret
            }
            let hex = request(img, {
                headers: JSON.parse(headers),
                toHex: true
            });
            let ret = JSON.parse(ocr(hex));
            let result = ret.ret.split('');
            for (i = 0; i < result.length; i++) {
                if (type == 'num' && MAP_NUM[result[i]]) result[i] = MAP_NUM[result[i]];
                else if (type == 'alpha' && MAP_ALPHA[result[i]]) result[i] = MAP_ALPHA[result[i]];
            }
            ret.text = result.join('');
            return JSON.stringify(ret);
        }

        let vcode = getVCode2(MY_HOME + '/index.php/verify/index.html?', JSON.stringify(headers), 'num');
        fetch(MY_HOME + html.match(/\/index.php.*?verify=/)[0] + JSON.parse(vcode).ret, {
            headers: headers,
            method: 'POST'
        })
        var yz = !/search/.test(MY_URL) ? true_url : MY_URL
        html = fetch(yz, {
            headers: headers
        });
    }

    var 定位列表 = ([{
        一级分类: 大类定位,
        子分类: 小类定位,
        分类链接: {
            二次处理(url) {
                return url.replace("/vodtype/", "/vodshow/").replace("/type/", "/show/")
            }
        }
    }, {
        一级分类: 拼接分类,
        子分类: 'ul&&li:has(a[href]):not(:matches(^$))',
    }])
    // '0' 为默认不折叠，'1' 为默认折叠
    const 当前折叠状态 = getMyVar('header.fold', '1')

    // 引入动态分类依赖
    // 框架已经稳定，使用 requireCache 更佳
    var htmlCategories = require('http://hiker.nokia.press/hikerule/rulelist.json?id=2705');
    //var htmlCategories = require('hiker://files/rules/模板/动态分类/categories-header.js');

    htmlCategories.界面(d)
        .分类链接(true_url)
        .源码(html)
        .页码(page)
        .添加分类定位(定位列表)

        //开启折叠
        .开启内置折叠功能() // 必须
        .折叠按钮样式({
            title: 当前折叠状态 == '1' ? '““””<b><span style="color: #19B89D">: )</span></b>' : '““””<b><span style="color: #910113">: )</span></b>'
        }) // 可选
        .折叠(当前折叠状态) // 必须
        .选中的分类颜色(分类颜色)
        //结束

        .开始打造分类();
    //过宝塔检测
    if (html.indexOf('检测中') != -1) {
        let cook = JSON.parse(fetchCookie(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA
            }
        })).join(';');
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cook
            }
        });
    };


    try {
        var list = pdfa(html, 列表);
    } catch (e) {
        var list = ''
    }
    //log(list.length);
    //log(list)
    if (list != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }
        list.forEach(it => {
            //log(pic_url)
            d.push({
                title: pdfh(it, 标题),
                desc: pdfh(it, 描述),
                // pic_url: pd(it, 图片)+ '@Referer=',
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 链接) + "#immersiveTheme#"
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '',
                content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}

function 一级A() {
    var d = [];
    addListener('onClose', $.toString(() => {
        initConfig({}); //清空配置,避免炸视界
    }));
    initConfig({
        html: ''
    }); //清空二级记录
    //log(config.html)
    //log(url)
    //  var html = getResCode()

    if (/empty##/.test(MY_URL)) {
        var url = MY_URL.replace('hiker://empty##', '');
        var html = request(url);
    } else {
        var url = MY_URL;
        var html = getResCode();
    }
    //更新时间2022.6.7

    function getVCode(img, headers, type) {
        let html = "";
        if (/btbdys|52bdys|mp4er|bde4/.test(img)) {
            let api = 'https://ocr.hiker.eu.org/bde/hex/text';
            let api1 = 'https://py.hiker.eu.org/bdeocr';
            let hex = request(img, {
                headers: JSON.parse(headers),
                toHex: true
            });

            html = request(api, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: 'hex=' + hex,
                method: 'POST'
            });

        } else {
            let api = base64Decode("aHR0cHM6Ly9jb2RlLmNudmVyY2VsLmNmL3hvY3J4P3VybD0=");
            let url = api + img + "&type=" + type + "&headers=" + headers;
            html = fetch(url, {
                timeout: 12000
            });
        }
        return html;
    }

    function getVCode2(img, headers, type, sleepSec) {
        let begin = new Date().getSeconds();
        sleepSec = (sleepSec == undefined) ? 0 : sleepSec;
        const MAP_NUM = {
            a: 4,
            b: 8,
            d: 0,
            e: 9,
            g: 9,
            i: 1,
            l: 1,
            m: 3,
            s: 5,
            t: 7,
            o: 0,
            q: 9,
            u: 4,
            z: 2
        };
        const MAP_ALPHA = {
            4: 'a',
            6: 'b',
            8: 'b',
            9: 'q',
            1: 'l',
            3: 'm',
            5: 's',
            7: 't',
            0: 'o',
            2: 'z'
        };

        function ocr(hex) {
            api0 = 'http://ocr.nokia.press/dz/api/ocr';
            api1 = 'http://www.zruiry.com:9898/ocr/hex/json';
            api2 = 'https://ocr.hiker.eu.org/ocr/hex/json';
            api = api1;
            //let now=new Date().getHours();
            //if(now>7 && now<24) api=api1;
            //else api=api0;
            let ret = request(api, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: 'hex=' + hex,
                method: 'POST'
            });
            return ret
        }

        let hex = request(img, {
            headers: JSON.parse(headers),
            toHex: true
        });
        let ret = JSON.parse(ocr(hex));
        let result = ret.ret.split('');
        for (i = 0; i < result.length; i++) {
            if (type == 'num' && MAP_NUM[result[i]] != undefined) result[i] = MAP_NUM[result[i]];
            else if (type == 'alpha' && MAP_ALPHA[result[i]] != undefined) result[i] = MAP_ALPHA[result[i]];
        }
        ret.text = result.join('');
        if (sleepSec) {
            //sleep       
            let end = new Date().getSeconds();
            let s = sleepSec - (end - begin);
            if (s > 0) sleep(s);
        }

        return JSON.stringify(ret);

    }

    function getRandIP() {
        if (getVar('zhenbuka$ip'))
            return getVar('zhenbuka$ip');
        var ip = []
        for (var i = 0; i < 4; i++) {
            ip = ip + Math.floor(Math.random() * 256) + "."
        }
        ip = ip.substr(0, ip.length - 1)
        putVar('zhenbuka$ip', ip)
        return ip
    }

    function bypassZBK(img, headers) {
        let api = 'https://py.hiker.eu.org/scode';
        let api1 = 'https://ocr.hiker.eu.org/zbk/compare/hex/text';
        //let url = api + img + "&headers=" + headers;
        let hex = request(img, {
            headers: JSON.parse(headers),
            toHex: true
        });
        let html = fetch(api, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: 'hex=' + hex,
            method: 'POST'
        });
        return html;
    }


    function sleep(n) {
        //n为整数，单位秒
        /*t1=(new Date()).getTime();
        while((new Date()).getTime()-t1<n);*/
        //n=n>=1000?Math.ceil(n/1000):n;
        fetch('https://py.hiker.eu.org/api/sleep?' + n, {
            timeout: n * 1000
        })

    }
    let headers = {
        "User-Agent": MOBILE_UA,
        "referer": MY_HOME,
    };
    let url = MY_URL.replace("hiker://empty##", '');
    let searchPage = fetch(url, {
        method: "POST",
        headers: headers
    });

    if (searchPage.indexOf("验证页面") != -1) {

        let vcode = bypassZBK(MY_HOME + '/extend/tncode/tncode.php', JSON.stringify(headers));
        fetch(MY_HOME + '/index.php/vodsearch/-------------/?tn_r=' + vcode, {
            method: "GET",
            headers: headers
        });

        searchPage = fetch(url, {
            method: "POST",
            headers: headers
        });
    }
    //log(html)
    try {
        var list = pdfa(searchPage, 列表);
    } catch (e) {
        var list = ''
    }
    //log(list.length);
    //log(list)
    if (list != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }
        list.forEach(it => {
            //log(pic_url)
            d.push({
                title: pdfh(it, 标题),
                desc: pdfh(it, 描述),
                // pic_url: pd(it, 图片)+ '@Referer=',
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 链接) + "#immersiveTheme#"
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '',
                content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}




function 动态分类() {
    var d = [];
    addListener('onClose', $.toString(() => {
        initConfig({}); //清空配置,避免炸视界
    }));
    initConfig({
        html: ''
    }); //清空二级记录
    //log(config.html)
    //log(url)

    const 分类颜色 = '#8B008B'
    const 分类标题 = 'a&&Text'
    const 分类链接 = 'a&&href'

    MY_URL = MY_URL.replace('hiker://empty##', '')

    let true_url = getVar(MY_RULE.url, MY_URL)
    const page = MY_PAGE
    if (getVar(MY_RULE.url)) {
        true_url = true_url.replace(/type(\/\d+)\.html/, 'show$1-----------.html').replace(/type/, 'show').replace('---.html', page + '---.html').replace(/(---\d+.html)/, page + '$1')
    }
    var html = request(true_url)
    if (html.indexOf('系统安全验证') > -1) {

        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL
        };

        function getVCode2(img, headers, type) {
            const MAP_NUM = {
                a: 4,
                b: 6,
                d: 0,
                e: 9,
                g: 9,
                i: 1,
                l: 1,
                m: 3,
                s: 5,
                t: 7,
                o: 0,
                q: 9,
                u: 4,
                z: 2
            };
            const MAP_ALPHA = {
                4: 'a',
                6: 'b',
                9: 'q',
                1: 'l',
                3: 'm',
                5: 's',
                7: 't',
                0: 'o',
                2: 'z'
            };

            function ocr(hex) {
                let ret = request('http://ocr.nokia.press/dz/api/ocr', {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: 'hex=' + hex,
                    method: 'POST'
                });
                return ret
            }
            let hex = request(img, {
                headers: JSON.parse(headers),
                toHex: true
            });
            let ret = JSON.parse(ocr(hex));
            let result = ret.ret.split('');
            for (i = 0; i < result.length; i++) {
                if (type == 'num' && MAP_NUM[result[i]]) result[i] = MAP_NUM[result[i]];
                else if (type == 'alpha' && MAP_ALPHA[result[i]]) result[i] = MAP_ALPHA[result[i]];
            }
            ret.text = result.join('');
            return JSON.stringify(ret);
        }

        let vcode = getVCode2(MY_HOME + '/index.php/verify/index.html?', JSON.stringify(headers), 'num');
        fetch(MY_HOME + html.match(/\/index.php.*?verify=/)[0] + JSON.parse(vcode).ret, {
            headers: headers,
            method: 'POST'
        })
        var yz = !/search/.test(MY_URL) ? true_url : MY_URL
        html = fetch(yz, {
            headers: headers
        });
    }

    const empty = "hiker://empty"

    try {
        var categories = pdfa(html, 大类定位).concat(pdfa(html, 拼接分类))
    } catch (e) {
        var categories = pdfa(html, 大类定位)
    }

    let init_cate = []

    for (let i = 0; i < 20; i++) {
        init_cate.push("0")
    }

    const fold = getVar(MY_RULE.group, "0")
    const cate_temp_json = getVar(MY_RULE.title, JSON.stringify(init_cate))
    const cate_temp = JSON.parse(cate_temp_json)

    if (parseInt(page) === 1) {
        d.push({
            title: fold === '1' ? '““””<b><span style="color: #19B89D">: )</span></b>' : '““””<b><span style="color: #910113">: )</span></b>',
            url: $().lazyRule((fold) => {
                putVar(MY_RULE.group, fold === '1' ? '0' : '1');
                refreshPage(false);
                return "hiker://empty"
            }, fold),
            col_type: 'scroll_button',
        })


        categories.forEach((category, index) => {
            let sub_categories = pdfa(category, 小类定位);
            if (index === 0) {
                sub_categories.forEach((item, key) => {
                    let title = pdfh(item, 分类标题).replace(/共.*条/, '');
                    d.push({
                        title: key.toString() === cate_temp[index] ? '““””<b><span style="color: ' + 分类颜色 + '">' + title + '</span></b>' : '‘‘’’<font color="#444444">' + title,
                        url: $(pd(item, 分类链接) + '#noLoading#').lazyRule((params) => {
                            let new_cate = []
                            params.cate_temp.forEach((cate, index) => {
                                new_cate.push(index === 0 ? params.key.toString() : "0")
                            })
                            putVar(MY_RULE.title, JSON.stringify(new_cate))
                            putVar(MY_RULE.url, input)
                            refreshPage(true)
                            return "hiker://empty"
                        }, {
                            cate_temp: cate_temp,
                            key: key,
                            page: page,
                        }),
                        col_type: 'scroll_button',
                    })
                })
                d.push({
                    col_type: "blank_block"
                });
            } else if (fold === '1') {
                sub_categories.forEach((item, key) => {
                    let title = pdfh(item, 分类标题).replace(/共.*条/, '');
                    d.push({
                        title: key.toString() === cate_temp[index] ? '““””<b><span style="color: ' + 分类颜色 + '">' + title + '</span></b>' : '‘‘’’<font color="#444444">' + title,
                        url: $(pd(item, 分类链接) + '#noLoading#').lazyRule((params) => {
                            params.cate_temp[params.index] = params.key.toString()

                            putVar(MY_RULE.title, JSON.stringify(params.cate_temp))
                            putVar(MY_RULE.url, input)
                            refreshPage(true)
                            return "hiker://empty"
                        }, {
                            cate_temp: cate_temp,
                            index: index,
                            key: key,
                            page: page,
                        }),
                        col_type: 'scroll_button',
                    })
                })
                d.push({
                    col_type: "blank_block"
                });
            }
        })
    }
    //过宝塔检测
    if (html.indexOf('检测中') != -1) {
        let cook = JSON.parse(fetchCookie(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA
            }
        })).join(';');
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cook
            }
        });
    };

    try {
        var list = pdfa(html, 列表);
    } catch (e) {
        var list = ''
    }
    //log(list.length);
    //log(list)
    //看看list是什么
    if (list != '') {
        try {
            var 图片ua = pic
        } catch (e) {
            var 图片ua = 0
        }
        list.forEach(it => {
            //log(pic_url)
            d.push({
                title: pdfh(it, 标题),
                desc: pdfh(it, 描述),
                // pic_url: pd(it, 图片)+ '@Referer=',
                img: 图片ua == 1 ? pd(it, 图片) : (pd(it, 图片) + '@Referer='),
                url: 'hiker://empty##' + pd(it, 链接) + "#immersiveTheme#"
            });
        })
    }

    function 一级传参(d) {
        d = d.map((it) => {
            it.extra = {
                title: it.title || '',
                img: it.img || '',
                desc: it.desc || '',
                content: it.content || '',
            };
            return it
        });
    }
    一级传参(d);
    setResult(d)
}