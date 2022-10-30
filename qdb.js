let version = 202210070000;
let defaultConfigs = {
    starColor: "#ffac2d",
    chooseColor: "#FA7298",
    quickSearchConfigs: {
        mode: "scroll_button",
        order: ["海阔搜索"],
        "海阔搜索": {
            name: "",
            pic: ""
        }
    },
    detailsViewConfigs: {
        use: "默认",
        "默认": {
            config: "eval(fetch(getVar('qdb_file')));detailsView(type, id);"
        }
    },
    analysisConfigs: {
        use: "不解析",
        "不解析": {
            config: $.toString(() => {
                return input;
            }),
            setting: $.toString(() => {
                return "toast://该插件无设置页面";
            })
        },
        "断插": {
            config: $.toString(() => {
                let file = "hiker://files/rules/DuanNian/MyParse.json";
                let oldfile = "hiker://files/cache/MyParseSet.json";
                if (fileExist(file)) {
                    eval('json=' + fetch(file));
                    let jsUrl = json.settings.cj;
                    eval(fetch(jsUrl));
                    return aytmParse(input);
                } else if (fileExist(oldfile)) {
                    let jsUrl = JSON.parse(fetch(oldfile)).cj;
                    eval(fetch(jsUrl));
                    return aytmParse(input);
                } else {
                    return 'toast://没找到断插配置文件';
                }
            }),
            setting: $.toString(() => {
                let file = "hiker://files/rules/DuanNian/MyParse.json";
                let oldfile = "hiker://files/cache/MyParseSet.json";
                if (fileExist(file)) {
                    eval('json=' + fetch(file));
                    let jsUrl = json.settings.cj;
                    eval(fetch(jsUrl));
                    return setUrl;
                } else if (fileExist(oldfile)) {
                    let jsUrl = JSON.parse(fetch(oldfile)).cj;
                    eval(fetch(jsUrl));
                    return setUrl;
                } else {
                    return "hiker://page/Route?rule=MyFieldᴰⁿ&type=设置";
                }
            })
        }
    }
}
let parseVideoUrlLazy = $.toString(() => {
    eval(request(getVar('qdb_file')));
    /**
     * 这下面就是拿解析配置出来 eval 执行，最终获得插件解析后的视频 url
     */
    let analysisConfigs = getConfig('analysisConfigs');
    let analysisConfig = analysisConfigs[analysisConfigs.use].config;
    let result = "toast://解析失败";
    try {
        if (analysisConfig.startsWith("(")) {
            eval('result = ' + analysisConfig);
        } else {
            /**
             * 还原成 $.toString(...) 的最终结果，达到最终处理方式跟上面的 if 一致的目的
             */
            eval('result = ' + '(() => {' + analysisConfig + '})()');
        }
    } catch (e) {}
    return result;
})

let QLog = {
    key: 'qdb_debug',
    print: (key, value) => {
        if (!getVar(QLog.key)) return;
        if (typeof value === 'object') {
            value = $.stringify(value);
        }
        log(key + ': ' + value);
    }
}

//预处理
function pre() {
    let file = "hiker://files/rules/joker/qdb_config.js";
    if (!fetch(file)) {
        writeFile(file, JSON.stringify(defaultConfigs));
    }
    putVar({
        key: "qdb_config",
        value: file
    });
}

//首页
function home() {
    if (getItem("start", "") == "") {
        setItem("start", "1");
        setItem('update', String(version));
        confirm({
            title: '温馨提示',
            content: '此规则仅限学习交流使用\n请于导入后24小时内删除!\n\n任何组织或个人不得以任何方式方法\n传播此规则的整体或部分!!\n\n感谢大佬们提供的技术支持!!!',
            confirm: '',
            cancel: ''
        })
    } else {
        let updateInfo = getItem('update', '');
        if (updateInfo == '' || parseInt(updateInfo) < version) {
            setItem('update', String(version));
            confirm({
                title: '本次更新内容',
                content: '1.榜单页面标题修改',
                confirm: '',
                cancel: ''
            })
        }
    }
    addListener("onClose", $.toString(() => {
        clearVar("qdb_file");
        clearVar("qdb_config");
    }))
    let d = [];
    d.push({
        title: '',
        img: 'https://gitcode.net/qq_41846756/hiker/-/raw/master/img/豆瓣.png',
        desc: '0',
        col_type: 'card_pic_1',
        url: $('hiker://empty#noHistory#').rule(() => {
            try {
                setPageTitle('设置');
                eval(fetch(getVar('qdb_file')));
                addListener("onClose", $.toString(() => {
                    clearVar('qdb_debug');
                    clearVar('gitversion');
                }))
                settingPage();
            } catch (e) {
                let rule = JSON.parse(request("hiker://page/urgencyMode")).rule;
                eval(rule);
            }
        })
    })

    let s = ["推荐", "热门", "分类", "片单", "榜单", "将上映"];
    let img = "https://gitcode.net/qq_41846756/hiker/-/raw/master/img/";
    for (let i in s) {
        d.push({
            title: s[i],
            img: img + s[i] + '.jpg',
            col_type: 'icon_2',
            url: MY_URL + '$page{fypage}/#/' + s[i] + "#noHistory#"
        })
    }
    setResult(d);
}

//海阔搜索
function search() {
    let wd = MY_URL.split("/#/")[1];
    let page = getPage();
    let s = getDoubanRes('https://frodo.douban.com/api/v2/search/subjects?type=movie&q=' + wd + (page ? '&start=' + (page - 1) * 20 : '&start=0') + '&count=20');

    let list = s.items;
    let detailsViewConfigs = getConfig('detailsViewConfigs');

    let items = [];
    list.forEach(data => {
        if (data.target_type == 'doulist_cards') {
            data.target.doulists.forEach(e => {
                items.push({
                    title: e.title,
                    url: $('hiker://empty/$page{fypage}#noHistory#')
                        .rule((type, id) => {
                            eval(fetch(getVar("qdb_file")));
                            if (type === "playlist") {
                                douList(id, getPage(), 50);
                            } else if (type == "collection" || type == "chart") {
                                subjectCollectionList(getPage(), 50, id);
                            }
                        }, e.target_type, e.id),
                    img: e.cover_url + "@Referer=" + e.cover_url
                })
            })
        } else if (data.target_type == 'chart') {
            let e = data.target;
            items.push({
                title: e.title,
                url: $('hiker://empty/$page{fypage}#noHistory#')
                    .rule((type, id) => {
                        eval(fetch(getVar("qdb_file")));
                        if (type === "playlist") {
                            douList(id, getPage(), 50);
                        } else if (type == "collection" || type == "chart") {
                            subjectCollectionList(getPage(), 50, id);
                        }
                    }, data.target_type, e.id),
                img: e.cover_url + "@Referer=" + e.cover_url
            })
        } else {
            let type = data.target_type,
                id = data.target.id,
                title = data.target.title;
            let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
            let urlParams = {};
            if (useConfig.startsWith('{')) {
                eval('urlParams = ' + useConfig);
            } else {
                urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id)
                    .rule((type, id, title, useConfig) => {
                        eval(fetch(getVar("qdb_file")));
                        if (type === "playlist") {
                            douList(id, getPage(), 50);
                        } else {
                            eval(useConfig);
                        }
                    }, type, id, title, useConfig);
            }
            items.push({
                title: title,
                img: data.target.cover_url + "@Referer=" + data.target.cover_url,
                desc: data.type_name,
                content: data.target.card_subtitle,
                url: urlParams.url,
                extra: urlParams.extra
            });
        }

    });

    setSearchResult({
        data: items
    });
}

//二级页面
function erji() {
    addListener("onClose", $.toString(() => {
        clearVar("findList");
        clearVar("hotList");
        clearVar("classlist");
        clearVar("playlist");
        clearVar("rankList");
        clearVar("ranking");
        clearVar("coming");
        clearVar("analysis");
    }))

    let choice = MY_URL.split('/#/')[1].split('#')[0];
    switch (choice) {
        case "推荐":
            eval(fetch(getVar("qdb_file")));
            findList(getPage(), 10);
            break;
        case "热门":
            eval(fetch(getVar("qdb_file")));
            hotList(getPage(), 10);
            break;
        case "分类":
            eval(fetch(getVar("qdb_file")));
            classList(getPage(), 15);
            break;
        case "片单":
            eval(fetch(getVar("qdb_file")));
            playList(getPage(), 10);
            break;
        case "榜单":
            eval(fetch(getVar("qdb_file")));
            rankList(getPage(), 10);
            break;
        case "将上映":
            eval(fetch(getVar("qdb_file")));
            comingList(getPage(), 10);
            break;
        default:
            eval(fetch(getVar("qdb_file")));
            subjectCollectionList();
            break;
    }
}

//获取豆瓣资源,返回json数据
function getDoubanRes(url) {
    if (url.indexOf('apikey') === -1) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + "apikey=0dad551ec0f84ed02907ff5c42e8ec70"
    }
    let s = fetch(url, {
        headers: {
            "User-Agent": "Rexxar-Core/0.1.3 api-client/1 com.douban.frodo/7.9.0.beta2(215) Android/25 product/TAS-AL00 vendor/HUAWEI model/TAS-AL00  rom/android  network/wifi  platform/mobile com.douban.frodo/7.9.0.beta2(215) Rexxar/1.2.151  platform/mobile 1.2.151"
        },
        method: 'POST',
        body: 'host=frodo.douban.com'
    });
    return JSON.parse(s);
}

//获取当前页码,用于翻页
function getPage() {
    var t = new RegExp("\\$page\\{(.*?)\\}");
    return MY_URL.match(t)[1]
}

//初始化配置,name为配置项名称
function initConfigs(name, config) {
    if (!config) {
        config = JSON.parse(fetch(getVar('qdb_config')));
    }
    if (config[name] == null) {
        config[name] = defaultConfigs[name] ? defaultConfigs[name] : {};
        writeFile(getVar('qdb_config'), JSON.stringify(config));
    }
    return config;
}

//获取配置项
function getConfig(name, rootConfig) {
    let config = rootConfig ? rootConfig : JSON.parse(fetch(getVar('qdb_config')));
    if (name) {
        if (config[name] == null) {
            config = initConfigs(name, config);
        }
        return config[name];
    } else {
        return config;
    }
}

//根据评分信息获取评分星星样式
function computeRating(e, t) {
    let i = "";
    for (let r = 0; r < 5; r++) r < Math.round(t / (e / 5)) ? i += "★" : i += "☆";
    return i;
}

//评分详情页面
function rating(type, id, ratingCount) {
    setPageTitle('影片信息');
    //评分统计
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/rating");

    let r = "<h2>评分统计</h2>";

    r += '<small><font color="grey">' + ratingCount + '人评分' + '</font></small><br/>';

    let starColor = getConfig('starColor');
    if (i.stats.length == 0) {
        i.stats = [0, 0, 0, 0, 0];
    }
    i.stats.reverse().forEach(((value, index) => {
        r += '<font color=' + starColor + '>' + ["★★★★★", "★★★★☆", "★★★☆☆", "★★☆☆☆", "★☆☆☆☆"][index] + "</font>&nbsp;";

        r += function(e) {
            let t1 = '';
            for (let i = 0; i < e; i++) t1 += "▇";
            let t2 = '';
            for (let i = 0; i < 10 - e; i++) t2 += "▇";
            return t1.fontcolor('#ffac2d') + t2.fontcolor('#e5e1e4');
        }((10 * value).toFixed(0));

        r += '&nbsp;<small><font color="grey">' + (100 * value)
            .toFixed(1) + "%</font></small><br/>";
    }));

    r += [i.done_count ? i.done_count + "人看过" : "", i.doing_count ? i.doing_count + "人在看" : "", i.wish_count ? i.wish_count + "人想看" : ""].join("&nbsp;&nbsp;")
        .small()
        .fontcolor('grey');
    //影片信息
    i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/desc");
    let l = i.html.replace(/[\n\t\r]/g, "")
        .replace(/<td\s*[^>]*>(.*?)<\/td>/g, "<span>$1</span>")
        .replace(/<tr\s*[^>]*>(.*?)<\/tr>/g, "<teng>$1</teng><br/>");
    parseDomForArray(l, "section&&teng").forEach((e => {
        let t = parseDomForArray(e, "span");
        l = l.replace(t[0], '<font color="grey">' + t[0].replace(/<span\s*[^>]*>(.*?)<\/span>/g, "$1") + "：</font>")
    }));
    r += l;
    //获奖记录
    let page = getPage();
    let s = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/awards?start=" + 20 * (page - 1) + "&count=20");
    r += "<h2>获奖记录" + '<small><font color="grey">' + (s.total != 0 ? '(共' + s.total + '项)' : '(暂无)') + '</font></small>' + "</h2>";
    //r += '<font color="grey">' + (s.total != 0 ? '共' + s.total + '项' : '暂无') + '</font><br/>';
    let r2 = '';
    s.awards.forEach(e => {
        r2 += (e.ceremony.title + '(' + e.ceremony.year + ')').big().bold() + '<small>(<a href="hiker://empty#noHistory#@rule=js:eval(fetch(getVar(`qdb_file`)));awardView(`' + e.ceremony.id + '`,`' + e.ceremony.title + '`);">查看详情</a>)</small>' + '<br/>';
        e.categories.forEach(item => {
            r2 += (item.category.title + (item.is_won ? '' : '(提名)') + '&nbsp;').fontcolor("grey");
            r2 += item.celebrities.map(celebrity => celebrity.name).join('&nbsp;/&nbsp;');
            r2 += '<br/>';
        })
        r2 += '<br/>';
    })

    if (page == 1) {
        setHomeResult({
            data: [{
                title: r + r2,
                col_type: "rich_text"
            }]
        })
    } else if(s.awards.length == 0){
        setResult([]);
    } else{
        setHomeResult({
            data: [{
                title: r2,
                col_type: "rich_text"
            }]
        })
    }
}

//奖项详情页面
function awardView(id, name) {
    setPageTitle(name);
    let s = getDoubanRes("https://frodo.douban.com/api/v2/ceremony/" + id);
    let a = [];
    a.push({
        title: '““””' + (s.title + '(' + s.year + ')').big().bold(),
        col_type: 'text_1',
        extra: {
            lineVisible: false
        }
    })
    s.playlists.forEach(e => {
        a.push({
            title: e.title,
            desc: '共' + e.items_count + '部',
            img: e.cover_url + '@Referer=' + e.cover_url,
            url: $('hiker://empty#noHistory#').rule((id) => {
                eval(fetch(getVar('qdb_file')));
                douList(id);
            }, e.id)
        })
    })

    let r = '';
    s.prizes.forEach(e => {
        r += '<h4>获奖名单(' + e.title + ')</h4>';
        e.categories.forEach(t => {
            r += (t.title + '&nbsp;&nbsp;&nbsp;&nbsp;').fontcolor("grey").bold();
            r += t.results.map(item => !!item.info ? item.info + ('&nbsp;-&nbsp;' + item.title + '&nbsp;&nbsp;').fontcolor("grey") : item.title).join('&nbsp;/&nbsp;').bold();
            r += '<br/>';
        })
    })
    a.push({
        title: r,
        col_type: 'rich_text'
    })

    let i = [];
    s.ceremonies.forEach(e => {
        i.push({
            title: e.title,
            desc: e.year + '年',
            col_type: 'movie_3',
            img: e.pic.normal + '@Referer=' + e.pic.normal,
            url: $('hiker://empty#noHistory#').rule((id, name) => {
                eval(fetch(getVar('qdb_file')));
                awardView(id, name);
            }, e.id, e.title)
        })
    })
    if (i.length > 0) {
        i.unshift({
            title: '““””' + '历届回顾'.big().bold(),
            col_type: 'text_1',
            extra: {
                lineVisible: false
            }
        })
    }

    setResult(a.concat(i));
}

//剧照页面
function stillsList(type, id) {
    addListener('onClose', 'clearVar("photo")');
    let page = getPage();
    let items = {
        剧照: 'photos',
        海报: 'covers'
    };
    let a = [];
    let temp = getVar('photo', 'photos');
    let color = getConfig('chooseColor');
    for (let i in items) {
        a.push({
            title: temp == items[i] ? '““””' + i.fontcolor(color) : i,
            col_type: 'scroll_button',
            url: $('hiker://empty').lazyRule((t) => {
                putVar('photo', t);
                refreshPage();
                return 'hiker://empty';
            }, items[i])
        })
    }

    let r = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/" + temp + "?start=" + 30 * (page - 1) + "&count=30");
    let l = r.photos.map((e => ({
        title: e.create_time,
        img: e.image.small.url + "@Referer=" + e.image.small.url,
        url: e.image.large.url + "?type=.jpg@Referer=" + e.image.large.url + "?type=.jpg",
        col_type: "pic_2"
    })));

    if (page == 1) {
        l.unshift({
            col_type: "blank_block"
        });
        if (temp == 'photos') {
            l.unshift({
                title: "<big>共<strong> " + r.total + ' </strong>张剧照</big><br/><small><font color="grey">官方剧照：' + r.o + "张&nbsp;截图：" + r.c + "张&nbsp;工作照：" + r.w + "张&nbsp;新闻图片：" + r.n + "张&nbsp;粉丝图片：" + r.f + "张</font></small>",
                col_type: "rich_text"
            })
        } else {
            l.unshift({
                title: "<big>共<strong> " + r.total + "</strong>张海报</big>",
                col_type: "rich_text"
            })
        }
        l = a.concat(l);
    }
    setHomeResult({
        data: l
    })
}

//演职人员页面
function credits(type, id) {
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/credits");
    let r = [];
    i.credits.forEach((e => {
        r.push({
            title: e.title,
            col_type: "rich_text"
        });
        e.celebrities.forEach((e => {
            r.push({
                title: e.name + "\n" + e.latin_name,
                desc: e.character,
                img: e.avatar.normal + "@Referer=" + e.avatar.narmal,
                col_type: 'movie_1_vertical_pic',
                url: $('hiker://empty#noHistory##immersiveTheme#').rule((e) => {
                    eval(fetch(getVar("qdb_file")));
                    elessarView(e.uri.split("subject_id=")[1], e.id, e.name);
                }, e)
            })
        }))
    }));
    setHomeResult({
        data: r
    })
}

//短评页面
function shortCommentList(type, id) {
    addListener('onClose', "clearVar('shortcomment')");
    let items = {
        热门: 'hot',
        最新: 'latest'
    }
    let u = getVar('shortcomment', 'hot');
    let a = [];
    let chooseColor = getConfig('chooseColor') // || "#FA7298";
    for (i in items) {
        a.push({
            title: u === items[i] ? '““””<b> <font color=' + chooseColor + '>' + i + ' </font></b>' : i,
            col_type: 'scroll_button',
            url: $('hiker: //empty').lazyRule((t) => {
                putVar("shortcomment", t);
                refreshPage();
                return 'hiker://empty'
            }, items[i])
        })
    }

    let page = getPage();
    let r = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/interests?start=" + 30 * (page - 1) + "&count=30&order_by=" + u);
    let l = [];
    let starColor = getConfig('starColor');
    r.interests.forEach((e => {
        let t = "";
        if (e.rating) {
            t = computeRating(e.rating.max, e.rating.value);
        }
        l.push({
            title: e.user.name,
            img: e.user.avatar,
            url: e.user.url,
            col_type: "avatar"
        });
        l.push({
            title: e.comment + (t ? '<br/><small>看过 <font color=' + starColor + '>' + t + "</font></small>" : "") + '<br/><small><font color="grey">' + e.vote_count + "赞•" + /\d{4}-\d{1,2}-\d{1,2}/g.exec(e.create_time) + "</font></small>",
            col_type: "rich_text"
        });
        l.push({
            col_type: "line"
        })
    }));

    if (page == 1) {
        l.unshift({
            col_type: "blank_block"
        });
        l.unshift({
            title: "<big>共<strong> " + r.total + " </strong>条短评</big>",
            col_type: "rich_text"
        });
        setHomeResult({
            data: a.concat(l)
        })
    } else {
        setHomeResult({
            data: l
        })
    }
}

//剧评页面
function dramaReviewList(type, id) {
    addListener('onClose', "clearVar('dramareview')");
    let items = {
        热门: 'hot',
        最新: 'latest'
    }
    let u = getVar('dramareview', 'hot');
    let a = [];
    let chooseColor = getConfig('chooseColor');
    for (i in items) {
        a.push({
            title: u === items[i] ? '““””<b> <font color=' + chooseColor + '>' + i + ' </font></b>' : i,
            col_type: 'scroll_button',
            url: $('hiker: //empty').lazyRule((t) => {
                putVar("dramareview", t);
                refreshPage();
                return 'hiker://empty'
            }, items[i])
        })
    }

    let page = getPage()
    let r = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/reviews?start=" + 15 * (page - 1) + "&count=15&order_by=" + u);
    let l = [];
    let starColor = getConfig('starColor');
    r.reviews.forEach((e => {
        let t = "";
        if (e.rating) {
            t = computeRating(e.rating.max, e.rating.value);
        }
        let i = e.comments_count ? e.comments_count + "回复" : "",
            r = e.useful_count ? e.useful_count + "有用" : "",
            o = e.reshares_count ? e.reshares_count + "转发" : "";

        r = i && r ? "•" + r : r;
        o = (i || r) && o ? "•" + o : o;
        l.push({
            title: e.user.name,
            img: e.user.avatar,
            url: e.user.url,
            col_type: "avatar"
        })
        l.push({
            title: "<strong>" + e.title + "</strong><br/>" + e.abstract + '   <small>(<a href="hiker://empty#noHistory#@rule=js:eval(fetch(getVar(`qdb_file`)));dramaReviewView(' + e.id + ')">更多</a>)</small>' + (t ? '<br/><small>看过 <font color=' + starColor + '>' + t + "</font></small>" : "") + '<br/><small><font color="grey">' + i + r + o + "</font></small>",
            col_type: "rich_text"
        })
        l.push({
            col_type: "line"
        })
    }));

    if (page == 1) {
        l.unshift({
            col_type: "blank_block"
        });
        l.unshift({
            title: "<big>共<strong> " + r.total + " </strong>条剧评</big>",
            col_type: "rich_text"
        });

        setHomeResult({
            data: a.concat(l)
        })
    } else {
        setHomeResult({
            data: l
        })
    }
}

//预告片页面
function trailers(type, id) {
    setPageTitle('预告-片段-花絮')
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/trailers").trailers;
    i.forEach((e => {
        e.col_type = "movie_2", e.desc = e.subject_title + "•" + e.create_time, e.img = e.cover_url, e.url = e.video_url
    }));

    let r = i.filter((e => "A" === e.type));
    let l = i.filter((e => "B" === e.type));
    let o = i.filter((e => "C" === e.type));

    if (r.length > 0) {
        r.unshift({
            title: "预告",
            col_type: "rich_text"
        })
    }
    if (l.length > 0) {
        l.unshift({
            title: "片段",
            col_type: "rich_text"
        })
    }
    if (o.length > 0) {
        o.unshift({
            title: "花絮",
            col_type: "rich_text"
        })
    }

    setHomeResult({
        data: r.concat(l)
            .concat(o)
    })
}

//视频评论页面
function videoComment(type, id) {
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/videos").videos;
    i.forEach((e => {
        e.col_type = "movie_2", e.desc = e.author.name + "•" + e.create_time, e.img = e.cover_url + "@Referer=" + e.cover_url, e.url = e.video_url
    }))
    if (i.length > 0) {
        i.unshift({
            title: "视频评论",
            col_type: "rich_text"
        })
    }
    setHomeResult({
        data: i
    })
}

//演职人员详情页面
function elessarView(id, pid, name) {
    setPageTitle(name);
    let i = getDoubanRes("https://frodo.douban.com/api/v2/elessar/subject/" + id);
    let a = [];
    a.push({
        title: '““””' + (i.title + '(' + i.latin_title + ')').big().bold(),
        desc: '““””' + i.desc.match(/\<p\>.*\<\/p\>/)[0],
        img: i.cover.normal.url + '@Referer=' + i.cover.normal.url,
        col_type: 'movie_1_vertical_pic_blur',
        url: $('hiker://empty').rule((desc, extra, name) => {
            let info = extra.info.map(e => e.join(':&nbsp;'));
            setResult([{
                title: '<h2>' + name + '</h2>' + info.join('<br/>') + desc.match(/\<p\>.*\<\/p\>/)[0],
                col_type: 'rich_text'
            }])
        }, i.desc, i.extra, i.title)
    })
    
    let index = i.modules.findIndex(cur => cur.type == "award_result_collection");
    if (index > -1) {
        let e = i.modules[index].payload;
        a.push({
            title: '““””' + '获奖记录'.big().bold() + '<small>(共' + e.total + '项)</small>',
            desc: '““””<strong>' + e.awards[0].ceremony.title + '</strong>\n' + e.awards[0].category.title + (e.awards[0].is_won ? '' : '(提名)'),
            col_type: 'text_center_1',
            url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((id, count) => {
                eval(fetch(getVar('qdb_file')));
                elessarAwards(id, count);
            }, e.id, e.total),
            extra: {
                lineVisible: false
            }
        })
    }
    
    index = i.modules.findIndex(cur => cur.type == "work_collections");
    if (index > -1) {
        let e2 = i.modules[index].payload;
        a.push({
            col_type: 'line'
        })
        a.push({
            title: '““””' + '影视作品'.big().bold() + ('(共' + e2.collections[0].total + '部)').small(),
            col_type: 'text_center_1',
            url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((id, type) => {
                eval(fetch(getVar('qdb_file')));
                elessarWorks(id, type);
            }, e2.id, e2.collections[0].title),
            extra: {
                lineVisible: false
            }
        })

        let detailsViewConfigs = getConfig('detailsViewConfigs');
        let works = e2.collections[0].works;
        let length = works.length <= 3 ? works.length : 3;
        for (let i = 0; i < length; i++) {
            let e = works[i];
            let rating = "";
            if (e.subject.extra.rating_group.rating) {
                rating = computeRating(e.subject.extra.rating_group.rating.max, e.subject.extra.rating_group.rating.value) + " " + e.subject.extra.rating_group.rating.value + "分";
            }

            let type = e.subject.subtype,
                id = e.subject.id,
                title = e.subject.title;
            let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
            let urlParams = {};
            if (useConfig.startsWith('{')) {
                eval('urlParams = ' + useConfig);
            } else {
                urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                    eval(fetch(getVar("qdb_file")));
                    if (type === "playlist") {
                        douList(id, getPage(), 50);
                    } else {
                        eval(useConfig);
                    }
                }, type, id, title, useConfig);
            }
            a.push({
                title: title,
                img: e.subject.cover.normal.url + "@Referer=" + e.subject.cover.normal.url,
                desc: rating,
                col_type: 'movie_3',
                url: urlParams.url,
                extra: urlParams.extra
            })
        }
        /*a.push({
            title: '查看更多',
            img: 'https://joker-tx.coding.net/p/hikerimg/d/hiker/git/raw/master/img/more_ver.png?download=false',
            col_type: 'movie_3',
            url: $('hiker://empty/#/$page{fypage}#noHistory#')
                .rule((id, type) => {
                eval(fetch(getVar('qdb_file')));
                elessarWorks(id, type);
            }, e2.id, e2.collections[0].title)
        })*/
    }
    
    index = i.modules.findIndex(cur => cur.type == "photos");
    if (index > -1) {
        let e3 = i.modules[index].payload;
        a.push({
            col_type: 'line'
        })
        a.push({
            title: '““””' + '演员照片'.big().bold() + ('(共' + e3.total + '张)').small(),
            col_type: 'text_center_1',
            url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((pid) => {
                eval(fetch(getVar('qdb_file')));
                elessarPhotos(pid);
            }, pid),
            extra: {
                lineVisible: false
            }
        })

        let plength = e3.photos.length <= 2 ? e3.photos.length : 2;
        for (let i = 0; i < plength; i++) {
            a.push({
                //title: e3.photos[0].description,
                col_type: 'card_pic_2',
                desc: '0',
                img: e3.photos[i].image.normal.url + '@Referer=' + e3.photos[i].image.normal.url,
                url: e3.photos[i].image.normal.url + '@Referer=' + e3.photos[i].image.normal.url
            })
        }

        /*a.push({
            //title: '查看更多',
            img: 'https://joker-tx.coding.net/p/hikerimg/d/hiker/git/raw/master/img/more.png?download=false',
            col_type: 'card_pic_2',
            desc: '0',
            url: $('hiker://empty/#/$page{fypage}#noHistory#')
                .rule((pid) => {
                eval(fetch(getVar('qdb_file')));
                elessarPhotos(pid);
            }, pid)
        })*/
    }

    setResult(a);
}

//演职人员获奖详情页面
function elessarAwards(id, count) {
    let i = getDoubanRes("https://frodo.douban.com/api/v2/elessar/award_result_collection/" + id + "/awards?start=" + 30 * (getPage() - 1) + "&count=30");
    let l = [];
    let detailsViewConfigs = getConfig('detailsViewConfigs');
    i.awards.forEach(t => {
        l.push({
            title: (t.year+"").bold().big(),
            col_type: 'rich_text'
        })

        for (let i = 0; i < t.modules.length; i++) {
            let e = t.modules[i];
            if (!e.ceremony || !e.category) {
                let rating = "";
                if (e.extra.rating_group.rating) {
                    rating = computeRating(e.extra.rating_group.rating.max, e.extra.rating_group.rating.value) + " " + e.extra.rating_group.rating.value + "分";
                }
                let type = e.subtype,
                    id = e.id,
                    title = e.title;
                let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
                let urlParams = {};
                if (useConfig.startsWith('{')) {
                    eval('urlParams = ' + useConfig);
                } else {
                    urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                        eval(fetch(getVar("qdb_file")));
                        if (type === "playlist") {
                            douList(id, getPage(), 50);
                        } else {
                            eval(useConfig);
                        }
                    }, type, id, title, useConfig);
                }
                l.push({
                    title: title,
                    img: e.cover.normal.url + "@Referer=" + e.cover.normal.url,
                    desc: rating + '\n' + e.extra.short_info,
                    url: urlParams.url,
                    extra: urlParams.extra
                })
            } else {
                l.push({
                    title: e.ceremony.title.bold() + '<small>(<a href="hiker://empty#noHistory#@rule=js:eval(fetch(getVar(`qdb_file`)));awardView(`' + e.ceremony.id + '`,`' + e.ceremony.title + '`);">查看详情</a>)</small>' + '<br/>' + (e.category.title + (e.is_won ? '' : '(提名)')).small(),
                    col_type: 'rich_text'
                })
            }
        }
    })

    if (getPage() == 1) {
        l.unshift({
            col_type: "blank_block"
        })
        l.unshift({
            title: "<big>共<strong> " + count + " </strong>项获奖记录</big>",
            col_type: "rich_text"
        })
    }
    setResult(l);
}

//演职人员作品页面
function elessarWorks(id, type) {
    let i = getDoubanRes("https://frodo.douban.com/api/v2/elessar/work_collections/" + id + "/works?start=" + 30 * (getPage() - 1) + "&count=30&collection_title=" + type);

    let l = [];
    let detailsViewConfigs = getConfig('detailsViewConfigs');
    i.works.forEach((e => {
        let rating = "";
        if (e.subject.extra.rating_group.rating) {
            rating = computeRating(e.subject.extra.rating_group.rating.max, e.subject.extra.rating_group.rating.value) + " " + e.subject.extra.rating_group.rating.value + "分";
        }

        let type = e.subject.subtype,
            id = e.subject.id,
            title = e.subject.title;
        let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
        let urlParams = {};
        if (useConfig.startsWith('{')) {
            eval('urlParams = ' + useConfig);
        } else {
            urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    eval(useConfig);
                }
            }, type, id, title, useConfig);
        }
        l.push({
            title: title,
            img: e.subject.cover.normal.url + "@Referer=" + e.subject.cover.normal.url,
            desc: e.roles.join("•") + "\n" + rating,
            col_type: 'movie_1_vertical_pic',
            url: urlParams.url,
            extra: urlParams.extra
        })
    }))

    if (getPage() == 1) {
        l.unshift({
            col_type: "blank_block"
        })
        l.unshift({
            title: "<big>共<strong> " + i.total + " </strong>部作品</big>",
            col_type: "rich_text"
        })
    }
    setHomeResult({
        data: l
    })
}

//演职人员照片页面
function elessarPhotos(pid) {
    let i = getDoubanRes("https://frodo.douban.com/api/v2/celebrity/" + pid + "/photos?start=" + 30 * (getPage() - 1) + "&count=30");
    let l = [];
    i.photos.forEach(e => {
        l.push({
            col_type: 'card_pic_2',
            desc: '0',
            img: e.image.normal.url + '@Referer=' + e.image.normal.url,
            url: e.image.normal.url + '@Referer=' + e.image.normal.url
        })
    })
    if (getPage() == 1) {
        l.unshift({
            col_type: "blank_block"
        })
        l.unshift({
            title: "<big>共<strong> " + i.total + " </strong>张照片</big>",
            col_type: "rich_text"
        })
    }
    setResult(l);
}

//剧评详情页面
function dramaReviewView(id) {
    setPageTitle('剧评详情');
    let i = getDoubanRes("https://frodo.douban.com/api/v2/review/" + id);

    i.photos.forEach((e => {
        i.content = i.content.replace('id="' + e.tag_name + '"', 'src="' + e.image.large.url + "@Referer=" + e.image.large.url + '"')
    }));

    let l = getDoubanRes("https://frodo.douban.com/api/v2/review/" + id + "/comments");
    let o = [{
        col_type: "blank_block"
    }, {
        title: "<big><strong>评论：</strong></big>",
        col_type: "rich_text"
    }];

    l.comments.length > 0 ? l.comments.forEach((e => {
        o.push({
            title: e.author.name,
            img: e.author.avatar,
            url: e.author.url,
            col_type: "avatar"
        })
        o.push({
            title: e.text + (e.replies.length > 0 ? ' <small><a href="hiker://empty#noHistory#@rule=js:eval(fetch(getVar(`qdb_file`)));dramaReviewReplyView(' + e.id + ');">[查看回复]</a></small>' : ""),
            col_type: "rich_text"
        })
        o.push({
            col_type: "line"
        })
    })) : o.push({
        title: '<font color="grey">( •̥́ ˍ •̀ू )还没有人评论...</font>',
        col_type: "rich_text"
    });

    let a = "";
    if (i.rating) {
        a = computeRating(i.rating.max, i.rating.value);
    }
    let color = JSON.parse(fetch(getVar('qdb_config')))
        .starColor || "#ffac2d";
    let s = [{
        title: "<big><strong>" + i.title + "</strong></big>",
        col_type: "rich_text"
    }, {
        title: i.user.name + " 的剧评",
        img: i.user.avatar,
        url: i.user.url,
        col_type: "avatar"
    }, {
        title: (i.spoiler ? "<small><font color=#f20c00>这篇影评可能有剧透</font></small><br/>" : "") + (a ? '<small>看过 <font color=' + color + '>' + a + "</font><br/></small>" : "") + '<small><font color="grey">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(i.create_time) + "</font></small>",
        col_type: "rich_text"
    }, {
        col_type: "line_blank"
    }, {
        title: i.content.replace(/<div\s*[^>]*>(.*?)<\/div>/g, "$1") + (i.is_original ? '<small><font color="grey">&copy;本文版权归该作者所有，任何形式转载请联系作者。</font></small>' : ""),
        col_type: "rich_text"
    }];

    setHomeResult({
        data: s.concat(o)
    })
}

//剧评回复页面
function dramaReviewReplyView(id) {
    setPageTitle('回复详情');
    let t = getDoubanRes("https://frodo.douban.com/api/v2/review/comment/" + id + "/replies");
    let i = [];
    t.replies.forEach((e => {
        i.push({
            title: e.author.name,
            img: e.author.avatar,
            url: e.author.url,
            col_type: "avatar"
        })
        i.push({
            title: (e.ref_comment.has_ref ? '回复@<font color="blue">' + e.ref_comment.author.name + "</font>：" : "") + e.text,
            col_type: "rich_text"
        })
        i.push({
            col_type: "line"
        })
    }))

    setHomeResult({
        data: i
    })
}

//影片详情页面
function detailsView(type, id) {
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id);
    setPageTitle(i.title);
    let info = "";
    if (i.is_tv) {
        info = [i.countries ? i.countries.join(" ") : null, i.genres ? i.genres.join(" ") : null, i.pubdate ? i.pubdate[0] + "首播" : null, i.episodes_count ? "共" + i.episodes_count + "集" : null, i.durations ? "单集片长" + i.durations : null].filter((e => null !== e)).join(" / ");
    } else {
        info = [i.countries ? i.countries.join(" ") : null, i.genres ? i.genres.join(" ") : null, i.pubdate ? i.pubdate[0] + "首播" : null, i.durations ? "片长" + i.durations : null].filter((e => null !== e)).join(" / ");
    }
    let infoItems = [{
        title: i.title + "\n" + i.original_title + "(" + i.year + ")",
        desc: info || i.card_subtitle,
        img: i.pic.normal + "@Referer=" + i.pic.normal,
        col_type: "movie_1_vertical_pic_blur",
        url: $('hiker://empty#noHistory#').rule(() => {
            setPageTitle('高级功能');
            let d = [];
            eval(request(getVar('qdb_file')));
            analysisVerifyModule(d);
            setResult(d);
        }),
        extra: {
            newWindow: true,
            windowId: '高级功能',
            gradient: true
        }
    }];

    let rating = "";
    if (i.rating) {
        rating = computeRating(i.rating.max, i.rating.value);
    }
    let ratingItems = [];
    let color = getConfig('starColor');
    let ratingTitle = ''
    if (rating) {
        ratingTitle = '豆瓣评分™'.big().bold() + '<br>' + rating.fontcolor(color) + '&nbsp;&nbsp;' + (i.rating.value.toFixed(1) + '分').big().bold();
    } else {
        ratingTitle = '暂无评分'.big().bold() + '<br>' + '点我查看影片信息'.fontcolor('grey');
    }
    ratingItems = [{
        title: '““””' + ratingTitle,
        col_type: "text_center_1",
        extra: {
            lineVisible: false
        },
        url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((type, id, ratingCount) => {
            eval(fetch(getVar("qdb_file")));
            rating(type, id, ratingCount);
        }, i.subtype, i.id, i.rating ? i.rating.count : 0)
    }];

    let relatedItems = [{
        title: "剧照",
        img: "https://gitcode.net/qq_41846756/hiker/-/raw/master/img/剧照.png",
        url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((t) => {
            eval(fetch(getVar("qdb_file")));
            stillsList(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }, {
        title: "演职",
        img: "https://gitcode.net/qq_41846756/hiker/-/raw/master/img/演职.png",
        url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((t) => {
            eval(fetch(getVar("qdb_file")));
            credits(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }, {
        title: "短评",
        img: "https://gitcode.net/qq_41846756/hiker/-/raw/master/img/短评.png",
        url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((t) => {
            eval(fetch(getVar("qdb_file")));
            shortCommentList(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }, {
        title: "剧评",
        img: "https://gitcode.net/qq_41846756/hiker/-/raw/master/img/剧评.png",
        url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((t) => {
            eval(fetch(getVar("qdb_file")));
            dramaReviewList(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }];

    let introItems = [];
    if (i.intro) {
        introItems = [{
            title: "““””<big><strong>剧情简介</strong></big>",
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            },
            url: 'hiker://empty'
        }, {
            title: "&nbsp;&nbsp;&nbsp;&nbsp;" + i.intro.replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, " ").replace(/\t/g, " "),
            col_type: "rich_text"
        }]
    }

    let videoRelatedItems = [];
    if (i.trailer) {
        videoRelatedItems.push({
            title: "““””<big><strong>预告</strong></big>",
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            },
            url: 'hiker://empty'
        });
        videoRelatedItems.push({
            title: i.trailer.title,
            img: i.trailer.cover_url,
            url: i.trailer.video_url,
            desc: i.trailer.subject_title + "•" + i.trailer.create_time,
            col_type: "movie_2"
        });
        videoRelatedItems.push({
            title: '查看更多',
            img: "https://gitcode.net/qq_41846756/hiker/-/raw/master/img/more.png",
            col_type: "movie_2",
            url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((t) => {
                eval(fetch(getVar("qdb_file")));
                trailers(t[0], t[1]);
            }, [i.subtype, i.id]),
        });
    }
    if (i.video) {
        videoRelatedItems.push({
            title: "““””<big><strong>视频评论</strong></big>",
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            },
            url: 'hiker://empty'
        });
        videoRelatedItems.push({
            title: i.video.title,
            img: i.video.cover_url + "@Referer=" + i.video.cover_url,
            url: i.video.video_url,
            desc: i.video.author.name + "•" + i.video.create_time,
            col_type: "movie_2"
        });
        videoRelatedItems.push({
            title: '查看更多',
            img: "https://gitcode.net/qq_41846756/hiker/-/raw/master/img/more.png",
            col_type: "movie_2",
            url: $('hiker://empty/#/$page{fypage}#noHistory#').rule((t) => {
                eval(fetch(getVar("qdb_file")));
                videoComment(t[0], t[1]);
            }, [i.subtype, i.id]),
        });
    }

    let config = JSON.parse(fetch(getVar('qdb_config')));

    let analysisConfigs = getConfig('analysisConfigs', config);
    let extraConfig = analysisConfigs[analysisConfigs.use].extra || '{}';
    let extra = {};
    try {
        if (extraConfig.startsWith('{')) eval('extra=' + extraConfig);
    } catch (e) {}
    let videoItems = [];
    videoUrlsModule(videoItems, type, id, ['icon_2', 'icon_small_4'], parseVideoUrlLazy, i, extra);
    if (videoItems.length > 0) {
        videoItems.unshift({
            title: "““””<big><strong>在线观看</strong></big>",
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            },
            url: 'hiker://empty'
        })
    } else {
        videoItems.unshift({
            title: "““””<big><strong>尚无片源</strong></big>",
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            },
            url: 'toast://真的没片源'
        })
    }

    let quickSearchConfigs = getConfig('quickSearchConfigs', config);
    let quickSearchItems = [];
    quickSearchConfigs.order.forEach(quickSearchItem => {
        if (quickSearchConfigs[quickSearchItem]) {
            quickSearchItems.push({
                title: quickSearchItem,
                img: quickSearchConfigs[quickSearchItem].pic,
                col_type: quickSearchConfigs.mode || 'icon_small_4',
                url: 'hiker://search?s=' + i.title + '&rule=' + quickSearchConfigs[quickSearchItem].name
            })
        }
    })
    if (quickSearchItems.length > 0) {
        quickSearchItems.unshift({
                title: '““””<strong><big>快速搜索</big></strong>',
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false
                },
                url: 'hiker://empty'
            })
            /*quickSearchItems.unshift({
                col_type: 'line'
            })*/
    }

    setHomeResult({
        data: infoItems.concat(ratingItems)
            .concat(relatedItems)
            .concat({
                col_type: 'line'
            })
            .concat(quickSearchItems)
            .concat({
                col_type: 'line'
            })
            .concat(videoItems)
            .concat({
                col_type: 'line'
            })
            .concat(videoRelatedItems)
            .concat({
                col_type: 'line'
            })
            .concat(introItems)
            .concat({
                col_type: 'line'
            })
            .concat({
                col_type: 'text_center_1',
                title: '““””<small><font color=#871f78>以上数据来源于豆瓣，如您喜欢，请下载官方app</font></small>',
                desc: '““””<small><font color=#f20c00>此规则仅限学习交流使用，请于导入后24小时内删除，任何组织或个人不得以任何方式方法传播此规则的整体或部分！</font></small>',
                url: 'https://movie.douban.com/subject/' + id + '/',
                extra: {
                    lineVisible: false
                }
            })
    })
}

//推荐
function findList(page, count) {
    if (!getVar('findList')) putVar('findList', '{"item":"movie","playable":"0","score":"0,10"}');
    let a = [];
    let temp = JSON.parse(getVar('findList'));
    let color = getConfig('chooseColor');

    let items = {
        电影: 'movie',
        电视剧: 'tv'
    }
    for (i in items) {
        a.push({
            title: temp.item === items[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('findList'));
                temp.item = e;
                putVar("findList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, items[i])
        })
    }

    a.push({
        col_type: 'blank_block'
    })

    let playable = {
        全部影片: '0',
        仅有片源: '1'
    }
    for (let r in playable) {
        a.push({
            title: temp.playable == playable[r] ? '““””<b> <font color=' + color + '>' + r + ' </font></b>' : r,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('findList'));
                temp.playable = e;
                putVar("findList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, playable[r])
        })
    }

    a.push({
        title: '““””<b> <font color=' + color + '>评分区间:' + temp.score.replace(',', '-') + ' </font></b>',
        col_type: 'scroll_button',
        url: $(temp.score.replace(',', '-'), '评分应在0-10之间').input(() => {
            let temp = JSON.parse(getVar('findList'));
            let inputs = input.split('-');
            if (inputs.length == 2 && inputs.every(e => e >= 0 && e <= 10) && parseFloat(inputs[0]) < inputs[1]) {
                temp.score = input.replace('-', ',');
                putVar("findList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            } else {
                return 'toast://请正确输入'
            }
        })
    })

    let s = getDoubanRes("https://frodo.douban.com/api/v2/" + temp.item + "/recommend" + '?playable=' + temp.playable + '&score_range=' + temp.score + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=8"));
    let l = s.items;
    l = l.filter(e => e.type !== "ad" && e.type !== "tags");

    let detailsViewConfigs = getConfig('detailsViewConfigs');
    let i = l.map((e => {
        let type = e.type,
            id = e.id,
            title = e.subtitle || e.title;
        let baseUrl = e.type === "playlist" ? 'hiker://empty/$page{fypage}' : 'hiker://empty#immersiveTheme#';
        let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
        let urlParams = {};
        if (useConfig.startsWith('{')) {
            eval('urlParams = ' + useConfig);
        } else {
            urlParams.url = $(baseUrl + "#noHistory#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    eval(useConfig);
                }
            }, type, id, title, useConfig);
        }
        return {
            title: title + (type === "playlist" ? "" : "（" + e.year + "）"),
            url: urlParams.url,
            extra: urlParams.extra,
            img: e.pic ? e.pic.normal + "@Referer=" + e.pic.normal : e.cover_url + "@Referer=" + e.cover_url,
            desc: e.type !== "playlist" ? (e.tags.map((e => e.name)).join(",") + "\n" + (e.rating ? computeRating(e.rating.max, e.rating.value) + " " + e.rating.value.toFixed(1) + "分" : "暂无评分")) : (e.title + "\n" + e.tags.join(",") + "\n共" + e.items_count + "部")
        }
    }));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

//热门
function hotList(page, count) {
    if (!getVar('hotList')) putVar('hotList', '{"item":"movie_showing?area=全部","playable":"0","sort":"recommend","score":"0,10"}');
    let a = [];
    let temp = JSON.parse(getVar('hotList'));
    let color = getConfig('chooseColor');

    let items = {
        电影: {
            影院热映电影: 'movie_showing?area=全部',
            豆瓣热门电影: 'hot_gaia?area=全部',
            热门华语电影: 'hot_gaia?area=华语',
            热门欧美电影: 'hot_gaia?area=欧美',
            热门韩国电影: 'hot_gaia?area=韩国',
            热门日本电影: 'hot_gaia?area=日本'
        },
        电视剧: {
            热播电视剧: 'tv_hot',
            热播国产剧: 'tv_domestic',
            热播欧美剧: 'tv_american',
            热播日剧: 'tv_japanese',
            热播韩剧: 'tv_korean',
            热播动画: 'tv_animation'
        },
        综艺: {
            热播综艺: 'show_hot',
            国内综艺: 'show_domestic',
            国外综艺: 'show_foreign'
        }
    }
    for (let i in items) {
        for (let j in items[i]) {
            a.push({
                title: temp.item == items[i][j] ? '““””<b> <font color=' + color + '>' + j + ' </font></b>' : j,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('hotList'));
                    temp.item = e;
                    putVar('hotList', JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, items[i][j])
            })
        }
        a.push({
            col_type: "blank_block"
        })
    }

    let sort = {
        热度排序: 'recommend',
        时间排序: 'time',
        评分排序: 'rank'
    }
    for (let r in sort) {
        a.push({
            title: temp.sort == sort[r] ? '““””<b> <font color=' + color + '>' + r + ' </font></b>' : r,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('hotList'));
                temp.sort = e;
                putVar("hotList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, sort[r])
        })
    }

    a.push({
        col_type: "blank_block"
    })

    let playable = {
        全部影片: '0',
        仅有片源: '1'
    }
    for (let r in playable) {
        a.push({
            title: temp.playable == playable[r] ? '““””<b> <font color=' + color + '>' + r + ' </font></b>' : r,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('hotList'));
                temp.playable = e;
                putVar("hotList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, playable[r])
        })
    }

    a.push({
        title: '““””<b> <font color=' + color + '>评分区间:' + temp.score.replace(',', '-') + ' </font></b>',
        col_type: 'scroll_button',
        url: $(temp.score.replace(',', '-'), '评分应在0-10之间').input(() => {
            let temp = JSON.parse(getVar('hotList'));
            let inputs = input.split('-');
            if (inputs.length == 2 && inputs.every(e => e >= 0 && e <= 10) && parseFloat(inputs[0]) < inputs[1]) {
                temp.score = input.replace('-', ',');
                putVar("hotList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            } else {
                return 'toast://请正确输入'
            }
        })
    })

    let l = [];
    if (temp.item.indexOf('?') != -1) {
        let s = getDoubanRes("https://frodo.douban.com/api/v2/movie/" + temp.item + '&playable=' + temp.playable + '&sort=' + temp.sort + '&score_range=' + temp.score + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=30") + '&loc_id=108288');
        l = s.items;
    } else {
        let s = getDoubanRes("https://frodo.douban.com/api/v2/subject_collection/" + temp.item + '/items' + '?playable=' + temp.playable + '&sort=' + temp.sort + '&score_range=' + temp.score + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=30"));
        l = s.subject_collection_items;
    }

    let detailsViewConfigs = getConfig('detailsViewConfigs');
    let i = l.map((e => {
        let type = e.type,
            id = e.id,
            title = e.title;
        let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
        let urlParams = {};
        if (useConfig.startsWith('{')) {
            eval('urlParams = ' + useConfig);
        } else {
            urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    eval(useConfig);
                }
            }, type, id, title, useConfig);
        }
        return {
            title: title + "（" + e.year + "）",
            url: urlParams.url,
            extra: urlParams.extra,
            img: e.pic ? e.pic.normal + "@Referer=" + e.pic.normal : e.cover.url + '@Referer=' + e.cover.url,
            desc: (e.tags ? e.tags.map((e => e.name)).join(",") : e.card_subtitle) + "\n" + (e.rating ? computeRating(e.rating.max, e.rating.value) + " " + e.rating.value.toFixed(1) + "分" : "暂无评分")
        }
    }));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

//分类
function classList(page, count) {
    if (!getVar('classlist')) putVar('classlist', '{"subtype":"","local":"","year":"","class":"","rank":"U","type":"","filter":"","score":"0,10"}');
    let a = [];
    let temp = JSON.parse(getVar('classlist'));
    let color = getConfig('chooseColor');

    let items = {
        subtype: ["全部形式", "电影", "电视剧", "综艺", "动漫", "纪录片", "短片"],
        local: ["全部地区", "中国大陆", "美国", "中国香港", "中国台湾", "日本", "韩国", "英国", "法国", "德国", "意大利", "西班牙", "印度", "泰国", "俄罗斯", "伊朗", "加拿大", "澳大利亚", "爱尔兰", "瑞典", "巴西", "丹麦"],
        type: ["全部类型", "剧情", "喜剧", "动作", "爱情", "科幻", "动画", "悬疑", "惊悚", "恐怖", "犯罪", "同性", "音乐", "歌舞", "传记", "历史", "战争", "西部", "奇幻", "冒险", "灾难", "武侠", "情色"],
        year: ["全部年代", "2022", "2021", "2020", "2019", "2010年代", "2000年代", "90年代", "80年代", "70年代", "60年代", "更早"],
        class: ["全部特色", "经典", "青春", "文艺", "搞笑", "励志", "魔幻", "感人", "女性", "黑帮", "治愈", "美食", "宗教", "小说改编", "超级英雄"]
    }
    for (item in items) {
        for (let i = 0; i < items[item].length; i++) {
            a.push({
                title: !temp[item] ? (i === 0 ? '““””<b> <font color=' + color + '>' + items[item][0] + ' </font></b>' : items[item][i]) : (temp[item] == items[item][i] ? '““””<b> <font color=' + color + '>' + items[item][i] + ' </font></b>' : items[item][i]),
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('classlist'));
                    temp[e[1]] = e[0].indexOf("全部") != -1 ? "" : e[0];
                    putVar("classlist", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, [items[item][i], item])
            })
        }
        a.push({
            col_type: 'blank_block'
        })
    }

    let rank = {
        默认排序: "U",
        热度: "T",
        评分: "S",
        时间: "R"
    }
    for (let r in rank) {
        a.push({
            title: temp.rank === rank[r] ? '““””<b> <font color=' + color + '>' + r + ' </font></b>' : r,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('classlist'));
                temp.rank = e;
                putVar("classlist", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, rank[r])
        })
    }

    a.push({
        col_type: 'blank_block'
    })

    let filter = {
        全部影片: '',
        仅有片源: 'playable'
    }
    for (let r in filter) {
        a.push({
            title: temp.filter === filter[r] ? '““””<b> <font color=' + color + '>' + r + ' </font></b>' : r,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('classlist'));
                temp.filter = e;
                putVar("classlist", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, filter[r])
        })
    }

    a.push({
        title: '““””<b> <font color=' + color + '>评分区间:' + temp.score.replace(',', '-') + ' </font></b>',
        col_type: 'scroll_button',
        url: $(temp.score.replace(',', '-'), '评分应在0-10之间').input(() => {
            let temp = JSON.parse(getVar('classlist', '{"subtype":"","local":"","year":"","class":"","rank":"U","type":"","filter":"","score":"0,10"}'));
            let inputs = input.split('-');
            if (inputs.length == 2 && inputs.every(e => e >= 0 && e <= 10) && parseFloat(inputs[0]) < inputs[1]) {
                temp.score = input.replace('-', ',');
                putVar("classlist", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            } else {
                return 'toast://请正确输入'
            }
        })
    })

    let s = getDoubanRes("https://frodo.douban.com/api/v2/movie/tag?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=30") + "&q=" + temp.subtype + "," + temp.local + "," + temp.type + "," + temp.year + "," + temp.class + "&sort=" + temp.rank + "&score_range=" + temp.score + '&filter=' + temp.filter);
    let l = s.data;

    let detailsViewConfigs = getConfig('detailsViewConfigs');
    let i = l.map((e => {
        let type = e.type,
            id = e.id,
            title = e.title;
        let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
        let urlParams = {};
        if (useConfig.startsWith('{')) {
            eval('urlParams = ' + useConfig);
        } else {
            urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    eval(useConfig);
                }
            }, type, id, title, useConfig);
        }
        return {
            title: title,
            col_type: 'movie_3',
            url: urlParams.url,
            extra: urlParams.extra,
            img: e.cover_url + "@Referer=" + e.cover_url,
            desc: e.null_rating_reason || e.rating.value
        }
    }));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

//片单
function playList(page, count) {
    if (!getVar('playlist')) putVar('playlist', '{"subtype":"","type":"all"}');
    let a = [];
    let temp = JSON.parse(getVar('playlist', '{"subtype":"","type":"all"}'));
    let color = getConfig('chooseColor');

    let items = {
        type: {
            全部: "all",
            豆瓣片单: "official",
            精选: "selected",
            经典: "classical",
            获奖: "prize",
            高分: "high_score",
            榜单: "movie_list",
            冷门佳片: "dark_horse",
            主题: "topic",
            导演: "director",
            演员: "actor",
            系列: "series",
            华语: "chinese",
            欧美: "western",
            日本: "japanese",
            韩国: "korea",
            喜剧: "comedy",
            动作: "action",
            爱情: "love",
            科幻: "science_fiction",
            动画: "cartoon",
            悬疑: "mystery",
            惊悚: "panic",
            恐怖: "horrible",
            犯罪: "criminal",
            同性: "lgbt",
            战争: "war",
            奇幻: "fantasy",
            情色: "erotica",
            音乐: "music",
            纪录片: "documentary",
            治愈: "cure",
            艺术: "art",
            黑色幽默: "dark_humor",
            青春: "youth",
            女性: "female",
            真实事件改编: "real_event",
            暴力: "violence",
            黑白: "black_white",
            美食: "food",
            旅行: "travel",
            儿童: "child",
            人性: "humanity",
            家庭: "family",
            文艺: "literary_art",
            小说改编: "novel",
            感人: "moving",
            励志: "inspiration"
        },
        subtype: {
            全部: "",
            电影: "movie",
            电视剧: "tv"
        }
    }
    for (let i in items) {
        for (let j in items[i]) {
            a.push({
                title: temp[i] === items[i][j] ? '““””<b> <font color=' + color + '>' + j + ' </font></b>' : j,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((t) => {
                    let temp = JSON.parse(getVar('playlist', '{"subtype":"","type":"all"}'));
                    temp[t[0]] = t[1];
                    putVar("playlist", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, [i, items[i][j]])
            })
        }
        a.push({
            col_type: "blank_block"
        })
    }

    let s = getDoubanRes("https://frodo.douban.com/api/v2/skynet/new_playlists" + "?category=" + temp.type + "&subject_type=" + temp.subtype + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=10"));
    let l = s.data[0].items;

    let i = l.map((e => ({
        title: e.title,
        url: $('hiker://empty/$page{fypage}#noHistory#').rule((type, id) => {
            eval(fetch(getVar("qdb_file")));
            if (type === "playlist") {
                douList(id, getPage(), 50);
            } else {
                subjectCollectionList(getPage(), 50, id);
            }
        }, e.type, e.id),
        img: e.cover_url + "@Referer=" + e.cover_url,
        desc: "共" + e.items_count + "部"
    })));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

//榜单
function rankList(page, count) {
    if (!getVar('rankList')) putVar('rankList', '{"type":"movie","list":"rank_list","year_lists":[],"category_lists":[],"year":"","category":""}');
    let a = [];
    let temp = JSON.parse(getVar('rankList'));
    let color = getConfig('chooseColor');

    let items = {
        电影: 'movie',
        电视剧: 'tv'
    }
    for (let i in items) {
        a.push({
            title: temp.type == items[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
            col_type: 'scroll_button',
            url: $('hiker://empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('rankList'));
                temp.type = e;
                putVar("rankList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, items[i])
        })
    }

    a.push({
        col_type: "blank_block"
    })

    let list = {
        口碑榜单: 'rank_list',
        年度榜单: 'year_ranks',
        类型榜单: 'category_ranks'
    }
    for (let i in list) {
        a.push({
            title: temp.list == list[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
            col_type: 'scroll_button',
            url: $('hiker://empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('rankList'));
                temp.list = e;
                putVar("rankList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, list[i])
        })
    }

    if (temp.list == 'year_ranks' && temp.year_lists.length == 0) {
        let t = getDoubanRes("https://frodo.douban.com/api/v2/" + temp.type + '/rank_list');
        temp.year_lists = t.groups[1].tabs;
        putVar('rankList', JSON.stringify(temp));
    } else if (temp.list == 'category_ranks' && temp.category_lists.length == 0) {
        let t = getDoubanRes("https://frodo.douban.com/api/v2/" + temp.type + '/rank_list');
        temp.category_lists = t.groups[2].tabs;
        putVar('rankList', JSON.stringify(temp));
    }

    if (temp.list == 'year_ranks') {
        a.push({
            col_type: "blank_block"
        })
        if (!temp.year) temp.year = temp.year_lists[0].key;
        for (let t of temp.year_lists) {
            a.push({
                title: temp.year == t.key ? '““””<b> <font color=' + color + '>' + t.title + ' </font></b>' : t.title,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('rankList'));
                    temp.year = e;
                    putVar("rankList", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, t.key)
            })
        }
    } else if (temp.list == 'category_ranks') {
        a.push({
            col_type: "blank_block"
        })
        if (!temp.category) temp.category = temp.category_lists[0].key;
        for (let t of temp.category_lists) {
            a.push({
                title: temp.category == t.key ? '““””<b> <font color=' + color + '>' + t.title + ' </font></b>' : t.title,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('rankList'));
                    temp.category = e;
                    putVar("rankList", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, t.key)
            })
        }
    }

    let l = [];
    if (temp.list == 'rank_list' && MY_PAGE == 1) {
        let s = getDoubanRes("https://frodo.douban.com/api/v2/" + temp.type + '/' + temp.list + (page ? "?start=" + (page - 1) * count + "&count=" + count : "?start=0&count=10"));
        l = s.groups[0].selected_collections;
    } else if (temp.list == 'year_ranks' && MY_PAGE == 1) {
        let s = getDoubanRes("https://frodo.douban.com/api/v2/" + temp.type + '/' + temp.list + '?year=' + temp.year + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=10"));
        l = s.groups[0].selected_collections;
    } else if (temp.list == 'category_ranks') {
        let s = getDoubanRes("https://frodo.douban.com/api/v2/" + temp.type + '/' + temp.list + '?category=' + temp.category + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=10"));
        l = s.selected_collections;
    }

    let i = [];
    if (temp.list == 'category_ranks') {
        i = l.map((e => ({
            title: '““””' + e.title.bold(),
            url: $('hiker://empty/$page{fypage}#noHistory#').rule((type, id) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    subjectCollectionList(getPage(), 50, id);
                }
            }, e.type, e.id),
            img: e.cover_url + "@Referer=" + e.cover_url,
            desc: "共" + e.total + "部"
        })));
    } else {
        i = l.map((e => ({
            title: '' /*'““””' + e.medium_name + '\n' + getStrongText(e.title)*/ ,
            col_type: 'card_pic_2',
            url: $('hiker://empty/$page{fypage}#noHistory#').rule((type, id, stitle) => {
                setPageTitle(stitle);
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    subjectCollectionList(getPage(), 50, id);
                }
            }, e.type, e.id, e.title),
            img: e.cover_url + "@Referer=" + e.cover_url,
            desc: "0"
        })));
    }

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

//将上映
function comingList(page, count) {
    if (!getVar('coming')) putVar('coming', '{"type":"movie","rank":"&sortby=hot","local":"domestic","area":"","filter":""}');
    let a = [];
    let temp = JSON.parse(getVar('coming'));
    let color = getConfig('chooseColor');

    let items = {
        电影: 'movie',
        电视剧: 'tv'
    }
    for (let i in items) {
        a.push({
            title: temp.type === items[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
            col_type: 'scroll_button',
            url: $('hiker://empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('coming'));
                temp.type = e;
                putVar("coming", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, items[i])
        })
    }
    let rank = {
        热度: '&sortby=hot',
        时间: ''
    }
    a.push({
        col_type: "blank_block"
    })
    for (let i in rank) {
        a.push({
            title: temp.rank === rank[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
            col_type: 'scroll_button',
            url: $('hiker://empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('coming'));
                temp.rank = e;
                putVar("coming", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, rank[i])
        })
    }
    let local = {
        国内: 'domestic',
        全球: 'international'
    }
    if (temp.type == 'movie') {
        a.push({
            col_type: "blank_block"
        })
        for (let i in local) {
            a.push({
                title: temp.local === local[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('coming'));
                    temp.local = e;
                    putVar("coming", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, local[i])
            })
        }
    }
    let area = {
        全部: '',
        美国: '&area_filter=american',
        欧洲: '&area_filter=europe',
        日本: '&area_filter=japanese',
        韩国: '&area_filter=korean'
    }
    if (temp.type == 'movie' && temp.local == 'international') {
        a.push({
            col_type: "blank_block"
        })
        for (let i in area) {
            a.push({
                title: temp.area === area[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('coming'));
                    temp.area = e;
                    putVar("coming", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, area[i])
            })
        }
    }
    let filter = {
        全部: '',
        国产剧: '&type_filter=tv_domestic',
        欧美剧: '&type_filter=tv_american',
        日剧: '&type_filter=tv_japanese',
        韩剧: '&type_filter=tv_korean',
        动画: '&type_filter=tv_animation',
        国内综艺: '&type_filter=show_domestic',
        国外综艺: '&type_filter=show_foreign'
    }
    if (temp.type == 'tv') {
        a.push({
            col_type: "blank_block"
        })
        for (let i in filter) {
            a.push({
                title: temp.filter === filter[i] ? '““””<b> <font color=' + color + '>' + i + ' </font></b>' : i,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('coming'));
                    temp.filter = e;
                    putVar("coming", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, filter[i])
            })
        }
    }

    let s = getDoubanRes("https://frodo.douban.com/api/v2/" + temp.type + "/coming_soon" + "?area=" + temp.local + temp.rank + temp.area + temp.filter + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=10"));
    let l = s.subjects;
    let detailsViewConfigs = getConfig('detailsViewConfigs');

    let i = l.map((e => {
        let type = e.type,
            id = e.id,
            title = e.title;
        let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
        let urlParams = {};
        if (useConfig.startsWith('{')) {
            eval('urlParams = ' + useConfig);
        } else {
            urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    eval(useConfig);
                }
            }, type, id, title, useConfig);
        }
        return {
            title: title + "（" + e.year + "）",
            url: urlParams.url,
            extra: urlParams.extra,
            img: e.cover_url + "@Referer=" + e.cover_url,
            desc: "上映日期:" + e.pubdate + "\n" + e.wish_count + "人想看" + "\n" + e.null_rating_reason
        }
    }));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

//片单详情
function subjectCollectionList(page, count, id) {
    if (!getVar('ranking')) putVar('ranking', '{"item":"movie_real_time_hotest","playable":"0","score":"0-10"}');
    let a = [];
    let temp = JSON.parse(getVar('ranking'));
    let color = getConfig('chooseColor');

    let items = {
        电影: {
            实时热门电影: 'movie_real_time_hotest',
            一周口碑电影: 'movie_weekly_best',
            top250电影: 'movie_top250'
        },
        电视剧: {
            实时热门剧集: 'tv_real_time_hotest',
            华语口碑剧集: 'tv_chinese_best_weekly',
            全球口碑剧集: 'tv_global_best_weekly'
        },
        综艺: {
            国内口碑综艺: 'show_chinese_best_weekly',
            国外口碑综艺: 'show_global_best_weekly'
        }
    }
    for (let i in items) {
        for (let j in items[i]) {
            a.push({
                title: temp.item == items[i][j] ? '““””<b> <font color=' + color + '>' + j + ' </font></b>' : j,
                col_type: 'scroll_button',
                url: $('hiker://empty#noLoading#').lazyRule((e) => {
                    let temp = JSON.parse(getVar('ranking'));
                    temp.item = e;
                    putVar("ranking", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, items[i][j])
            })
        }
        a.push({
            col_type: "blank_block"
        })
    }

    a.push({
        col_type: 'blank_block'
    })

    let i = [];
    let playable = {
        全部影片: '0',
        仅有片源: '1'
    }
    for (let r in playable) {
        i.push({
            title: temp.playable == playable[r] ? '““””<b> <font color=' + color + '>' + r + ' </font></b>' : r,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('ranking'));
                temp.playable = e;
                putVar("ranking", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, playable[r])
        })
    }

    i.push({
        title: '““””<b> <font color=' + color + '>评分区间:' + temp.score + ' </font></b>',
        col_type: 'scroll_button',
        url: $(temp.score, '评分应在0-10之间').input(() => {
            let temp = JSON.parse(getVar('ranking'));
            let inputs = input.split('-');
            if (inputs.length == 2 && inputs.every(e => e >= 0 && e <= 10) && parseFloat(inputs[0]) < inputs[1]) {
                temp.score = input;
                putVar("ranking", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            } else {
                return 'toast://请正确输入'
            }
        })
    })

    let t = getDoubanRes("https://frodo.douban.com/api/v2/subject_collection/" + (id || temp.item));
    i.push({
        title: t.title + '(共' + t.total + '部)',
        desc: t.description,
        /*img: t.header_bg_image + "@Referer=" + t.header_bg_image,
        url: t.header_bg_image + "?type=.jpg@Referer=" + t.header_bg_image + "?type=.jpg",*/
        url: 'toast://点我干嘛',
        col_type: "text_1"
    })

    let s = getDoubanRes("https://frodo.douban.com/api/v2/subject_collection/" + (id || temp.item) + "/items?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=50"));
    let l = s.subject_collection_items;
    if (temp.playable == '1') l = l.filter(e => !!e.has_linewatch);
    if (temp.score != '0-10') {
        l = l.filter(e => {
            let r = temp.score.split('-');
            return e.rating && e.rating.value < r[1] && e.rating.value > r[0];
        });
    }

    let detailsViewConfigs = getConfig('detailsViewConfigs');
    let r = l.map((e => {
        let type = e.type,
            id = e.id,
            title = e.title;
        let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
        let urlParams = {};
        if (useConfig.startsWith('{')) {
            eval('urlParams = ' + useConfig);
        } else {
            urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    eval(useConfig);
                }
            }, type, id, title, useConfig);
        }
        return {
            title: title,
            col_type: 'movie_1_vertical_pic',
            url: urlParams.url,
            extra: urlParams.extra,
            img: e.pic.normal + "@Referer=" + e.pic.normal,
            desc: e.card_subtitle.split("/").filter(((e, t) => {
                if (t < 3) return e
            })).join(",") + "\n" + (e.rating ? computeRating(e.rating.max, e.rating.value) + " " + e.rating.value.toFixed(1) + "分" : "暂无评分")
        }
    }));

    setHomeResult({
        data: page > 1 ? r : (id ? i.concat(r) : a.concat(i).concat(r))
    })
}

//豆列详情
function douList(id, page, count) {
    addListener('onClose', 'clearVar("douList")');
    if (!getVar('douList')) putVar('douList', '{"playable":"0","score":"0-10"}');
    let i = [];
    let temp = JSON.parse(getVar('douList'));
    let color = getConfig('chooseColor');

    let playable = {
        全部影片: '0',
        仅有片源: '1'
    }
    for (let r in playable) {
        i.push({
            title: temp.playable == playable[r] ? '““””<b> <font color=' + color + '>' + r + ' </font></b>' : r,
            col_type: 'scroll_button',
            url: $('hiker: //empty#noLoading#').lazyRule((e) => {
                let temp = JSON.parse(getVar('douList'));
                temp.playable = e;
                putVar("douList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, playable[r])
        })
    }

    i.push({
        title: '““””<b> <font color=' + color + '>评分区间:' + temp.score + ' </font></b>',
        col_type: 'scroll_button',
        url: $(temp.score, '评分应在0-10之间').input(() => {
            let temp = JSON.parse(getVar('douList'));
            let inputs = input.split('-');
            if (inputs.length == 2 && inputs.every(e => e >= 0 && e <= 10) && parseFloat(inputs[0]) < inputs[1]) {
                temp.score = input;
                putVar("douList", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            } else {
                return 'toast://请正确输入'
            }
        })
    })

    let t = getDoubanRes("https://frodo.douban.com/api/v2/doulist/" + id);
    i.push({
        title: t.title,
        desc: '共' + t.items_count + '部(' + t.playable_count + '部可播放)',
        /*img: t.header_bg_image + "@Referer=" + t.header_bg_image,
        url: t.header_bg_image + "?type=.jpg@Referer=" + t.header_bg_image + "?type=.jpg",*/
        url: 'toast://别点我',
        col_type: "text_1"
    });

    let s = getDoubanRes("https://frodo.douban.com/api/v2/doulist/" + id + "/posts" + '?playable=' + temp.playable + (page ? "&start=" + (page - 1) * count + "&count=" + count : "&start=0&count=50"));
    let l = s.items;
    if (temp.score != '0-10') {
        l = l.filter(e => {
            let r = temp.score.split('-');
            return e.content.subject.rating && e.content.subject.rating.value < r[1] && e.content.subject.rating.value > r[0];
        });
    }

    let detailsViewConfigs = getConfig('detailsViewConfigs');
    let r = l.map((e => {
        let type = e.content.subject.type,
            id = e.content.subject.id,
            title = e.content.subject.title;
        let useConfig = detailsViewConfigs[detailsViewConfigs.use].config;
        let urlParams = {};
        if (useConfig.startsWith('{')) {
            eval('urlParams = ' + useConfig);
        } else {
            urlParams.url = $("hiker://empty#noHistory##immersiveTheme#" + '?type=' + type + '&id=' + id).rule((type, id, title, useConfig) => {
                eval(fetch(getVar("qdb_file")));
                if (type === "playlist") {
                    douList(id, getPage(), 50);
                } else {
                    eval(useConfig);
                }
            }, type, id, title, useConfig);
        }
        return {
            title: title,
            url: urlParams.url,
            extra: urlParams.extra,
            img: e.content.subject.pic.normal + "@Referer=" + e.content.subject.pic.normal,
            desc: e.content.subject.card_subtitle.split("/").filter(((e, t) => {
                if (t < 3) return e
            })).join(",") + "\n" + (e.content.subject.rating ? computeRating(e.content.subject.rating.max, e.content.subject.rating.value) + " " + e.content.subject.rating.value.toFixed(1) + "分" : "暂无评分")
        }
    }));

    setHomeResult({
        data: page > 1 ? r : i.concat(r)
    })
}

/**
 * 通过传入 params 对象生成编辑界面
 * @param d 视界 setResult 用的列表
 * @param configKey config 的 key 值，比如我要拿 config.detailsViewConfigs，configKey 就传 "detailsViewConfigs"
 * @param params 编辑界面的配置
 *
 * 【params对象数据示例】
 * {
        key: "input_name",
        desc: "请输入名称",
        type: 'textarea',
        data: {
            config: {
                key: "input_code",
                desc: "请输入输入配置",
                type: 'textarea'
            },
        }
    }
 */
function modeEditPage(d, configKey, params) {
    addListener('onClose', $.toString((params) => {
        clearVar(params.key)
        let datas = params.data;
        let dataKeys = Object.keys(datas);
        for (let i in dataKeys) {
            let dataKey = dataKeys[i]
            clearVar(datas[dataKey].key)
        }
    }, params))
    d.push({
        title: "保存",
        desc: params.desc,
        col_type: 'input',
        extra: {
            titleVisible: false,
            defaultValue: getVar(params.key, ""),
            type: params.type ? params.type : '',
            onChange: 'putVar("' + params.key + '", input)'
        }
    })
    let datas = params.data;
    let dataKeys = Object.keys(datas);
    for (let dataKey of dataKeys) {
        let data = datas[dataKey]
        d.push({
            title: "保存",
            desc: data.desc,
            col_type: 'input',
            extra: {
                titleVisible: false,
                defaultValue: getVar(data.key, ""),
                type: data.type ? data.type : '',
                height: -1,
                highlight: true,
                onChange: 'putVar("' + data.key + '", input)'
            }
        })
    }
    d.push({
        title: '保存',
        col_type: 'text_center_1',
        url: $().lazyRule((configKey, params) => {
            let config = JSON.parse(request(getVar('qdb_config')))
            let name = getVar(params.key, "");
            config[configKey].use = name
            if (!config[configKey][name]) config[configKey][name] = {}
            let datas = params.data;
            let dataKeys = Object.keys(datas);
            for (let i in dataKeys) {
                let dataKey = dataKeys[i]
                let data = datas[dataKey]
                config[configKey][name][dataKey] = getVar(data.key, "");
            }
            writeFile(getVar('qdb_config'), JSON.stringify(config))
            back();
            return 'toast://保存成功'
        }, configKey, params)
    })
}

//自定义详情页面-配置编辑页面
function detailViewModeEditPage(d) {
    d.push({
        title: '<font color="#808080">' + '【内置变量】' + '<br>&nbsp;&nbsp;&nbsp;id: 片单id' + '<br>&nbsp;&nbsp;&nbsp;type: 片单类型' + '<br>&nbsp;&nbsp;&nbsp;title: 片单标题' + '</font>',
        col_type: 'rich_text'
    })
    modeEditPage(d, "detailsViewConfigs", {
        key: "input_name",
        desc: "请输入名称",
        // type: 'input'
        data: {
            config: {
                key: "input_code",
                desc: "请输入配置代码",
                type: 'textarea'
            },
            setting: {
                key: "input_setting_code",
                desc: "请输入设置页面代码",
                type: 'textarea'
            }
        }
    })
}

//影片详情配置模块
function detailViewModeModule(d, detailsViewConfigs) {
    let detailsViewConfigs = getConfig('detailsViewConfigs');
    d.push({
        title: '自定义影片详情页面'.bold(),
        col_type: "rich_text"
    })
    for (let configKey of Object.keys(detailsViewConfigs)) {
        if (configKey === 'use') continue;
        d.push({
            title: configKey === detailsViewConfigs.use ? "““" + configKey + "””" : configKey,
            url: $("hiker://empty#noLoading#").lazyRule(configKey => {
                let config = JSON.parse(request(getVar('qdb_config')))
                if (config.detailsViewConfigs.use === configKey) {
                    putVar("input_config_type", '影片详情页面配置')
                    putVar("input_name", configKey)
                    putVar("input_code", config.detailsViewConfigs[configKey].config)
                    putVar("input_setting_code", config.detailsViewConfigs[configKey].setting)
                    return 'hiker://page/setting-editor?rule=青豆'
                }
                config.detailsViewConfigs.use = configKey
                writeFile(getVar('qdb_config'), JSON.stringify(config))
                refreshPage(false);
                return 'toast://切换成功'
            }, configKey),
            col_type: 'flex_button'
        })
    }
    d.push({
        col_type: 'blank_block'
    })
    d.push({
        title: '➕',
        col_type: 'flex_button',
        url: $().rule(() => {
            eval(request(getVar('qdb_file')))
            let d = [];
            setPageTitle("请输入影片详情页信息")
            detailViewModeEditPage(d)
            setResult(d);
        }),
    });
    d.push({
        title: '➖',
        col_type: 'flex_button',
        url: $(Object.keys(detailsViewConfigs).filter(configKey => configKey !== 'use' && configKey !== '默认'), 2)
            .select(() => {
                if (input === '默认') return 'toast://默认配置无法删除！'
                let config = JSON.parse(request(getVar('qdb_config')))
                if (input === config.detailsViewConfigs.use) return 'toast://该配置正在使用，无法删除！'
                return $('确认删除"' + input + '"？').confirm((config, configKey) => {
                    delete config.detailsViewConfigs[configKey]
                    writeFile(getVar('qdb_config'), JSON.stringify(config))
                    refreshPage(false);
                    return 'toast://删除' + configKey + '成功'
                }, config, input)
            })
    })
    d.push({
        title: '📝',
        col_type: 'flex_button',
        url: $(Object.keys(detailsViewConfigs).filter(configKey => configKey !== 'use'), 2).select(() => {
            // if (input === '默认') return 'toast://默认配置无法编辑！'
            let config = JSON.parse(request(getVar('qdb_config')))
            return $().rule((config, configKey) => {
                eval(request(getVar('qdb_file')))
                let d = [];
                setPageTitle("编辑详情页代码")
                putVar("input_name", configKey)
                putVar("input_code", config.detailsViewConfigs[configKey].config)
                putVar("input_setting_code", config.detailsViewConfigs[configKey].setting)
                detailViewModeEditPage(d)
                setResult(d);
            }, config, input)
        })
    })
    d.push({
        title: '📥',
        col_type: 'flex_button',
        url: $("", "请输入口令").input(() => {
            if (!input.includes("影片详情页面配置")) return "toast://该口令不是影片详情页面配置";
            eval(request(getVar('qdb_file')))
            let importConfigs = ConfigTool.import(input);
            QLog.print('dv.importConfigs', importConfigs)
            if (!importConfigs) return "toast://似乎出了错，请尝试再次导入～";
            return $().rule((importConfigs) => {
                let d = [];
                eval(request(getVar('qdb_file')))
                putVar("input_name", importConfigs.name)
                putVar("input_code", importConfigs.data.config)
                putVar("input_setting_code", importConfigs.data.setting)
                detailViewModeEditPage(d)
                setResult(d);
            }, importConfigs);
        })
    })
    d.push({
        title: '📤',
        col_type: 'flex_button',
        url: $(Object.keys(detailsViewConfigs).filter(configKey => configKey !== 'use'), 2).select(() => {
            // if (input === '默认') return 'toast://默认配置无法编辑！'
            eval(request(getVar('qdb_file')))
            let config = getConfig();
            let selectConfig = {
                name: input,
                data: config.detailsViewConfigs[input]
            }
            return $(ConfigTool.encTypeList, 2).select((selectConfig) => {
                eval(request(getVar('qdb_file')))
                return ConfigTool.toClipboard(ConfigTool.export(selectConfig.name, selectConfig, "影片详情页面配置", input))
            }, selectConfig)
        })
    })
}
// 详情页设置模块
function detailViewSettingModule(d) {
    let detailsViewConfigs = getConfig('detailsViewConfigs');
    detailViewModeModule(d, detailsViewConfigs)
    let detailViewSetting = detailsViewConfigs[detailsViewConfigs.use].setting
    let result = "toast://该详情页无设置页面";
    if (detailViewSetting) {
        try {
            if (detailViewSetting.indexOf('return') == -1) throw new Error('必须 return @rule=js: 或 $().rule');
            if (detailViewSetting.startsWith("(")) {
                eval('result = ' + detailViewSetting)
            } else {
                eval('result = ' + '(() => {' + detailViewSetting + '})()')
            }
        } catch (e) {
            log(e.message);
            result = "toast://错误的设置页面代码,请前往 日志 查看错误原因"
        }
    }
    d.push({
        title: '⚙️',
        col_type: 'flex_button',
        url: result
    })
}

//编码工具类
let ZipTool = {
    dependence: 'https://unpkg.com/lz-string@1.4.4/libs/lz-string.min.js',
    compress: {
        size: {
            key: "text-compress-size",
            set: (newValue) => {
                putVar(this.key, newValue.toString())
            },
            get: () => {
                return parseInt(getVar(this.key, "0"))
            }
        },
        exec: (input) => {
            eval(request(ZipTool.dependence))
            let result = LZString.compressToEncodedURIComponent(input)
                // ZipTool.compress.size.set(result.length * 2)
            return result
        }
    },
    decompress: {
        size: {
            get: () => {
                return getVar("text-decompress", "0")
                    .length
            }
        },
        exec: (input) => {
            eval(request(ZipTool.dependence))
            let result = LZString.decompressFromEncodedURIComponent(input)
            return result
        }
    }
}

// 配置项工具类
let ConfigTool = {
    encTypeList: ['Base64', 'Zipper', '云口令'],
    toClipboard: (configCommand, name) => {
        if (configCommand.startsWith('toast://')) return configCommand
        if (!name) {
            let commandSplits = configCommand.split("￥")
            name = commandSplits[2]
            name = name ? ("“" + name + "”") : ''
        }
        refreshPage(false);
        return "copy://" + configCommand + ".js:'toast://导出" + name + "成功！'";
    },
    export: (name, config, remark, encType) => {
        let symbol = "青豆口令￥" + remark + "￥" + name + "￥" + encType + "￥";
        let result = config
        if (typeof result === "object") {
            result = JSON.stringify(config);
        } else if (typeof result === "string") {
            result = config;
        } else {
            throw "导出数据不合法"
        }
        switch (encType) {
            case 'Base64':
                result = base64Encode(result);
                break;
            case 'Zipper':
                result = ZipTool.compress.exec(result)
                break;
            case '云口令':
                if (getAppVersion() > 2070) {
                    symbol = "青豆口令￥" + remark + "￥" + name
                    result = sharePaste(ConfigTool.export(name, config, remark, 'Zipper'));
                    return result + '\n\n' + symbol
                } else {
                    return 'toast://请更新视界版本至 C2070 以上'
                }
                break;
        }
        result = symbol + result
        return result;
    },
    import: (configCommand) => {
        let result = ''
        if (configCommand.startsWith('http')) {
            if (getAppVersion() > 2070) {
                result = configCommand.split('青豆')[0].replace(/\\n/, '')
                configCommand = parsePaste(result)
            } else {
                return 'toast://请更新视界版本至 C2070 以上'
            }
        }
        try {
            let resultSplits = configCommand.split("￥")
            let encType = resultSplits[3]
            result = resultSplits[4]
            switch (encType) {
                case 'Base64':
                    QLog.print('result.base64.before', result)
                    result = base64Decode(result);
                    QLog.print('result.base64.after', result)
                    break;
                case 'Zipper':
                    QLog.print('result.zipper.before', result)
                    result = ZipTool.decompress.exec(result)
                    QLog.print('result.zipper.after', result)
                    break;
            }
            QLog.print('result.parse.before', result)
            result = JSON.parse(result);
            QLog.print('result.parse.after', result)
        } catch (e) {
            log(e.message)
            throw "导入数据不合法"
        }
        QLog.print('result.return', result)
        return result;
    }
}

//自定义解析-编辑页面
function analysisModeEditPage(d) {
    d.push({
        title: '<font color="#808080">' + '【解析代码内置变量】' + '<br>&nbsp;&nbsp;&nbsp;input: 视频链接' + '</font>',
        col_type: 'rich_text'
    })
    modeEditPage(d, "analysisConfigs", {
        key: "input_name",
        desc: "请输入名称",
        // type: 'input'
        data: {
            config: {
                key: "input_code",
                desc: "请输入解析代码",
                type: 'textarea'
            },
            extra: {
                key: 'input_extra',
                desc: '请输入extra属性值',
                type: 'textarea'
            },
            setting: {
                key: "input_setting_code",
                desc: "请输入设置页面代码",
                type: 'textarea'
            }
        }
    })
}

// 解析配置模块
function analysisModeModule(d, analysisConfigs) {
    d.push({
        title: '自定义解析插件'.bold(),
        col_type: "rich_text"
    })
    for (let configKey of Object.keys(analysisConfigs)) {
        if (configKey === 'use') continue;
        d.push({
            title: configKey === analysisConfigs.use ? "““" + configKey + "””" : configKey,
            url: $("hiker://empty#noLoading#").lazyRule(configKey => {
                let config = JSON.parse(request(getVar('qdb_config')))
                if (config.analysisConfigs.use === configKey) {
                    putVar("input_config_type", '解析插件配置')
                    putVar("input_name", configKey)
                    putVar("input_code", config.analysisConfigs[configKey].config)
                    putVar("input_extra", config.analysisConfigs[configKey].extra)
                    putVar("input_setting_code", config.analysisConfigs[configKey].setting)
                    return 'hiker://page/setting-editor?rule=青豆'
                }
                config.analysisConfigs.use = configKey
                writeFile(getVar('qdb_config'), JSON.stringify(config))
                refreshPage(false);
                return 'toast://切换成功'
            }, configKey),
            col_type: 'flex_button'
        })
    }
    d.push({
        col_type: 'blank_block'
    })
    d.push({
        title: '➕',
        col_type: 'flex_button',
        url: $().rule(() => {
            eval(request(getVar('qdb_file')))
            let d = [];
            setPageTitle("请输入解析代码")
            analysisModeEditPage(d)
            setResult(d);
        })
    });
    d.push({
        title: '➖',
        col_type: 'flex_button',
        url: $(Object.keys(analysisConfigs).filter(configKey => configKey !== 'use' && configKey !== '不解析' && configKey !== '断插'), 2)
            .select(() => {
                if (input === '不解析' && input === '断插') return 'toast://默认解析无法删除！'
                let config = JSON.parse(request(getVar('qdb_config')))
                if (input === config.analysisConfigs.use) return 'toast://该解析正在使用，无法删除！'
                return $('确认删除"' + input + '"？').confirm((config, configKey) => {
                    delete config.analysisConfigs[configKey]
                    writeFile(getVar('qdb_config'), JSON.stringify(config))
                    refreshPage(false);
                    return 'toast://删除' + configKey + '成功'
                }, config, input)
            })
    })
    d.push({
        title: '📝',
        col_type: 'flex_button',
        url: $(Object.keys(analysisConfigs).filter(configKey => configKey !== 'use'), 2)
            .select(() => {
                // if (input === '不解析' && input === '断插') return 'toast://默认解析无法编辑！'
                let config = JSON.parse(request(getVar('qdb_config')))
                return $().rule((config, configKey) => {
                    eval(request(getVar('qdb_file')))
                    let d = [];
                    setPageTitle("编辑解析代码")
                    putVar("input_name", configKey)
                    putVar("input_code", config.analysisConfigs[configKey].config)
                    putVar("input_extra", config.analysisConfigs[configKey].extra)
                    putVar("input_setting_code", config.analysisConfigs[configKey].setting)
                    analysisModeEditPage(d)
                    setResult(d);
                }, config, input)
            })
    })
    d.push({
        title: '📥',
        col_type: 'flex_button',
        url: $("", "请输入口令").input(() => {
            if (!input.includes("解析插件配置")) return "toast://该口令不是解析插件配置";
            eval(request(getVar('qdb_file')))
            let importConfigs = ConfigTool.import(input);
            QLog.print('analysis.importConfigs', importConfigs)
            if (!importConfigs) return "toast://似乎出了错，请尝试再次导入～";
            return $().rule((importConfigs) => {
                let d = [];
                eval(request(getVar('qdb_file')))
                putVar("input_name", importConfigs.name)
                putVar("input_code", importConfigs.data.config)
                putVar("input_extra", importConfigs.data.extra)
                putVar("input_setting_code", importConfigs.data.setting)
                analysisModeEditPage(d)
                setResult(d);
            }, importConfigs);
        })
    })
    d.push({
        title: '📤',
        col_type: 'flex_button',
        url: $(Object.keys(analysisConfigs).filter(configKey => configKey !== 'use'), 2).select(() => {
            // if (input === '默认') return 'toast://默认配置无法编辑！'
            eval(request(getVar('qdb_file')))
            let config = getConfig();
            let selectConfig = {
                name: input,
                data: config.analysisConfigs[input]
            }
            return $(ConfigTool.encTypeList, 2).select((selectConfig) => {
                eval(request(getVar('qdb_file')))
                return ConfigTool.toClipboard(ConfigTool.export(selectConfig.name, selectConfig, "解析插件配置", input))
            }, selectConfig)
        })
    })
}

// 解析验证模块
function analysisVerifyModule(d) {
    if (getItem('password') !== "true") {
        d.push({
            title: '点我验证身份',
            col_type: 'text_center_1',
            url: $('', '青豆的作者是谁？').input(() => {
                if (input == 'Joker&&Reborn') {
                    setItem('password', 'true');
                    confirm({
                        title: '恭喜,你已进入高级模式',
                        content: '注意：使用高级功能产生的一切法律风险由用户承担',
                        confirm: 'refreshPage()',
                        cancel: 'refreshPage()'
                    })
                    return 'hiker://empty'
                } else {
                    return 'toast://不对哦'
                }
            })
        })
    } else {
        eval(request(getVar('qdb_file')));
        analysisSettingModule(d);
    }
}

// 解析设置模块
function analysisSettingModule(d) {
    let analysisConfigs = getConfig('analysisConfigs');
    analysisModeModule(d, analysisConfigs);
    /**
     * 这下面的都是拿设置页面的配置出来 eval 执行，最终获得插件设置页面的 url，这个 url 可以是网页也可以是二级界面
     */
    let analysisSetting = analysisConfigs[analysisConfigs.use].setting
    let result = "toast://该插件无设置页面"
    if (analysisSetting) {
        try {
            if (analysisSetting.indexOf('return') == -1) throw new Error('必须 return @rule=js: 或 $().rule');
            if (analysisSetting.startsWith("(")) {
                eval('result = ' + analysisSetting)
            } else {
                /**
                 * 还原成 $.toString(...) 的最终结果，达到最终处理方式跟上面的 if 一致的目的
                 */
                eval('result = ' + '(() => {' + analysisSetting + '})()')
            }
        } catch (e) {
            log(e.message);
            result = "toast://错误的设置页面代码,请前往 日志 查看错误原因"
        }
    }
    d.push({
        title: '⚙️',
        col_type: 'flex_button',
        url: result
    })
}

//自定义快速搜索模块
function quickSearchDIYModule(d, config) {
    let quickSearchConfigs = getConfig('quickSearchConfigs', config);
    /*if (!quickSearchConfigs.order) {
        let order = [];
        for (let configKey of Object.keys(quickSearchConfigs)) {
            if (configKey == 'mode') continue;
            order.push(configKey);
        }
        quickSearchConfigs.order = order;
        config.quickSearchConfigs.order = order;
        writeFile(getVar('qdb_config'), JSON.stringify(config))
    }*/
    d.push({
        title: '自定义快速搜索'.bold(),
        col_type: "rich_text"
    })
    for (let configKey of quickSearchConfigs.order) {
        d.push({
            title: configKey,
            url: $('➕是添加\n➖是删除\n📝是修改\n🔁是排序\n⚙️是设置样式').confirm(() => {
                return 'toast://下次不要再点我了'
            }),
            col_type: 'flex_button'
        })
    }
    d.push({
        col_type: 'blank_block'
    })
    d.push({
        title: '➕️',
        col_type: 'flex_button',
        url: $('显示名@@小程序名@@图片链接', '根据提示输入就好了\n小程序名为空则为海阔搜索').input(() => {
            let config = JSON.parse(fetch(getVar('qdb_config')));
            input = input.split('@@');
            if (config.quickSearchConfigs.order.indexOf(input[0]) == -1) config.quickSearchConfigs.order.push(input[0]);
            config.quickSearchConfigs[input[0]] = {
                name: input[1],
                pic: input[2]
            };
            writeFile(getVar('qdb_config'), JSON.stringify(config));
            refreshPage(false);
            return 'toast://添加成功';
        })
    });
    d.push({
        title: '➖',
        col_type: 'flex_button',
        url: $(quickSearchConfigs.order, 2).select(() => {
            let config = JSON.parse(request(getVar('qdb_config')))
            return $('确认删除"' + input + '"？').confirm((config, configKey) => {
                let index = config.quickSearchConfigs.order.indexOf(configKey);
                config.quickSearchConfigs.order.splice(index, 1);
                delete config.quickSearchConfigs[configKey]
                writeFile(getVar('qdb_config'), JSON.stringify(config))
                refreshPage(false);
                return 'toast://删除' + configKey + '成功'
            }, config, input)
        })
    })
    d.push({
        title: '📝',
        col_type: 'flex_button',
        url: $(quickSearchConfigs.order, 2).select(() => {
            let config = JSON.parse(request(getVar('qdb_config')));
            let quickSearchConfigs = config.quickSearchConfigs;
            let dtext = input + '@@' + quickSearchConfigs[input].name + '@@' + quickSearchConfigs[input].pic;
            return $(dtext, '请修改').input((config, raw) => {
                input = input.split('@@');
                if (raw != input[0]) {
                    let index = config.quickSearchConfigs.order.indexOf(raw);
                    config.quickSearchConfigs.order[index] = input[0];
                    delete config.quickSearchConfigs[raw];
                }
                if (config.quickSearchConfigs.order.indexOf(input[0]) == -1) config.quickSearchConfigs.order.push(input[0]);
                config.quickSearchConfigs[input[0]] = {
                    name: input[1],
                    pic: input[2]
                };
                writeFile(getVar('qdb_config'), JSON.stringify(config));
                refreshPage(false);
                return 'toast://修改成功';
            }, config, input)
        })
    })
    d.push({
        title: '🔁',
        col_type: 'flex_button',
        url: $('hiker://empty#noHistory#').rule(() => {
            addListener('onClose', $.toString(() => {
                clearVar('json');
                clearVar('op');
            }))
            if (getVar('json') == "") {
                let config = JSON.parse(request(getVar('qdb_config')));
                let quickSearchConfigs = config.quickSearchConfigs;
                putVar('json', JSON.stringify(quickSearchConfigs));
            }

            let old = JSON.parse(getVar('json'));
            let d = [];
            d.push({
                title: '分别点击两项以交换顺序\n‘‘排序完毕后点我保存排序,否则排序不生效’’',
                col_type: 'text_center_1',
                url: $('#noLoading#').lazyRule(() => {
                    let config = JSON.parse(fetch(getVar('qdb_config')));
                    config.quickSearchConfigs = JSON.parse(getVar('json'));
                    writeFile(getVar('qdb_config'), JSON.stringify(config));
                    back(true);
                    return 'toast://修改成功'
                })
            })
            old.order.forEach((value, index) => {
                d.push({
                    title: getVar('op') == value ? value + '‘‘(当前选中)’’' : value,
                    col_type: 'text_1',
                    url: $().lazyRule((key, index) => {
                        let op = getVar('op');
                        if (op == '') {
                            putVar('op', key);
                            refreshPage();
                            return 'hiker://empty'
                        } else if (op == key) {
                            clearVar('op');
                            refreshPage();
                            return 'hiker://empty'
                        } else {
                            let old = JSON.parse(getVar('json'));
                            let newa = {
                                mode: old.mode,
                                order: old.order
                            };
                            let opindex = newa.order.indexOf(op);
                            if (Math.abs(opindex - index) == 1) {
                                newa.order[opindex] = key;
                                newa.order[index] = op;
                            } else if (opindex > index) {
                                newa.order.splice(opindex, 1);
                                newa.order.splice(index, 0, op);
                            } else {
                                newa.order.splice(opindex, 1);
                                newa.order.splice(index - 1, 0, op);
                            }
                            newa.order.forEach(value => newa[value] = old[value])
                            putVar('json', JSON.stringify(newa));
                            clearVar('op');
                            refreshPage();
                            return 'hiker://empty'
                        }
                    }, value, index)
                })
            })
            setResult(d);
        })
    })
    d.push({
        title: '⚙️',
        col_type: 'flex_button',
        url: $(quickSearchConfigs['mode'] || "", '请正确输入组件样式\n建议值:flex_button scroll_button icon_round_small_4 icon_small_4').input(() => {
            let config = JSON.parse(request(getVar('qdb_config')));
            config.quickSearchConfigs.mode = input;
            writeFile(getVar('qdb_config'), JSON.stringify(config));
            refreshPage(false);
            return 'toast://样式修改成功'
        })
    })
}

//设置页面
function settingPage() {
    //eval(fetch(getVar('qdb_file')));
    let conf = JSON.parse(fetch(getVar('qdb_config')));
    let d = [];

    d.push({
        title: '““””' + '点我检测依赖更新'.bold(),
        desc: '本地依赖版本: ' + version,
        col_type: 'text_1',
        url: $('hiker://empty').lazyRule((currentVersion) => {
            let gitfile = request("https://gitcode.net/qq_41846756/hiker/-/raw/master/qdb.js");
            eval(gitfile);
            if (version > currentVersion) {
                return $("发现新版本,是否更新?").confirm((gitfile) => {
                    writeFile("hiker://files/rules/joker/qdb.js", gitfile);
                    back(true);
                    return 'toast://依赖文件更新成功'
                }, gitfile)
            } else {
                return "toast://已经是最新了"
            }
        }, version)
    })

    let starColor = conf.starColor || '#ffac2d';
    d.push({
        title: '““””' + '自定义星星颜色'.bold(),
        desc: '““””<font color=' + starColor + '>' + '★★★★★</font>',
        col_type: 'text_1',
        url: $(starColor, '别忘了#').input(() => {
            let config = JSON.parse(fetch(getVar('qdb_config')));
            config.starColor = input;
            writeFile(getVar('qdb_config'), JSON.stringify(config));
            refreshPage();
            return "toast://设置更改已保存";
        })
    })
    let chooseColor = conf.chooseColor || '#FA7298';
    d.push({
        title: '““””' + '自定义选中标签颜色'.bold(),
        desc: '““””<font color=' + chooseColor + '>' + '我是预览效果</font>',
        col_type: 'text_1',
        url: $(chooseColor, '别忘了#').input(() => {
            let config = JSON.parse(fetch(getVar('qdb_config')));
            config.chooseColor = input;
            writeFile(getVar('qdb_config'), JSON.stringify(config));
            refreshPage();
            return "toast://设置更改已保存";
        })
    })

    quickSearchDIYModule(d, conf);
    d.push({
        col_type: 'line'
    })

    detailViewSettingModule(d);
    d.push({
        col_type: 'line'
    })

    if (getItem('password') == 'true') {
        analysisSettingModule(d);
        d.push({
            col_type: 'line'
        })
    }



    /*d.push({
        title: '““””' + (getVar(QLog.key) == 'true' ? '已进入调试模式(退出此页面自动关闭)'.bold() : '点我进入调试模式'.bold()),
        desc: '导入详情配置和解析配置出错时请打开此模式',
        col_type: 'text_1',
        url: $('hiker://empty').lazyRule(() => {
            eval(fetch(getVar('qdb_file')));
            putVar(QLog.key, 'true');
            confirm({
                title: '已打开调试模式',
                content: '请再次尝试导入,然后向开发者提交日志',
                confirm: 'refreshPage(false)',
                cancel: 'refreshPage(false)'
            })
            return 'hiker://empty'
        })
    })*/

    d.push({
        title: '““””' + '恢复默认设置'.bold(),
        desc: '重生',
        col_type: 'text_1',
        url: $(['重置星星颜色', '重置选中标签颜色', '重置快速搜索', '重置全部设置项'], 1).select(() => {
            return $("确定要" + input + "？").confirm((sel) => {
                let item = '';
                switch (sel) {
                    case '重置星星颜色':
                        item = 'starColor';
                        break;
                    case '重置选中标签颜色':
                        item = 'chooseColor';
                        break;
                    case '重置快速搜索':
                        item = 'quickSearchConfigs';
                        break;
                    case '重置全部设置项':
                        item = 'all';
                        break;
                }
                eval(fetch(getVar('qdb_file')));
                if (item == 'all') {
                    writeFile(getVar('qdb_config'), JSON.stringify(defaultConfigs));
                    refreshPage();
                    return "toast://已" + sel;
                } else {
                    let config = JSON.parse(fetch(getVar('qdb_config')));
                    config[item] = defaultConfigs[item];
                    writeFile(getVar('qdb_config'), JSON.stringify(config));
                    refreshPage();
                    return "toast://已" + sel;
                }
            }, input)
        })
    })
    setResult(d);
}

//视频模块
function videoUrlsModule(d, type, id, col, lazy, _res, extra) {
    //col是样式col[0],col[1]分别是tv和movie的样式(tv会有分集信息title会很长)
    if (!col) col = ['icon_2', 'icon_small_4'];
    if (!lazy) lazy = 'return input';
    let res = _res || getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id);
    for (let item in res.vendors) {
        let e = res.vendors[item];
        if (type === "tv") {
            d.push({
                title: e.title + (e.episodes_info ? "•" + e.episodes_info : ""),
                img: e.icon,
                col_type: col[0] || "icon_2",
                url: $('hiker://empty?id=' + id + '&type= ' + type + '&title=' + e.title).rule((res, id, e, lazy, extra) => {
                    let title = res.title,
                        pic = res.pic.normal + "@Referer=" + res.pic.normal;
                    setPageTitle(e.title + '-' + title);
                    try {
                        setPagePicUrl(pic);
                    } catch (e) {}
                    eval(fetch(getVar("qdb_file")));
                    let urls = getTvUrls(id, e.id);
                    lazy = $("").lazyRule(lazy => {
                        let resultUrl = "toast://解析失败";
                        try {
                            if (lazy.startsWith("(")) {
                                eval('resultUrl = ' + lazy)
                            } else {
                                eval('resultUrl = ' + '(() => {' + lazy + '})()')
                            }
                        } catch (e) {
                            log(e.message)
                        }
                        return resultUrl
                    }, lazy)
                    let d = [];
                    if (typeof(urls) == "object") {
                        let d = [];
                        for (let i = 0; i < urls.length; i++) {
                            d.push({
                                title: '第' + (i + 1) + '集',
                                col_type: 'text_4',
                                url: lazy ? urls[i] + lazy : urls[i],
                                extra: extra
                            })
                        }
                        setResult(d);
                    } else if (typeof(urls) == "string" && urls == '被封ip') {
                        let rule = JSON.parse(request("hiker://page/releaseIP?rule=青豆"))
                            .rule;
                        eval(rule);
                    } else if (typeof(urls) == 'string' && urls == '没有收录') {
                        let d = [];
                        d.push({
                            title: '豆瓣没有收录此视频源的详细信息',
                            desc: '点我可以去视频源网站看看',
                            col_type: 'text_center_1',
                            url: e.url
                        })
                        setResult(d);
                    }
                }, res, id, e, lazy, extra)
            })
        } else if (type === 'movie') {
            let mLazy = $("").lazyRule(lazy => {
                let resultUrl = "toast://解析失败";
                try {
                    if (lazy.startsWith("(")) {
                        eval('resultUrl = ' + lazy)
                    } else {
                        eval('resultUrl = ' + '(() => {' + lazy + '})()')
                    }
                } catch (e) {
                    log(e.message)
                }
                return resultUrl
            }, lazy)
            d.push({
                title: e.title + (e.episodes_info ? "•" + e.episodes_info : ""),
                img: e.icon,
                col_type: col[1] || "icon_small_4",
                url: mLazy ? e.url + mLazy : e.url,
                extra: extra
            })
        }
    }
}

//获取电视剧分集链接,id是片子编号,uid是视频源编号
function getTvUrls(id, uid) {
    let cookieCache = 'hiker://files/cache/doubancookie.txt';
    let mUrl = 'https://movie.douban.com/subject/' + id + '/';
    let headers = {
        "User-Agent": PC_UA,
    }
    if (fileExist(cookieCache)) {
        headers["Cookie"] = fetch(cookieCache)
    }
    let html = request(mUrl, {
        headers: headers
    })
    if ((html.includes("登录跳转") && html.includes("异常请求")) || (html.includes("window.location.href") && html.includes("sec.douban"))) {
        return '被封ip';
    } else {
        let s = {
            qq: 1,
            youku: 3,
            letv: 6,
            mgtv: 7,
            bilibili: 8,
            iqiyi: 9,
            cntv: 12,
            cctv6: 13,
            miguvideo: 15,
            xigua: 17,
            acfun: 18,
            maiduidui: 19
        };
        let num = s[uid];

        var sources = {};
        let sl = html.match(/sources\[[1-9]{1,2}\][\s\S]*?\]/g);
        if (sl) {
            for (var i in sl) {
                eval(sl[i]);
            }
        } else {
            let script_list = parseDomForArray(html, 'body&&script[src]');
            let sources_url = "";
            for (let i in script_list) {
                let url = parseDomForHtml(script_list[i], 'script&&src');
                if (url.indexOf('mixed_static') !== -1) {
                    sources_url = url;
                }
            }
            let sources_list = request(sources_url).match(/sources\[[1-9]{1,2}\][\s\S]*?\]/g);
            for (var i in sources_list) {
                eval(sources_list[i]);
            }
        }

        let ren = sources[num];
        if (ren && ren.length > 0) {
            /*var r = ren.map(e => unescape(e.play_link.replace(/(https|http):\/\/www.douban.com\/link2\/\?url=/, '')
                .split(';')[0].split('.html')[0] + '.html'))*/
            var r = ren.map(e => unescape(e.play_link.split('?url=')[1].split('&')[0]))

        }
        return r || '没有收录';
    }
}