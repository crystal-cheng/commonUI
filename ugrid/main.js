define([
    'jquery',
    'text!module/ugrid/template.html',
    'css!module/ugrid/style.css',
    'uajax',
    'ubutton',
    'ucheckbox',
    'uselect',
    'uinput',
    'uspin'
],function($,template){
var old = $.fn.ugrid;

$.fn.ugrid = function (option) {
    var args = Array.prototype.slice.call(arguments, 1);
    var methodReturn;

    var $set = this.each(function () {
        var $this = $(this);
        var data = $this.data('ugrid');
        var options = typeof option === 'object' && option;

        if (!($this.hasClass('ugrid'))) $this.addClass('ugrid');
        if (!data) $this.data('ugrid', (data = new uGrid(this, options)));
        if (typeof option === 'string') methodReturn = data[option].apply(data, args);
    });

    return ( methodReturn === undefined ) ? $set : methodReturn;
};

$.fn.ugrid.Constructor = uGrid;

$.fn.ugrid.noConflict = function () {
    $.fn.ugrid = old;
    return this;
};
/*
 header:true/false
    是否展示表头
 pageShow:true/false
    是否展示分页信息。true表示展示，false表示不展示。默认true
 page:true/false
    是否由前端分页。true表示由前端分页，false表示由后台分页。默认true。
    前端分页请求返回数据格式：如{result:true,data:[]}
    后台分页请求返回数据格式：如{result:true,data:[],total:14}
 pageSize:10
    每页显示条数，默认为10条
 psarray:[10,15]
    表示可以选择的每页显示条数。
    默认值为[10,15]
 total:''
    此参数不建议初始化配置时传入。（传了也没什么用）
    表示数据的总条数。
    在以前端分页时，此数据会和data的长度始终一致。
    以后端分页时，会手动设置total的值，则可得到正确的分页数据。
 curPage:1
    表示当前页数。
    默认是第1页。
 class:''
    要为此表格加入的特殊样式class。
    默认为空，即不设置任何特殊样式。
 data:[]
    该表格要管理的数据。
    可写默认数据，若url存在且请求成功后，默认数据会被覆盖。
 sort:''
    值为parameter参数中对应的key值，表示以此列排序。
    若不传，会默认以parameter中的第一项key排序。
 checkbox:false/true
    是否支持多选，在表格第一列的每一行显示一个复选框。true表示支持。false表示不支持。默认为true。
    若为true，翻页和搜索都会清空选择项。
    若为false，被选择的某条数组用背景变色来表示。
 select:[0,1]
    存放被选中数据索引的数组。
    当选中某条数据后，该条数据的索引会被加入到select中进行管理。
    设置默认的select值，可实现一进入页面就默认选中的效果。
 loop:{time:5000}
    设置是否循环请求
    time 循环间隔时间
 listMode:fixed/auto
    fixed表示列表始终以40px的高度显示一行
    auto表示根据高度自动展示
 setting:true/false
    是否展示列表设置项
    true表示展示，默认false
 columnFixedNum:Number
    除了parameter中设定的固定列外，想要固定的列数
    如果不传，无fixed列则columnFixedNum默认为1；有fixed列则默认为0
 event:{add:function(e,data,that){},formatter:function(obj){},……}
    该参数存放表格中一些需要通过回调调用的自定义方法。
    主要有以下三类：
    1.control：表格上方操作按钮的回调方法。
    方法名为control参数中传入的action，若action不存在,方法名则为key值。
    如某个按钮key值为add，且没有设定action，则在event中传入add方法function(e,data,that),参数意义如下
        e:操作该按钮产生的事件对象。
        data:操作该按钮时，表格中被选中的数据。
        that:该表格的uGrid实例对象。
    2.search：表格上执行搜索操作后的回调方法。
    方法名为search参数中传入的action，若action不存在,会执行默认的搜索方法，不会去event中寻找对应key值。
    搜索方法的参数会传入设置search配置项时该条搜索所需的所有信息，加上搜索时的value。参数如下
    function(item)
    item = {
        key:搜索依赖的列key值
        value:搜索时传入的value值
        url:若需后台搜索配置search时，传入的url
        action:配置search时，传入的方法名action
        ……（更多参数待定）
    }
    3.formatter：生成表格时，对单元格重写调用的formatter方法。方法名就只叫formatter。参数如下
    function(obj)
    obj = {
        index:此条数据在data数组中的索引值
        key:该单元格对应的key值，即是所在列的key值
        value:该单元格的实际值
        item:此条数据
    }。
    其中对于由表格自动生存的operate操作一列的formatter，会多传入一个参数如下
    function(obj,item)
        obj和普通formatter方法一样
        item是设置operate配置项时传入的对应的条目（具体可参看operate参数说明）。
 *parameter:[{*key:'',*name:'',formatter:boolean||jQuery,ellipsis:true,hidden:true,fixed:false}]
    此参数项必填。
    表示表格显示的数据字段有哪些。
    key必填，与data中数据的key对应。
    name，表示表头显示文字。
    formatter可选，接收boolean或jquery对象。
        jquery对象：在拼接表格数据时，覆盖实际值被加到该单元格中。
        boolean值：为true表示使用event参数中的formatter方法，方法的返回值会被加入该单元格中。
        formatter方法入参如下formatter(obj)
        obj = {
            index:此条数据在data数组中的索引值
            key:该单元格对应的key值，即是所在列的key值
            value:该单元格的实际值
            item:此条数据
        }
    ellipsis 可选，设置为文字过长自动显示省略号并加上title
    hidden 可选,是否隐藏此列，true表示隐藏,默认为false
    fixed 可选，是否为固定列必须展示不可隐藏，true表示必须展示，默认false
    sort 可选，此列是否支持排序，默认为true，支持排序
    sortmode 可选，排序使用什么模式，number/默认模式,number会安数字大小来排序
    sortFormatter 可选，使用使用formatter后的数据来排序，默认使用原始值进行排序
 control:[{*key:'',text:'',icon:jQuery,class:'',action:''}]
    表示表格头部的按钮配置项。一条数据表示一个按钮。
    key值必填，代表此按钮的唯一标示。
    text选填，表示显示在按钮上的文字。若没有，会通过getDefaultKey方法获取对应key值存在的默认值。若默认值也没有，按钮上无文字信息。
    icon选填，表示按钮文字前加入的小图标。只接收jquery对象。若不存在，会通过getDefaultKey方法获取对应key值存在的默认图标。若默认图标也没有，按钮上无图标。
    class选填，为此按钮单独添加的class样式。
    action选填，表示点击该按钮会调用的方法名，会从event参数中获取。若不存在，则会从event中读取key值对应的方法。若key对应的方法也不存在，会提示no method。

 operate:[{*key:'',icon:jQuery,action:'',single:true/false,formatter:boolean/jquery/function(param,item){}}]
    表示在表格最后一列每一行的操作按钮。一条数据表示一个操作按钮。
    key值必填，代表此按钮的唯一标示。
    icon选填，表示代表该按钮的小图标。值接收jquery对象。若没有，会通过getDefaultKey方法获取对应key值存在的默认图标。若默认图标也没有，则什么都不显示。
    action选填，表示点击该按钮会调用的方法名，会从event参数中获取。若不存在，则会从event中读取key值对应的方法。若key对应的方法也不存在，会提示no method。
    single选填，为boolean值。若为true，表示鼠标放到该条数据上，此图标才会显示。若为false，表示此图标会一直显示。默认为false。
    formatter选填，可传boolean值，jquery对象或function。
        boolean：为true，会调用event中的formatter方法。接收两个参数(param,item)，请参照event中formatter的说明。为false，无操作。
        jquery：代表此操作的图标会顺序加入到单元格中。
        function:返回值会被顺序加入到单元各中。接收参数和formatter一样。
 search:[
    {
        type:'classic',
        param:[{*key:'',text:'',url:'',action}]
     },
     {
        type:'select',
        *key:'',
        param:[{*text:'',*value:'',url:'',action:''}]
     },
     {
        type:'union',
        *key:'name sex',
        text: '',
        url:'',
        action:''
     },
     {
        type:'mix',
        param:[{*key:'',text:'',url:'',action:''}]
     }
 ]
    该表格的搜索配置项。
    可多种搜索方式并存，但并存的搜索方式不会进行联合搜索。
    type表示不同的搜索方式，有三种：
        classic，经典搜索方式。输入值与某一列的表现值进行模糊匹配搜索，可在多个列之间切换。
            param为数组，一条数据代表以某一列来搜索。内部参数都只接收字符串。
                key值必填，与parameter中的key值对应。
                text选填，表示搜索时提示用户是以什么搜索的文字信息。若不填，会读取key对应parameter的name来显示。
                url选填，表示使用此项搜索时要向后台请求的路径。url不存在则会判断action是否存在。url存在时，action作为处理请求参数的方法，其返回值会被带入请求中。
                action选填，表示使用此项搜索时要调用的搜索方法名称，方法存在于event参数中。url不存在action存在ugrid不会自行做任何处理，调用action方法后就结束执行。action不存在则会调用默认搜索方法。
        select，下拉搜索方式。以某一列的实际值进行精确搜索。一个下拉搜索只对应一列。
            key必填，注意不存在param参数中。表示要被搜索的列对应parameter中的key值。
            param为数组，一条数据表示以该列的某一个值来搜索。内部参数都只接收字符串。
                text必填，表示以该值搜索时给用户的提示信息。
                value必填，表示要搜索的值是什么。只接收该列的实际值。
                url选填，与classic中的类似。
                action选填，与classic中的类似。
        union，单输入框搜索方式。输入值与多个列的表现值进行模糊匹配搜索。
            注意该搜索方式没有param参数。
            key值必填，表示要进行模糊搜索的多个列的key值，key值之间用空格分开。
            text选填，表示搜索时提示用户以什么搜索的文字信息。若不填，会读取key对应parameter的name来拼接提示，拼接成如"请输入xx或xx"。
            url选填，与classic中的类似。
            action选填，与classic中的类似。
        mix，经典搜索和单输入框搜索的结合。全部时，是单输入框的联合搜索。选择某一列时，是经典搜索。
        +--------------------------------------------------------------------------------------------+
        |action说明，不管何处调用action，都存在item和that参数。                                           |
        |   item中包含设定搜索参数时的某一条设置项的所有值，如{key:'',value:'',url:'',action:''}等          |
        |       其中value和key一定会存在,设置时不存在的插件会自动塞入.value表示当前要搜索的值                 |
        |   that则表示ugrid插件本身                                                                    |
        |   this根据当前触发事件的对象而定.                                                              |
        |当url存在时，action可作为设置请求参数的方法，其返回值会被带入请求中                                  |
        |   如可返回{url: 'xxxxx?key=xxx,data:{xxx:xxx}}等                                             |
        |   不是前端分页时，分页参数会自动带入，这里无需设置                                                 |
        |当url不存在，action作为触发搜索要调用的方法，ugrid不做任何处理，直接调用该方法                        |
        +---------------------------------------------------------------------------------------------+
 asyncFilter: {*data:'',*url:''}
    由后台搜索时用来存放搜索相关请求和数据的参数
 filter:[{*key:'',*value:'',mode:'text',pattern:'exact'}]
    用户查找数据时，进行过滤数据的条件。
    一条数据是一个过滤条件，在filterData中做一次过滤。
    key必填，表示要对哪一列的值进行过滤，与parameter中的key值对应。可时多列的key值，如果是多个key值，key值间用空格分开。
    value必填，表示对此列数据要匹配的值。
    mode选填，表示查询依据的数据是data中实际的数据还是表格上显示的数据(一些单元格经过formatter处理后的text)。
        值为'text':表示与formatter的数据匹配。
        值为'value':表示与data中的实际值匹配。
        默认为value。
    pattern选填，表示是精确查找还是模糊匹配。精确查找即value与要查找数据全等。
        值为'exact'，表示精确查找。
        其他任意值，表示模糊匹配。(更多值待定)
        默认不是'exact'。
 fixedFilter:和filter一样，但即使时clearSearch都不会把此条过滤条件清空
 complete:function()
    在向后台请求数据前，表格完全生成后会调用的回调方法。
    不传入任何参数，使用该方法时，this是此表格的uGrid实例。
 serveComplete:function()
    在每次向后台请求数据成功后调用的回调方法。
    不传入任何参数，使用该方法时，this是此表格的uGrid实例。

 下面是一些完全由ugrid本身控制的参数，不需要传入也最好不要手动修改。
 key:为数组，按parameter顺序存放的parameter的key值。
 index:为数组，存放实际会显示的数据在data中的索引。
 */
var uGrid = function (ele, opt) {
    if(typeof opt !== 'object'){
        console.log("param is not right!");
        return {};
    }
    var option = {
        pageSize: 10,
        psarray:[10,15],
        total: 0,
        curPage: 1,
        page: true,
        pageShow : true,
        header : true,
        key: [],
        data: [],
        filter: [],
        fixedFilter: [],
        asyncFilter: null,
        select: [],
        control: [],
        operate: [],
        search: [],
        event: {},
        reqFlag: false,
        loop:{
            time: 0
        },
        setting: false,
        version: '2.0',
        listMode: 'fixed',//fixed,auto
        refreshAnimate: true,
        title: null
    };
    this.element = $(ele);
    if (opt.psarray) {
        option.psarray = opt.psarray
    }
    this.option = $.extend(true, option, opt);
    this.init();
}
uGrid.prototype = {
    constructor: uGrid,
    /**
     * 初始化方法
     */
    init: function () {
        this.setDom();
        this.setEvent();
    },
    /**
     * 当想改变配置项时，可以调用此方法。相当于重新生成一边表格。
     * @param option 和调用ugrid方法传入的配置项一样。
     */
    setOption: function (option) {
        this.option = $.extend(true, this.option, option);
        this.element.empty();
        this.setDom();
    },
    setDom: function(option){
        this.setStaticHtml();
        this.setClass();

        this.setOperate();
        this.setKey();

        this.setTitle();
        this.setControl();
        this.setSearch();

        this.filter();

        this.setHead();

        this.initSort();

        this.setPage();
        this.setBody();

        this.setFixedHead();

        this.setSetting();

        this.setPageDown();
        this.setPageSizeDown();

        this.refreshControl();

        this.option.loop && this.setLoop();

        if (this.option.complete) {
            this.option.complete.call(this);
        }
        $.ui18n(this.element);
        if (this.option.url) {
            if(typeof this.option.url === 'string'){
                this.option.url = {url:this.option.url};
            }
        }else{
            this.option.url = {url:''};
        }
        if(this.option.url.url){
            this.getServeData();
        }
    },
    setEvent: function(){
        this.defClassicSearchEvent();
        this.addScaleEvent('click',this.defScaleEvent);
        this.defPageEvent();

        this.addControlEvent('click', this.defControlEvent);
        this.addOperateEvent('click', this.defOperateEvent);
        this.addSortEvent('click', this.defSortEvent);

        this.addCheckEvent('click', this.defCheckEvent);
        //this.addSelectEvent('click', this.defSelectEvent);
        this.addCheckBoxEvent('click',this.defCheckBoxEvent);
        this.addMoreEvent('click',function(e,that){
            var $li = $(e.target).parents('li');
            that.element.find('.ugrid_response').css({
                left: $li.position().left,
                top: 34
            }).toggle();
        });

        $('body').on('click', function (e) {
            $('.ugrid .list').hide();

            if(!($(e.target).parents('.response_icon').length>0||$(e.target).hasClass('response_icon'))){
                $('.ugrid .ugrid_response').hide().removeAttr('style');
            }
            e.stopPropagation();
        });
    },
    /**
     * 向后台请求数据的方法
     * @param param 发送ajax请求的配置参数
     */
    getServeData: function (param,refreshMode) {
        this.setCheckAll(false);
        var that = this;
        var asyncFilter = that.asyncFilter;
        //如果是后台分页，需要传入当前页和每页显示条数
        var pageurl = 'pn=' + (this.option.curPage < 1 ? 1 : this.option.curPage) + '&ps=' + this.option.pageSize;
        var url = asyncFilter && asyncFilter.url ? asyncFilter.url : that.option.url.url;
        url = this.option.page ? url : (url + (url.indexOf('?') > -1 ? '&' : '?') + pageurl);
        var data = {};
        data = asyncFilter && asyncFilter.data ? asyncFilter.data : this.option.serveParam && this.option.serveParam.call(this);
        var error = this.option.url.error;
        this.option.url.error = function(e){
            that.element.find('.table .tr').remove();
            that.element.find('.nodata').show();
            that.clearTimer();
            error && error.call(this,e);
        }
        param = $.extend(true, {
            type: 'GET',
            dataType: 'json',
            beforeSend:function(){
                that.option.reqFlag = true;
                if(that.option.refreshAnimate){
                    that.element.find('.table .tr').remove();
                    that.element.find('.loadimg').show();
                    that.element.find('.nodata').hide();
                }
            },
            success: function (msg) {
                if(!that.option.refreshAnimate && that.option.select.length>0){
                    return;
                }
                if(!(msg.data instanceof Array)){
                    that.element.find('.nodata').show();
                    return;
                }
                that.element.find('.loadimg').hide();
                that.option.data = msg.data;
                !that.option.page?that.option.total = (msg.total?msg.total:msg.data.length):'';

                refreshMode?that[refreshMode]():that.clearRefresh();
                //需要重新设置页码的下拉选项
                //that.setPageDown();
                if (that.option.serveComplete) {
                    that.option.serveComplete.call(that, msg);
                }
                if(msg.data instanceof Array){
                    if(msg.data.length <=5){
                        that.element.find('.page').hide();
                    }else {
                        that.element.find('.page').show();
                    }
                }
            },
            error:function(){
                that.element.find('.table .tr').remove();
                that.element.find('.nodata').show();
                that.clearTimer();
            },
            complete:function(){
                that.option.reqFlag = false;
                that.option.refreshAnimate = true;
                that.element.find('.loadimg').hide();
            }
        },this.option.url,{url: url, data: data}, param);
        !this.option.reqFlag && $.uajax(param,true);
    },
    /**
     * 获取到静态的html结构。建议不要手动调用。
     */
    setStaticHtml: function () {
        this.element.append($(template).children().clone());
        switch(this.option.version){
            case '1.0':
                break;
            case '2.0':
                //操作的按钮默认为无边框
                for(var i in this.option.control) this.option.control[i].border = false;

                this.element.addClass('version_2');
                this.element.find('header').prepend('<span class="title"></span>');
                //this.element.find('.container').prepend(this.element.find('.search'));
                break;
        }
        switch(this.option.listMode){
            case 'auto':
                this.element.addClass('listauto');
                break;
            case 'fixed':
            default :
                break;
        }
    },
    setTitle:function (title) {
        title = title || this.option.title;
        if(typeof title === 'string'){
            this.element.find('.title').html(title);
        }else{
            this.element.find('.title').remove();
        }
    },
    /**
     * 设置表格的特殊样式。
     */
    setClass: function () {
        this.element.addClass(this.option.class);
    },
    /**
     * 将operate的配置加入到parameter中。生成表格时按常规列实现。
     */
    setOperate: function () {
        var operate = this.option.operate;
        if (operate.length > 0) {
            var param = {key: 'operate', name: $.ui18n('ugrid_tips _operate')||'操作', sort: false, formatter: this.defOperateHtml}
            this.option.parameter.push(param);
        }
    },
    /**
     * 将operate加入parameter时，配置的默认formatter方法。
     * @param param 在parameter中加入的最后以项，operate项
     * @returns {*|jQuery} 返回formatter生成的对象
     */
    defOperateHtml: function (param) {
        var operate = this.option.operate;
        var div = $('<div></div>')
            .addClass('operate')
            .data('ugrid-param', param);
        //循环将小图标加入到div中
        for (var i in operate) {
            var item = operate[i];
            var obj;
            if (item.formatter) {
                //调用operate中配置的formatter方法
                obj = this.getFormatter(item.formatter, param, item);
            } else {
                obj = $('<span></span>')
                    .addClass(item.single ? 'single' : '')
                    .append(item.icon ? item.icon : this.getDefaultKey(item.key, 'icon'));
                    //.append(item.sign ? item.sign : this.getDefaultKey(item.key, 'sign'));
            }
            obj ? obj.attr('data-ugrid-key', item.key)
                .attr('data-ugrid-action', item.action)
                .appendTo(div) : '';
        }
        return div;
    },
    /**
     * 顺序保存parameter中的key于数组中。此顺序始终与parameter中的保持一直。
     * 此方法不建议手动调用。
     * @param key 可传入新的key值顺序。
     */
    setKey: function (key) {
        if (key) {
            this.option.key = key;
        } else {
            this.option.key = [];
            var param = this.option.parameter;
            for (var i = 0; i < param.length; i++) {
                this.option.key.push(param[i].key);
            }
        }
    },
    /**
     * 生成表格头部上方的按钮
     */
    setControl: function () {
        var control = this.option.control;
        var ul = this.element.find('.control').empty();
        if (control.length <= 0) return;

        // 低分辨率最大同时出现按钮数目
		var max_icons = 3;
        this.max_icons = max_icons;

        for (var i in control) {
            var item = control[i];
            /*var btn = $('<button class="ubtn"></button>')
                .addClass(item.class ? item.class : '')
                .attr('data-ugrid-key', item.key)
                .attr('data-ugrid-action', item.action)
                .append(item.icon ? item.icon : this.getDefaultKey(item.key, 'icon'))
                .append(item.text ? item.text : this.getDefaultKey(item.key, 'text'));*/
            item.icon ? '' :item.icon = this.getDefaultKey(item.key, 'icon');
            item.text ? '' :item.text = this.getDefaultKey(item.key, 'text');
            //保存此按钮的key和方法名
            var btn = $.ubutton(item).attr('data-ugrid-action', item.action).attr('data-ugrid-key', item.key);
            $('<li></li>').append(btn).appendTo(ul);
        }
        $('<li class="response_icon"></li>').append('<button type="button" class="ubtn uqdm_ubtn" ><i class="fa ugrid_icon ugrid_icon_more aicon"></i><span>更多操作</span></button>').appendTo(ul);
        $('<li class="ugrid_response"><ul></ul></li>')
            .appendTo(ul);
    },
    /**
     * 更新control的展示样式
     */
    refreshControl: function(){
        var ul = this.element.find('.control'),
            buttons = ul.find('button[data-ugrid-key]'),
            moredown = ul.find('.ugrid_response');
        var pw = ul.width(),cw = 0,count = 0,flag = false;
        moredown.addClass('stealth');
        for(;count<buttons.length;count++){
            cw += $(buttons[count]).parent().width();
            if(cw>=pw){
                count = count -1;
                flag = true;
                break;
            }
        }
        moredown.removeClass('stealth');
        ul.find('.response_icon')[flag?'addClass':'removeClass']('show');
        for(var i = 0;i<buttons.length;i++){
            if(flag&&i>=count){
                moredown.find('ul').append($(buttons[i]).parent());
            }else{
                ul.find('.response_icon').before($(buttons[i]).parent());
            }
        }
    },
    /**
     * 生成头部上方的搜索项
     */
    setSearch: function () {
        var search = this.option.search;
        if (search.length > 0) {
            for (var i in search) {
                var item = search[i];
                //根据类型生成不同的搜索项
                switch(item.type){
                    case 'union':
                        this.setInputSearch(i);
                        break;
                    case  'select':
                        this.setSelectSearch(i);
                        break;
                    case 'classic':
                        this.setClassicSearch(i);
                        break;
                    case 'mix':
                        this.setMixSearch(i);
                        break;
                    default:
                        break;
                }

            }

        } else {
            this.element.find('.search').remove();
        }
    },
    setMixSearch:function (index) {
        var mSearch = $('<div class="mix"></div>')
            .appendTo(this.element.find('.search'))
            .data('ugrid-sear',index);
        var param = this.option.search[index].param;
        //循环生成下拉框所需参数
        var data = [{text:'全部',value:'all'}];
        for(var i in param){
            var pi = this.getParameterItemByKey(param[i].key);
            if(pi == -1) continue;
            var text = param[i].text || (pi != -1 ? pi.name : '');
            data.push({text:text,value:i});
        }
        var btn = $.ubutton({
            type:'select',
            text:data[0].text,
            value:data[0].value
        }).appendTo(mSearch);
        var that = this;
        var input = $.uinput({
            placeholder:"请输入关键字",
            icon:'fa fa-search',
            size:{height:'30px'}
        }).appendTo(mSearch).on('keyup','.input',function(e){
            if (e.which !== 13) {
                return;
            }
            var mix = $(this).closest('.mix');
            that.defMixSearchEvent(mix,that);
            /*var v = mix.find('.uselect').uselect('getSelected').value,
                value = mix.children('.uinput').uinput('getText');
            if(v == 'all'){
                var items = that.option.parameter;
                var item = {};
                item.key = '';
                for(var i in items){
                    item.key += items[i].key + ' ';
                }
                item.key = item.key.trim();
                item.value = value;
                //设置此类搜索是根据表格显示的值来搜索
                item.mode = "text";
                that.clearSearch(mix.siblings());
                that.search([item]);
            }else{
                var indexSear = mix.data('ugridSear');
                var items = that.option.search[indexSear].param;
                var item = items[v];
                item.value = value;
                //设置此类搜索是根据表格显示的值来搜索
                item.mode = "text";
                that.clearSearch(mix.siblings());
                that.search([item]);
            }*/
        });
        var select = $.uselect({
            target:btn,
            data:data,
            type:"button",
            dropDown:{
                location: 'centre',
                orient: "auto"
            }
        }).on('changed',function(e,data,ts){
            $(this).closest('.mix')
                .find('.uinput').uinput('setText','')
                .find('input').focus();
            $(this).closest('.ugrid').ugrid('refreshControl').ugrid('clearAsyncFilter');

        });
    },
    /**
     * mix模式的搜索方法
     * @param mix
     * @param that
     */
    defMixSearchEvent: function(mix,that){
        var v = mix.find('.uselect').uselect('getSelected').value,
            value = mix.children('.uinput').uinput('getText'),
            item = {};
        if(v == 'all'){
            var items = that.option.parameter;
            item = {};
            item.key = '';
            for(var i in items){
                item.key += items[i].key + ' ';
            }
            item.key = item.key.trim();
        }else{
            var indexSear = mix.data('ugridSear');
            var items = that.option.search[indexSear].param;
            item = items[v];
        }
        item.value = value;
        //设置此类搜索是根据表格显示的值来搜索
        item.mode = "text";
        that.clearSearch(mix.siblings());
        //that.search([item]);
        if(item.url){
            that.asyncSearch(item);
        }else if(item.action){
            that.getRealAction(item.action).call(this,item,that);
        }else{
            that.search([item]);
        }
    },
    /**
     * 生成联合搜索项。如名称和ip同时搜索。
     * @param index 此搜索项在search参数中的索引值。
     */
    setInputSearch: function(index){
        var oSearch = this.element.find('.search');
        var input = $('<div></div>')
            .addClass('union')
            .data('ugrid-sear',index)
            .appendTo(oSearch);
        var inputSear = this.option.search[index];
        //如果搜索的提示信息不存在，则通过key值在parameter中对应的name拼接提示信息
        if(!inputSear.text){
            inputSear.text = '请输入';
            var keys = inputSear.key.split(' ');
            for(var i in keys){
                var key = keys[i];
                var pi = this.getParameterItemByKey(key);
                inputSear.text += pi != -1 ? (pi.name +' '): '';
            }
            inputSear.text.substring(0,inputSear.text.length - 1);
        }
        var that = this;
        $.uinput({
            placeholder:inputSear.text,
            icon:'fa fa-search',
            size:{height:'30px'}
        }).appendTo(input).on('keyup','.input',function(e){
            if (e.which != 13) {
                return;
            }
            var union = $(this).closest('.union');
            var indexSear = union.data('ugridSear');
            var item = that.option.search[indexSear];
            item.value = $(this).val();
            //设置此类搜索是根据表格显示的值来搜索
            item.mode = "text";
            that.clearSearch(union.siblings());
            //that.search([item]);
            if(item.url){
                that.asyncSearch(item);
            }else if(item.action){
                that.getRealAction(item.action).call(this,item,that);
            }else{
                that.search([item]);
            }
        });
    },
    /**
     * 生成下拉过滤的搜索项。如根据状态搜索。
     * @param index 此搜索项在search参数中的索引值。
     */
    setSelectSearch: function(index){
        var oSearch = this.element.find('.search');
        var select = $('<div></div>')
            .addClass('select')
            .data('ugrid-sear',index)
            .appendTo(oSearch);
        var param = this.option.search[index].param;

        //循环生成下拉框所需参数
        var data = [];
        for(var i in param){
            data.push({text:param[i].text,value:i});
        }
        var btn = $.ubutton({
            type:'select',
            text:data[0].text
        }).appendTo(select);
        var that = this;
        $.uselect({
            target:btn,
            data:data,
            type:"button",
            dropDown:{
                location: 'right',
                orient: "auto",
            }
        }).on('changed',function(e,data,ts){
            ts.$target.ubutton('setText',data.text);
            var select = ts.$target.closest('.select');
            var searIndex = select.data('ugridSear');
            var searItem = that.option.search[searIndex];
            var i = data.value;
            var item = searItem.param[i];
            item.key = searItem.key;
            //设置此类搜索时精确搜索
            item.pattern = 'exact';
            that.clearSearch(select.siblings());
            if(item.url){
                if(item.value=='all'){
                    this.asyncFilter = {}
                    that.getServeData();
                }else{
                    that.asyncSearch(item);
                }
            }else if(item.action){
                that.getRealAction(item.action).call(this,item,that);
            }else{
                item.value=='all'?that.search():that.search([item]);
            }
        });
    },
    /**
     * 生成经典搜索方式。如值根据名称进行模糊搜索和值根据ip进行模糊搜索。
     * @param index 此搜索项在search参数中的索引值。
     */
    setClassicSearch: function(index){
        var oSearch = this.element.find('.search');
        var classic = oSearch.find('.classic').data('ugrid-sear',index);
        var ul = classic.find('ul').empty();
        var param = this.option.search[index].param;
        for(var i in param){
            var item = param[i];
            //若text不存在，读取key值在parameter中对应的name来显示
            if (!item.text) {
                var pi = this.getParameterItemByKey(item.key);
                item.text = pi != -1 ? pi.name : '';
            }
            $('<li></li>')
                .attr('data-ugrid-key', i)
                .html(item.text)
                .appendTo(ul);
        }
        classic.appendTo(oSearch).show();
        this.defClassicSearCondEvent.call(ul.find('li:eq(0)'), null, this);
    },
    /**
     * 根据参数后去相应的方法
     * @param action
     * @returns {*}
     */
    getRealAction: function(action){
        if(this.isFunction(action)) return action;
        if(this.isString(action)) {
            var fun = this.option.event[action];
            if(!fun) {
                fun = function(){};
                console.log('还没写'+action+"方法");
            }
            return fun;
        }
    },
    /**
     * 生成单个复选框
     * @returns {*|jQuery} 返回一个包含复选框的jquery对象
     */
    genCheckbox: function () {
        /*var checkbox = $('<div></div>')
            .addClass('checkbox')
            .append('<i class="fa fa-check"></i>');*/
        var checkbox = $.ucheckbox({name:"ugrid_checkbox"});
        return $('<li></li>')
            .addClass('td')
            .css('width', '12px')
            .append(checkbox);
    },
    /**
     * 生成表格头部信息
     */
    setHead: function () {
        if(!this.option.header) {
            this.element.find('.table').find('.head').remove();
            return;
        }
        var table = this.element.find('.table');
        var head = table.find('.head').empty();
        if (head.length == 0) {
            head = $('<ul></ul>').addClass('head').prependTo(table);
        }
        if (this.option.checkbox) {
            head.append(this.genCheckbox());
        }
        var hasFixed = false;
        var param = this.option.parameter;
        var sort = $('<span class="sort"></span>');
        for (var i = 0; i < param.length; i++) {
            if(!param[i].fixed && param[i].hidden) continue;
            if(param[i].fixed){
                hasFixed = true;
            }
            var headcell = $('<li></li>')
                .addClass('td')
                .text(param[i].name)
                .attr('data-ugrid-key', param[i].key)
                .appendTo(head);
            //如果此列设置列不可排序，则不加入sort标记
            if (!(param[i].sort === false)) {
                headcell.prepend(sort.clone());
            }
        }
        if(this.option.columnFixedNum===undefined || this.option.columnFixedNum === 0){
            this.option.columnFixedNum = hasFixed ? 0 : 1;
        }
        var fixed_head = this.element.find('.fixed_head');
        fixed_head.append(head.clone());
        head.find('li').each(function(i,e){
            fixed_head.find('li:eq('+i+')').width($(this).width());
        });
    },
    /**
     * 设置固定的表头
     */
    setFixedHead: function(){
        var head = this.element.find('.table .head');
        var fixed_head = this.element.find('.fixed_head').empty();
        fixed_head.append(head.clone(true));
        head.find('li').each(function(i,e){
            fixed_head.find('li:eq('+i+')').width($(this).width());
        });
    },
    /**
     * 设置设置项
     */
    setSetting: function(){
        if(!this.option.setting) return;
        var setting = $('<span class="ugrid_setting"><i class="fa fa-angle-down"></i></span>').insertBefore(this.element.find('.table_wrap'));
        var data = [],checkedNum = 0;
        this.option.parameter.forEach(function(e,i){
            var checked = e['fixed'] || !e['hidden'];
            if(!e['fixed']){
                checked && checkedNum++;
                data.push({text: e.name,value:i,checked:checked});
            }
        });
        var that = this;
        var umul = $.umultiple({
            target: setting,
            data: data,
            dropDown:{
                orient:'auto',
                location: 'right'
            }
        }).on('changed',function(e,data,ts){
            var ucheckbox = ts.$element.find(".ucheckbox[checked]")
            ucheckbox.ucheckbox('setDisabled',data.length <= that.option.columnFixedNum);
        }).on('click','dd',function(e){
            var info = $(this).find('.ucheckbox').ucheckbox('getInfo');
            that.option.parameter[info.value]['hidden'] = !info.checked;
            that.columnRefresh();
        });

        if(checkedNum <= this.option.columnFixedNum){
            umul.find(".ucheckbox[checked]").ucheckbox('setDisabled',true);
        }
    },
    /**
     * 设置论寻请求
     */
    setLoop:function(){

        if(this.option.url && this.option.url.url && this.option.loop && parseInt(this.option.loop.time) > 200){
            var that = this;
            this.option.loop.timer = setInterval(function(){
                if(that.option.select.length>0) return;
                that.option.refreshAnimate = false;
                that.option.url.url?that.getServeData({},'filterRefresh'):that.filterRefresh();
            },this.option.loop.time);
        }
    },
    clearTimer: function(){
        if(this.option.loop.timer){
            clearInterval(this.option.loop.timer);
            this.option.loop.timer = null;
        }
    },
    /**
     * 初始化排序信息
     * 以this.option.sort指定的列排序数据，若不存在，则以第一列排序
     */
    initSort: function () {
        //this.option.sort = this.option.sort || this.option.key[0];
        if(this.option.sort){
            this.sortData(this.option.sort);
            this.setSort();
        }
    },
    setSort: function(){
        var sort = this.element.find('.head .td[data-ugrid-key=' + this.option.sort + ']');
        sort.addClass('sorted').find('.sort')[this.option.switch?'addClass':'removeClass']('switch');
        sort.siblings().removeClass('sorted');
    },
    /**
     * 生成表格主体部分
     */
    setBody: function () {
        var table = this.element.find('.table');
        table.find('.tr').remove();
        var index = this.option.index;
        if (index.length > 0) {
            this.element.find('.nodata').hide();
            this.option.pageShow && this.element.find('.page').show();
            var start = 0,end = 0;
            //若是前端分页，条数的开始位置和结束位置由前端计算得出。若是后台分页，条数开始和结束位置始终是0到最后。
            if(this.option.page){
                var param = this.getPageParam();
                start = param.start - 1;
                end = param.end;
            }else{
                start = 0;
                end = index.length;
            }
            for (var i = start; i < end; i++) {
                var key = index[i];
                var item = this.option.data[key];
                this.addItem(key, item).attr('data-ugrid-index', i);
            }
        } else {
            this.element.find('.nodata').show();
            this.element.find('.page').hide();
        }
    },
    /**
     * 生成表格主体的每一条数据项
     * @param index 此条数据在data中的索引值
     * @param item 此条数据
     * @returns {*|jQuery} 返回此条数据对应的jquery对象
     */
    addItem: function (index, item) {
        var table = this.element.find('.table');
        var ul = $('<ul></ul>').addClass('tr')
            .attr('data-ugrid-key', index).appendTo(table);
        //如果支持多选，生存复选框
        if (this.option.checkbox) {
            ul.append(this.genCheckbox());
        }
        var key = this.option.key;
        //循环读取key值对应数据
        for (var i in key) {
            var paramItem = this.option.parameter[i];
            if(!paramItem.fixed && paramItem.hidden) continue;
            var li = $('<li></li>')
                .addClass('td')
                .attr('data-ugrid-key', key[i])
                .text('' || item[key[i]])
                .appendTo(ul);
            //若formatter存在，加入formatter的返回值
            var formatter = paramItem.formatter;
            var text = item[key[i]];
            if (formatter) {
                var param = {
                    index: index,
                    key: key[i],
                    value: item[key[i]],
                    item: item
                }
                li.text('').append(text = this.getFormatter(formatter, param));
                if(text instanceof jQuery){
                    text = text.text();
                }
            }
            if(this.option.parameter[i].ellipsis){
                li.addClass('ellipsis').attr('title',text);
                //this.setCopy(li,text);
            }
            if(!li.html()) li.html('<span class="blank">—</span>');
        }
        return ul;
    },
    setCopy: function($obj,text){
        $obj.append('<input class="copyInput" value="'+text+'"/>');
        var that = this;
        $obj.on('dblclick',function(e){
            $(this).find('input.copyInput').select();
            document.execCommand('copy');
            //that.setCopyTip(e);
        })
    },
    setCopyTip: function(e){
        var obj = $(e.target);
        $('<span class="copyTip">已复制</span>').appendTo(obj);
        setTimeout(function(){obj.find('.copyTip').addClass('show')},50);
        setTimeout(function(){
            obj.find('.copyTip').removeClass('show');
            setTimeout(function(){
                obj.find('.copyTip').remove();
            },500);
        },700);
    },
    setCopyButton: function(text){
         return btn = $('<button></button>')
             .addClass('copyButton')
             .on('click',function(e){
                 window.clipboardData.setData("Text",text);
                 $.uspin({content:'复制成功'});
             });
    },
    /**
     * 通过key值，获取parameter中对应配置的条目
     * @param key
     * @returns {*}
     */
    getParameterItemByKey: function (key) {
        var index = this.option.key.indexOf(key);
        return index!=-1?this.option.parameter[index]:index;
    },
    /**
     * 调用formatter方法，并返回formatter方法的返回值
     * @param formatter parameter或operate中配置的formatter参数
     * @param param 此单元格对应的所有信息,即index,key,value,item
     * @param item operate参数的formatter方法会传入，为operate的配置条目
     * @returns {string} 返回一个jquery对象
     */
    getFormatter: function (formatter, param, item) {
        var obj = '';
        if (formatter) {
            var fun;
            if (typeof formatter == 'boolean') {
                fun = this.option.event['formatter'];
            } else if (typeof formatter == 'string') {
                fun = this.option.event[formatter];
            } else if (typeof formatter == 'function') {
                fun = formatter;
            }
            obj = fun ? fun.call(this, param, item) : obj;
        }
        return obj;
    },
    /**
     * 设置表格分页部分的信息
     */
    setPage: function () {
        //如果时后台分页，不改变total的值
       !this.option.page?'':this.option.total = this.option.index.length;
        var page = this.element.find('.page');
        var param = this.getPageParam();
        page.find('.start').html(param.start);
        page.find('.end').html(param.end);
        page.find('.total').html(this.toThousands(param.total));
        page.find('.cur').val(param.cur)&&page.find('.cur').html(param.cur);
        page.find('.num').html(param.num);
        !this.option.pageShow && page.hide();
    },
    /**
     * 三分数字
     * @param num
     * @returns {string}
     */
    toThousands: function(num) {
        var num = (num || 0).toString(), result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        return result;
    },
    /**
     * 生成可选择每页显示条数的下拉框
     */
    setPageSizeDown: function(){
        var btn = $.ubutton({
            type: 'select',
            class: 'pageSizeDown',
            text: 10
        });
        this.element.find('.paging .pageSizeDown').replaceWith(btn);
        var data = [];
        for(var i in this.option.psarray){
            var item = this.option.psarray[i];
            data.push({text:item,value:item});
        }
        var that = this;
        $.uselect({
            target:btn,
            data:data,
            type:"button",
            arrow:{
                orient:'up'
            }
        }).on('changed',function(e,data,ts){
            ts.$target.ubutton('setText',data.text);
            that.option.pageSize = parseInt(data.value,10);
            that.option.page?that.refresh():that.asyncFilterRefresh();
        });
    },
    /**
     * 生成选择页码的下拉框
     */
    setPageDown: function(){
        var data = [];
        for(var i=1;i<=this.getPageParam().num;i++){
            data.push({text:i,value:i});
        }
        var that = this;
        var target = this.element.find('.paging .pageDown');
        var uselect = target.next('.uselect');
        if(uselect.length===0){
            data.length>0?$.uselect({
                target:target,
                data: data,
                arrow:{
                    orient:'up'
                }
            }).on('changed',function(e,data,ts){
                ts.$target.find('.cur').html(data.text);
                that.option.curPage = parseInt(data.text,10);
                that.option.page?that.refresh():that.asyncRefresh();
            }):'';
        }else{
            data.length>0 && uselect.uselect('replaceItems',data);
        }
    },
    /**
     * 获取当前的分页信息
     * @returns {{start: number, end: number, total: *, cur: (Number|*), num: *}} 返回当前分页信息的对象
     *  start：开始条数
     *  end：结束条数
     *  total：总条数
     *  cur：当前页码
     *  num：总页码
     */
    getPageParam: function () {
        var size = this.option.pageSize;
        var total = this.option.total;
        var cur = this.option.curPage;

        if(size==0){
            size = total;
        }

        var dev = parseInt(total / size);
        var num = total % size > 0 ? (dev + 1) : dev;
        if (cur > num) {
            cur = num;
            this.option.curPage = cur;
        } else if (cur < 1) {
            cur = 1;
            this.option.curPage = 1;
        }
        var start = cur == 0 ? 0 : ((cur - 1) * size + 1);
        var end = cur * size > total ? total : cur * size;
        return {start: start, end: end, total: total, cur: cur, num: num};
    },
    setCheckAll: function(flag){
        //this.element.find('.table .head').find('.ucheckbox').ucheckbox('setChecked',flag);
        this.element.find('.head').find('.ucheckbox').ucheckbox('setChecked',flag);
        //this.setFixedHead();
    },
    /**
     * 在指定索引位置加入一条parameter数据，即加入一列
     * @param item 要加入的数据
     * @param index 要加入的位置。不传默认加入末尾。
     */
    addParameter: function (item, index) {
        var len = this.option.parameter.length;
        if (undefined == index || null == index) {
            index = len - 1;
        }
        index = parseInt(index);
        this.option.parameter.splice(index, 0, item);
        this.setKey();
    },
    /**
     * 为表格添加数据。若是从后台请求得到数据，一般不会用到此方法。
     * @param data 要添加的数据
     */
    addData: function (data) {
        this.option.data = this.option.data.concat(data);
        this.filterRefresh();
    },
    /**
     * 删除指定索引的数据，索引与data中的对应。可同时删除多条。
     * @param index 索引信息构成的数组
     */
    delData: function (index) {
        if (index instanceof Array) {
            var i = 0;
            while (i < index.length) {
                var ind = parseInt(index[i]);
                this.option.data.splice(ind, 1);
            }
        } else {
            var ind = parseInt(index);
            this.option.data.splice(ind, 1);
        }
        this.filterRefresh();
    },
    /**
     * 获取当前表格管理的数据。
     * @returns {*} 返回所有数据。
     */
    getData: function () {
        return this.option.data;
    },
    /**
     * 在指定位置添加parameter数据，可同时添加多条。
     * @param param 数据，要添加的数据构成的数据
     * @param index 相对与parameter的单个索引值
     */
    addColumn: function (param, index) {
        for (var p in param) {
            this.addParameter(param[p], index);
            index++;
        }
        this.columnRefresh();
    },
    /**
     * 根据key值删除某一列。
     * @param key 要删除的列的key值。
     */
    delColumn: function (key) {
        if (key instanceof Array) {
            var i = 0;
            while (i < key.length) {
                var k = key[i];
                var index = this.option.key.indexOf(k);
                this.option.parameter.splice(index, 1);
            }
        } else {
            var index = this.option.key.indexOf(key);
            this.option.parameter.splice(index, 1);
        }
        this.setKey();
        this.setHead();
        this.setBody();
    },
    /**
     * 替换所有的列。
     * @param param 替换用的数据，与parameter结构一样
     */
    replaceColumn: function (param) {
        this.option.parameter = param;
        this.setKey();
        this.columnRefresh();
    },
    /**
     * 替换所有的操作。
     * @param param 替换用的数据，与control结构一样
     */
    replaceControl: function (param) {
        this.option.control = param;
        if(this.option.version=='2.0') for(var i in this.option.control) this.option.control[i].border = false;
        this.setControl();
        this.refreshControl();
    },
    /**
     * 对指定列进行排序。
     * @param key 要排序的列的key值。
     */
    sortData: function (key) {
        if(!key) return;

        var paramItem = this.getParameterItemByKey(key),mode,format;
        mode = paramItem ? paramItem.sortmode:'';
        format = paramItem ? paramItem.sortFormatter : '';

        var data = this.option.data;
        var index = this.option.index;
        var len = index.length;

        for (var i = 0; i < len; i++) {
            var ind1 = index[i];
            for (var j = i + 1; j < len; j++) {
                var ind2 = index[j];

                var temp1 = data[ind1][key]||'',
                    temp2 = data[ind2][key]||'';

                if(format){
                    temp1 = this.getFormatter(paramItem.formatter, {
                        index: i,
                        key: key,
                        value: data[ind1][key],
                        item: data[ind1]
                    });
                    temp1 instanceof jQuery ? temp1 = temp1.text() : temp1;
                    temp2 = this.getFormatter(paramItem.formatter, {
                        index: j,
                        key: key,
                        value: data[ind2][key],
                        item: data[ind2]
                    });
                    temp2 instanceof jQuery ? temp2 = temp2.text() : temp2;
                }


                var flag = true;

                switch(mode){
                    case 'integer':
                        var integer1 = temp1.toString().match(/\d+/g);
                        var integer2 = temp2.toString().match(/\d+/g);
                        if(integer1 && integer2){
                            integer1 = integer1[integer1.length-1];
                            integer2 = integer2[integer2.length-1];
                            flag = parseInt(integer1,10) > parseInt(integer2,10);
                        }else{
                            flag = temp1.toString().localeCompare(temp2.toString()) > 0;
                        }
                        break;
                    default :
                        flag = temp1.toString().localeCompare(temp2.toString()) > 0;
                        break;
                }
                if(undefined === temp1 || null === temp1 || temp1.toString() === ''){
                    flag = true;
                }
                if(undefined === temp2 || null === temp2 || temp2.toString() === ''){
                    flag = false;
                }
                if (flag) {
                    index[i] = ind2;
                    index[j] = ind1;
                    ind1 = index[i];
                }
            }
        }
        if(this.option.switch){
            index.reverse();
        }
    },
    /**
     * 为ugrid内部元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param selector 添加事件作用的元素
     * @param fun 为事件添加的方法
     */
    addEvent: function (event, selector, fun) {
        var that = this;
        this.element.on(event, selector, function (e) {
            fun.call(this, e, that);
        });
    },
    /**
     * 为ugrid内部元素移除事件提供统一的入口方法。
     * @param event 移除的事件类型，如click
     * @param selector 要移除事件的元素
     * @param fun 要移除的方法
     */
    delEvent: function (event, selector, fun) {
        if (fun) {
            var that = this;
            this.element.off(event, selector, function (e) {
                fun.call(this, e, that);
            });
        } else {
            this.element.off(event, selector);
        }
    },
    /**
     * 为表格上面的按钮添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addControlEvent: function (event, fun) {
        this.addEvent(event, '.control button', fun);
    },
    /**
     * 为自动生存的操作列添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addOperateEvent: function (event, fun) {
        this.addEvent(event, '.operate span', fun);
    },
    /**
     * 为排序操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addSortEvent: function (event, fun) {
        this.addEvent(event, '.head .td', fun);
    },
    /**
     * 为跳到第一页的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addFirstEvent: function (event, fun) {
        this.addEvent(event, '.page .first', fun);
    },
    /**
     * 为跳到前一页的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addPrevEvent: function (event, fun) {
        this.addEvent(event, '.page .prev', fun);
    },
    /**
     * 为跳到下一页的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addNextEvent: function (event, fun) {
        this.addEvent(event, '.page .next', fun);
    },
    /**
     * 为跳到最后一页的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addLastEvent: function (event, fun) {
        this.addEvent(event, '.page .last', fun);
    },
    /**
     * 为跳到指定页的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addCurEvent: function (event, fun) {
        this.addEvent(event, '.page .cur', fun);
    },
    /**
     * 为头部实现全选的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addCheckEvent: function (event, fun) {
        this.addEvent(event, '.head .checkbox', fun);
        //this.element.find('.head .ucheckbox').ucheckbox('addCheckedEvent',event,fun);
    },
    /**
     * 为点击一行实现选中的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addSelectEvent: function(event, fun) {
        this.addEvent(event, '.table .tr',fun);
    },
    /**
     * 为每一条数据前复选框的选中的操作元素添加事件提供统一的入口方法。
     * @param event 添加的事件类型，如click
     * @param fun 为事件添加的方法
     */
    addCheckBoxEvent: function(event, fun){
        this.addEvent(event, '.table .tr .checkbox',fun);
    },
    /**
     * 为更多操作按钮添加点击事件
     * @param event
     * @param fun
     */
    addMoreEvent: function(event, fun){
        this.addEvent(event,'.control .response_icon' ,fun);
    },
    /**
     * 添加search放大镜上的点击事件
     */
    addScaleEvent: function(event, fun){
        this.addEvent(event,'.search .fa-search' ,fun);
    },
    /**
     * 点击放大镜的搜索功能
     */
    defScaleEvent: function(e, that){
        var mix = $(this).closest('.mix');
        that.defMixSearchEvent(mix,that);
    },
    /**
     * 表格上方按钮事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defControlEvent: function (e, that) {
        var key = $(this).data('ugridKey');
        var operate = that.getDefaultKey(key, 'operate');
        var flag = operate ? operate.call(this, e, that.getSelectData(), that) : true;

        if (!flag) return;

        var action = $(this).data('ugridAction');
        action = action ? action : key;
        var fun = that.option.event[action];
        fun ? fun.call(this, e, that.getSelectData(), that) : console.log('no method!');
    },
    /**
     * 操作列内按钮事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defOperateEvent: function (e, that) {
        var param = $(this).parent().data('ugridParam');

        var key = $(this).data('ugridKey');
        var operate = that.getDefaultKey(key, 'operate');
        var flag = operate ? operate.call(this, e, param, that) : true;

        if (!flag) return;

        var action = $(this).data('ugridAction');
        action = action ? action : key;
        var fun = that.option.event[action];
        fun ? fun.call(this, e, param, that) : console.log('no method!');
    },
    /**
     * 排序按钮事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defSortEvent: function (e, that) {
        if ($(this).find('.checkbox').length > 0) {
            return;
        }
        var key = $(this).data('ugrid-key');
        var sort = $(this).hasClass('sorted');
        if (sort) {
            that.option.switch = !that.option.switch;
            that.option.index.reverse();
        } else {
            that.option.switch = false;
            that.sortData(key);
            that.option.sort = key;
        }
        that.option.curPage = 1;
        that.selectRefresh();
        that.setSort();
        var select = that.option.select;
        for(var i in select){
            that.element.find('.tr[data-ugrid-key='+select[i]+']').addClass('select')
                .find('.td:eq(0) .ucheckbox').ucheckbox('setChecked',true);
        }
    },
    /**
     * 跳到第一页事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defFirstEvent: function (e, that) {
        that.option.curPage = 1;
        that.option.page?that.refresh():that.asyncFilterRefresh();
    },
    /**
     * 跳到前一页事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defPrevEvent: function (e, that) {
        var page = that.option.curPage - 1;
        if(page<1) return;
        that.option.curPage = page;
        that.option.page?that.refresh():that.asyncFilterRefresh();
    },
    /**
     * 跳到最后一页事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defLastEvent: function (e, that) {
        that.option.curPage = that.getPageParam().num;
        that.option.page?that.refresh():that.asyncFilterRefresh();
    },
    /**
     * 跳到下一页事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defNextEvent: function (e, that) {
        var page = that.option.curPage + 1;
        if(page>that.getPageParam().num) return;
        that.option.curPage = page;
        that.option.page?that.refresh():that.asyncFilterRefresh();
    },
    /**
     * 跳到当前页事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defCurEvent: function (e, that) {
        var cur = parseInt($(this).val());
        if (!cur) {
            cur = 1;
        }
        that.option.curPage = cur;
        that.option.page?that.refresh():that.asyncFilterRefresh();
    },
    /**
     * 所有分页相关事件实现的统一调用
     */
    defPageEvent: function () {
        this.addFirstEvent('click', this.defFirstEvent);
        this.addPrevEvent('click', this.defPrevEvent);
        this.addLastEvent('click', this.defLastEvent);
        this.addNextEvent('click', this.defNextEvent);
        this.addCurEvent('blur', this.defCurEvent);
    },
    /**
     * 头部全选按钮事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defCheckEvent: function (e, that) {
        /*var checkbox = that.element.find('.table .tr').find('.checkbox');
        var flag = $(this).toggleClass('select').hasClass('select');
        flag ? checkbox.addClass('select') : checkbox.removeClass('select');*/
        var checkbox = that.element.find('.table .tr').find('.ucheckbox');
        var checked = $(this).closest('.ucheckbox').ucheckbox('getInfo').checked;
        checkbox.ucheckbox('setChecked',checked);
        //that.element.find('.table .head').find('.ucheckbox').ucheckbox('setChecked',checked);
        that.element.find('.head').find('.ucheckbox').ucheckbox('setChecked',checked);
        that.setFixedHead();
        that.setSelect();
        //e.stopPropagation();
    },
    /**
     * 选中某条数据事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defSelectEvent: function (e, that) {
        $(this).addClass('select').siblings().removeClass('select');
        if($(e.target).hasClass('.ucheckbox')||$(e.target).parents('.ucheckbox').length>0){
           return;
        }
        if (that.option.checkbox) {
            $(this).find('.ucheckbox').ucheckbox('toggle');
        }
        that.setSelect();
        if(that.option.checkbox){
            var flag = that.element.find('.tr').length===that.option.select.length;
            //that.element.find('.table .head').find('.ucheckbox').ucheckbox('setChecked',flag);
            that.element.find('.head').find('.ucheckbox').ucheckbox('setChecked',flag);
            that.setFixedHead();
        }
    },
    /**
     * 每条数据前复选框选中事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defCheckBoxEvent:function(e,that){
        $(this).closest('.tr').addClass('select').siblings().removeClass('select');
        that.setSelect();
        //e.stopPropagation();
        if(that.option.checkbox){
            var flag = that.element.find('.tr').length===that.option.select.length;
            that.element.find('.head .ucheckbox').ucheckbox('setChecked',flag);
            that.setFixedHead();
        }
    },
    /**
     * 经典搜索点击显示下拉事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defClassicSearListEvent: function (e, that) {
        that.element.find('.search .classic aside').toggle();
        e.stopPropagation();
    },
    /**
     * 经典搜索点击下拉选项事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defClassicSearCondEvent: function (e, that) {
        var key = $(this).data('ugridKey');
        var classic = that.element.find('.search .classic');
        classic.data('ugrid-key', key);
        var index = classic.data('ugridSear');
        var name = that.option.search[index].param[key].text;
        classic.find('input').attr('placeholder', name).focus();
        //that.getServeData();
    },
    /**
     * 经典搜索点击清除按钮事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defClassicSearClearEvent: function (e, that) {
        that.element.find('.search .classic input').val('').focus();
        e.stopPropagation();
    },
    /**
     * 经典搜索实现搜索事件的实现
     * @param e 事件
     * @param that ugrid实例
     */
    defClassicSearEvent: function (e, that) {
        if (e.which != 13) {
            return;
        }
        var value = $(this).val();
        $(this).val(value.trim());

        var classic = $(this).closest('.classic');
        var key = classic.data('ugridKey');
        var index = classic.data('ugridSear');
        var item = that.option.search[index].param[key];

        item.value = $(this).val();
        item.mode = "text";
        if(item.url){
            that.asyncSearch(item);
        }else if(item.action){
            that.getRealAction(item.action).call(this,item,that);
        }else{
            that.search([item]);
        }
    },
    /**
     * 经典搜索事件的统一添加
     */
    defClassicSearchEvent: function () {
        this.addEvent('click', '.search .classic input', this.defClassicSearListEvent);
        this.addEvent('click', '.search .classic li', this.defClassicSearCondEvent);
        this.addEvent('click', '.search .classic i.fa-times-circle', this.defClassicSearClearEvent);
        this.addEvent('keyup', '.search .classic input', this.defClassicSearEvent);
    },
    /**
     * 根据Key值得到默认文字，图标或默认操作事件
     * @param key key值
     * @param type 要获取的内容
     *  icon:图标
     *  text:文字
     *  operate:默认操作的方法
     *  若不传，则这三个内容都会获取
     * @returns {*} type存在，返回对应的值；type不存在，返回一个obj:{icon:'',text:'',operate:function}
     */
    getDefaultKey: function (key, type) {
        var item = {
            icon: '',
            text: ''
        };
        switch (key) {
            case 'add':
                item.icon = $('<i class="fa fa-times fa-css-add"></i>');
                item.text = $.ui18n('ugrid_func_add')||'添加';
                break;
            case 'create':
                item.icon = $('<i class="fa fa-times fa-css-add"></i>');
                item.text = $.ui18n('ugrid_func_create')||'创建';
                break;
            case 'delete':
                item.icon = $('<i class="fa fa-trash-o"></i>');
                item.text = $.ui18n('ugrid_func_delete')||'删除';
                item.operate = function (e, data, that) {
                    var flag = true;
                    if (!data || data.length < 1) {
                        $.upop({content: {text: $.ui18n('ugrid_tips_min_one_data')||'请至少选择一条数据！'}});
                        flag = false;
                    }
                    return flag;
                }
                break;
            case 'del':
                item.icon = $('<i class="fa fa-trash-o"></i>');
                break;
            case 'modify':
                item.icon = $('<i class="fa fa-pencil"></i>');
                item.text = $.ui18n('ugrid_func_modify')||'修改';
                break;
            case 'refresh':
                item.icon = $('<i class="fa fa-refresh fa-css-config"></i>');
                item.text = $.ui18n('ugrid_func_refresh')||'刷新';
                break;
            case 'start':
                item.icon = $('<i class="fa fa-play"></i>');
                item.text =  $.ui18n('ugrid_func_start')||'启动';
                item.operate = function (e, data, that) {
                    var flag = true;
                    if (!data || data.length < 1) {
                        $.upop({content: {text:$.ui18n('ugrid_tips_min_one_data')||'请至少选择一条数据！'}});
                        flag = false;
                    }
                    return flag;
                }
                break;
            case 'stop':
                item.icon = $('<i class="fa fa-stop"></i>');
                item.text = $.ui18n('ugrid_func_stop')||'停止';
                item.operate = function (e, data, that) {
                    var flag = true;
                    if (!data || data.length < 1) {
                        $.upop({content: {text:$.ui18n('ugrid_tips_min_one_data')||'请至少选择一条数据！'}});
                        flag = false;
                    }
                    return flag;
                }
                break;
            case 'close':
                item.icon = $('<i class="fa fa-stop"></i>');
                item.text = $.ui18n('ugrid_func_close')||'关闭';
                item.operate = function (e, data, that) {
                    var flag = true;
                    if (!data || data.length < 1) {
                        $.upop({content: {text:$.ui18n('ugrid_tips_min_one_data')||'请至少选择一条数据！'}});
                        flag = false;
                    }
                    return flag;
                }
                break;
            case 'restart':
                item.icon = $('<i class="fa fa-repeat"></i>');
                item.text =$.ui18n('ugrid_func_restart')||'重启';
                item.operate = function (e, data, that) {
                    var flag = true;
                    if (!data || data.length < 1) {
                        $.upop({content: {text:$.ui18n('ugrid_tips_min_one_data')||'请至少选择一条数据！'}});
                        flag = false;
                    }
                    return flag;
                }
                break;
            case 'config':
                item.icon = $('<i class="fa fa-cog"></i>');
                item.text = $.ui18n('ugrid_func_config')||'配置';
                break;
            case 'install':
                item.icon = $('<i class="fa fa-install"></i>');
                item.text = $.ui18n('ugrid_func_install')||'安装';
                break;
            case 'import':
                item.icon = $('<i class="fa fa-arrow-circle-right"></i>');
                item.text = $.ui18n('ugrid_func_import')||'导入';
                break;
            case 'expand':
                item.icon = $('<i class="fa fa-arrows-alt"></i>');
                item.text = $.ui18n('ugrid_func_expand')||'扩容';
                break;
            case 'layer':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_layer"></i>');
                item.text = '数据分层';
                break;
            case 'delete_layer':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_delete_layer"></i>');
                item.text = '解除数据分层';
                break;
            case 'replace':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_replace"></i>');
                item.text = '替换';
                break;
            case 'loacl':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_loacl"></i>');
                item.text = '本地复制';
                break;
            case 'remote':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_remote"></i>');
                item.text = '开启远程复制';
                break;
            case 'unremote':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_unremote"></i>');
                item.text = '关闭远程复制';
                break;
            case 'clone':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_clone"></i>');
                item.text = '克隆';
                break;
            case 'flatten':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_flatten"></i>');
                item.text = '合并卷';
                break;
            case 'resize':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_resize"></i>');
                item.text = '卷扩展';
                break;
            case 'rollback':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_rollback"></i>');
                item.text = '回滚';
                break;
            case 'redeploy':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_redeploy"></i>');
                item.text = '重新部署';
                break;
            case 'mount':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_mount"></i>');
                item.text = '挂载';
                break;
            case 'umount':
                item.icon = $('<i class="fa ugrid_icon ugrid_icon_umount"></i>');
                item.text = '取消挂载';
                break;

        }
        item = this.getDefaultKeyByVersion(key,item);
        var value;
        switch (type) {
            case 'icon':
                value = item.icon;
                break;
            case 'text':
                value = item.text;
                break;
            case 'operate':
                value = item.operate;
                break;
            default:
                value = item;
                break;
        }
        return value;
    },
    getDefaultKeyByVersion:function (key,item) {
        switch (this.option.version){
            case '1.0':
                break
            case '2.0':
                switch (key){
                    case 'add':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_add"></i>');
                        break;
                    case 'create':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_add"></i>');
                        break;
                    case 'delete':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_delete"></i>');
                        break;
                    case 'modify':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_modify"></i>');
                        break;
                    case 'refresh':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_refresh"></i>');
                        break;
                    case 'start':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_start"></i>');
                        break;
                    case 'stop':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_stop"></i>');
                        break;
                    case 'close':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_stop"></i>');
                        break;
                    case 'install':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_install"></i>');
                        break;
	                case 'replace':
		                item.icon = $('<i class="fa ugrid_icon ugrid_icon_replace"></i>');
		                break;
	                case 'redeploy':
		                item.icon = $('<i class="fa ugrid_icon ugrid_icon_redeploy"></i>');
		                break;
                    case 'mount':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_mount"></i>');
                        break;
                    case 'umount':
                        item.icon = $('<i class="fa ugrid_icon ugrid_icon_umount"></i>');
                        break;
                }
                break;
        }
        return item;
    },
    /**
     * 保留被选项的刷新
     * @constructor
     */
    selectRefresh: function(){
        this.setPage();
        this.setBody();
        this.setPageDown();
    },
    /**
     * 简单的重新将数据展示一遍。会清空被选中的数据。
     */
    refresh: function () {
        this.setPage();
        this.setBody();
        this.setPageDown();
        this.clearSelect();
        this.option.refreshComplete && this.option.refreshComplete.call(this);
    },
    /**
     * 刷新列项
     */
    columnRefresh: function(){
        this.setHead();
        this.setBody();
        this.setFixedHead();
    },
    /**
     * 会根据过滤条件重新过滤一遍数据，然后重新排序一次，然后执行refresh。
     */
     filterRefresh: function () {
         this.filter();
         this.sortData(this.option.sort);
         this.refresh();
    },
    /**
     * 会清空过滤数据的条件以后，执行filterRefresh。
     */
    clearRefresh: function () {
        this.clearSearch();
        this.filterRefresh();
    },
    /**
     * 直接从后台重新获取一次数据。获取成功以后，会执行clearRefresh。
     */
    asyncRefresh: function () {
        this.clearAsyncFilter();
        this.clearSearch();
        this.getServeData();
        if(this.option.loop.timer === null){
            this.setLoop();
        }
    },
    asyncFilterRefresh: function(){
        this.getServeData(null,'filterRefresh');
        if(this.option.loop.timer === null){
            this.setLoop();
        }
    },
    /**
     * 清空过滤数据的条件，并且把表格的搜索项复位到初始化状态。
     * @param obj 要复位的搜索项的jquery对象。
     */
    clearSearch: function (obj) {
        this.setFilter([]);
        this.clearAsyncFilter();
        obj?'':obj = this.element.find('.search').children();
        obj.filter('.classic').find('input').val('');
        obj.filter('.select').find('.ubutton').each(function(i,item){
            var button = $(item);
            var select = button.next();
            button.ubutton('setItem',select.uselect('getItemByIndex',0));
        });

        obj.filter('.union').find('.uinput').each(function(i,item){
            $(item).uinput('clear');
        });
    },
    /**
     * 根据过滤条件，直径过滤数据的方法。
     * @param param 过滤数据的参数，请参考filter参数说明。
     */
    search: function (param) {
        if (!param) {
            this.clearRefresh();
        } else {
            this.setFilter(param);
            this.filterRefresh();
        }
    },
    /**
     * 由后台进行搜索调用的方法。此方法需要精确配合，比较死板，使用场合少，以后改进。
     * @param param 过滤数据的参数，请参考filter参数说明。
     */
    asyncSearch: function (param) {
        var value = param.value.trim();
        if(value===""||value===undefined||value===null){
            this.clearAsyncFilter();
        }else{
            var data = this.getRealAction(param.action).call(this,param,this) || {};
            data = $.extend(true,{
                url: param.url
                // data: param.value
            },data);
            this.asyncFilter = data;
        }
        this.getServeData(null,'filterRefresh');
    },
    /**
     * 过滤数据调用的方法。
     */
    filter: function () {
        var data = this.option.data;
        var index = [];
        for (var i in data) {
            index.push(i);
        }
        var param = this.option.fixedFilter.concat(this.option.filter);
        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            item.index = index;
            index = this.filterData($.extend(true, item, {data: data, index: index}));
        }
        this.option.index = index;
        !this.option.page ? '':this.option.total = index.length;
    },
    /**
     * 过滤数据的具体实现。
     * @param param 过滤数据的条件，请参考filter参数说明。
     * @returns {Array} 返回过滤结束后得到的数据索引值的数组。
     */
    filterData: function (param) {
        var index = param.index;
        var newIndex = [];
        for (var i in index) {
            var key = index[i];
            var item = this.option.data[key];
            var paramKeys = param.key.split(' ');
            for(var j in paramKeys){
                var paramKey = paramKeys[j];
                var text = item[paramKey];
                var formatter = this.getParameterItemByKey(paramKey).formatter;
                if (param.mode=="text"&&formatter) {
                    text = this.getFormatter(formatter, {
                        index: i,
                        key: paramKey,
                        value: item[paramKey],
                        item: item
                    });
                    text instanceof jQuery ? text = text.text() : text;
                } else {
                    text = item[paramKey]
                }
                if(param.pattern==='exact'){
                    if(text===param.value){
                        newIndex.push(key);
                        break;
                    }
                }else if (text&&text.toString().indexOf(param.value) != -1) {
                    newIndex.push(key);
                    break;
                }
            }
        }
        return newIndex;
    },
    /**
     * 设置过滤数据的条件。
     * @param param 过滤数据的条件，请参考filter参数说明。
     */
    setFilter: function (param) {
        this.option.filter = param;
    },
    /**
     * 设置固定过滤数据的条件。
     * @param param 过滤数据的条件，请参考filter参数说明。
     */
    setFixedFilter: function (param) {
        this.option.fixedFilter = param;
    },
    clearAsyncFilter: function(){
        this.asyncFilter = null;
    },
    /**
     * 設置新的請求路徑
     * @param obj
     */
    setUrl: function(obj){
        this.option.url = obj;
        this.option.data = [];
        this.option.index = [];
        this.getServeData();
    },
    /**
     * 设置被选中数据的索引值的数组。
     * 主要在选择或取消选择时调用，实现被选数据的管理。
     */
    setSelect: function () {
        var that = this;
        that.option.select = [];
        that.option.checkbox ? that.element.find('.table .tr').each(function (i, e) {
            var key = $(e).data('ugridKey')
            if ($(e).find('.ucheckbox').ucheckbox('getInfo').checked) {
                that.option.select.push(key);
            }
        }) : that.element.find('.table .tr.select').each(function (i, e) {
            that.option.select.push($(e).data('ugridKey'));
        });
    },
    /**
     * 清空所有被选数据，并且将全选框置为不选中。
     */
    clearSelect: function () {
        this.element.find('.head .checkbox').removeClass('select');
        this.element.find('.head .ucheckbox').ucheckbox('setChecked',false);
        this.setFixedHead();
        this.option.select = [];
    },
    /**
     * 得到被选中的数据。
     * @returns {Array} 被选中的数组。
     */
    getSelectData: function () {
        var select = this.option.select;
        var data = [];
        for (var i in select) {
            data.push(this.option.data[select[i]]);
        }
        return data;
    },
    /**
     * 判断参数是不是方法
     * @param param
     * @returns {boolean}
     */
    isFunction:function(param){
        return param instanceof Function;
    },
    /**
     * 判断参数是不是字符串
     * @param param
     * @returns {boolean}
     */
    isString: function(param){
        return typeof param === 'string';
    }
}
$.fn.extend({
    /**
     * 销毁在该元素上实现的ugrid。
     * @returns {*} 返回该元素
     */
    clearUgrid: function () {
        return this.off().empty().removeData('ugrid').removeClass('ugrid');
    }
});
    $(window).resize(function(){
        $('.ugrid').ugrid('setFixedHead');
        $('.ugrid').ugrid('refreshControl');
        $('.ugrid .ugrid_response').removeAttr('style');
    });
});

