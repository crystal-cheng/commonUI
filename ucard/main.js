define([
    'jquery',
    'text!module/ucard/template.html',
    'css!module/ucard/style.css'
],function($,template) {
    (function($){
        function Card($list,$li,options,ele) {
            var that = this;
            this.options = {
                'type':'list',
                'data':[
                    {
                    'name':'card_title',
                    'path': '',
                    'size':'33242.44',
                    'last_modified':'2018-12-23',
                    'owner':'admin',
                    '_source':'',
                    '_id': 3
                    }
                ]
            };
            $.extend(this.options, options);
            this.addCard(this.options,$list,$li,ele);
        }
        Card.prototype = {
            addCard: function(options,$list,$li,ele) {
                var data = options.data;
                console.log(data.length,'data.length',options.type);
                
                if(data.length === 0){
                    $('.list').empty();
                    // $('.loadMore').hide();
                    $('.page_Wrap').hide();
                } else {
                    for(var i=0;i<data.length;i++){
                        var str = '';
                        $li = $li.clone();
                        var keyword = window.sessionStorage.getItem('keyword');
                        
                        var reg = new RegExp(keyword, "gi");
                        if(data[i]._source.name) {
                            $li.find('.name').html(data[i]._source.name.replace(reg,"<i class='keyword'>" + keyword + "</i>"));
                            $li.find('.name').attr('title',data[i]._source.name);
                        }
                        
                        if(data[i]._source.s3_url) {
                            $li.find('.path').html(data[i]._source.s3_url + data[i]._source.path);
                            $li.find('.path').attr('title',data[i]._source.s3_url + data[i]._source.path);
                        } else {
                            $li.find('.path').html(data[i]._source.path);
                            $li.find('.path').attr('title',data[i]._source.path);
                        }
                        
                       
                        if(data[i]._source.last_modified){
                            var oDate = new Date(parseInt(data[i]._source.last_modified) * 1000),oYear = oDate.getFullYear(),oMonth = oDate.getMonth()+1,  
                            oDay = oDate.getDate();
                            $li.find('.user_time').html(oYear + '-'+ oMonth +  '-' + oDay);
                        } else {
                            $li.find('.user_time').html();
                        }

                        $li.find('.detail').attr('index', i);

                        var highlight = data[i].highlight;
                        for(var key in  highlight){
                            var s = highlight[key][0];
                            if(keyword){
                                str += '<span>' + s.replace(reg,"<i class='keyword'>" + keyword + "</i>")+ '</span>';
                                $li.find('.highlight').html(str);
                            } else {
                                $li.find('.highlight').html(str);
                            }

                        }
                        
                        if(data[i]._source['name']) {
                            var doc_typelist = data[i]._source['name'].split('.');
                            var doc_type = doc_typelist[(doc_typelist.length) - 1];
                            switch(doc_type){
                                case 'doc':
                                case 'docx':
                                case 'odt':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_word.svg)");
                                    break;
                                case 'ppt':
                                case 'pptx':
                                case 'ppsx':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_ppt.svg)");
                                    break;
                                case 'xml':
                                case 'html':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_html.svg)");
                                    break;
                                case 'rar':
                                case 'zip':
                                case 'tar':
                                case 'jar':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_rar.svg)");
                                    break;
                                case 'xls':
                                case 'xlsx':
                                case 'ods':
                                case 'csv':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_excel.svg)");
                                    break;
                                case 'css':
                                case 'json':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_css.svg)");
                                    break;
                                case 'pdf':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_pdf.svg)");
                                    break;
                                case 'text':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_text.svg)");
                                    break;
                                case 'jpg':
                                case 'jpeg':
                                case 'png':
                                case 'svg':
                                case 'gif':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_img.svg)");
                                    break;
                                case 'mpg':
                                case 'mpeg':
                                case 'mp4':
                                case 'avi':
                                case 'wmv':
                                case 'vm':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_video.svg)");
                                    break;
                                case 'mp3':
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_music.svg)");
                                    break;
                                default:
                                $li.find('.type_icon').css("background-image","url(../module/common/image/icon_other.svg)");
                                    break;
                            }
                        }


                        $li.appendTo($list);
                        $list.appendTo(ele.empty());
                        
                        if(options.type === 'list') {
                            // $li.width(ele.width() - 20);
                            $li.css("height","auto");
                            $li.find('.card_wrap .card_cotent').css({'min-height': '24px','line-height': '24px'});
                            $('.detail').addClass('list_type');
                            $('.card_footer').css({'border-top':'none','height': '40px','line-height': '40px'});
                            $('.user_icon').css({'height': '40px','line-height': '40px'});
                        }
                    } 
                    $('.list').find(".card")[0].remove();
                    var height = parseInt(window.sessionStorage.getItem('scrollheight'));
                    $('#content')[0].scrollTop = height;
                    window.sessionStorage.removeItem('scrollheight');
                    
                    // if(options.type === 'card') {
                    //     this.waterfall();
                    // }
                }
                window.sessionStorage.removeItem('keyword');

            },
            conver: function(limit){  
                var size = "";  
                if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
                    size = limit.toFixed(2) + "B";    
                }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
                    size = (limit / 1024).toFixed(2) + "KB";              
                }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
                    size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
                }else{ //其他转化成GB  
                    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
                }  
                    
                var sizestr = size + "";   
                var len = sizestr.indexOf("\.");  
                var dec = sizestr.substr(len + 1, 2);  
                if(dec == "00"){//当小数点后为00时 去掉小数部分  
                    return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
                }  
                return sizestr;  
            },
            waterfall: function (){
                var $aPin = $( ".card" );
                var iPinW = $aPin.eq( 1 ).width();// 一个块框pin的宽
                var num = 3;
                $( ".list" ).css({
                    // 'width' : iPinW * num,
                    'margin': '0 auto'
                });

                var pinHArr=[];//用于存储 每列中的所有块框相加的高度。

                $aPin.each( function( index, value ){
                    var pinH = $aPin.eq( index ).height();
                    if( index < num ){
                        pinHArr[ index ] = pinH; //第一行中的num个块框pin 先添加进数组pinHArr
                    }else{
                        var minH = Math.min.apply( null, pinHArr );//数组pinHArr中的最小值minH
                        var minHIndex = $.inArray( minH, pinHArr );
                        $( value ).css({
                            'position': 'absolute',
                            'top': minH + 15,
                            'left': $aPin.eq( minHIndex ).position().left
                        });
                        //数组 最小高元素的高 + 添加上的aPin[i]块框高
                        pinHArr[ minHIndex ] += $aPin.eq( index ).height() + 15;//更新添加了块框后的列高
                        $( ".list" ).css({
                            'height' : Math.max.apply( null, pinHArr )
                        });
                    }
                });

            } 
        }
        $.fn.ucard = function(options) {
            var that = this;
            var $list = $(template).clone();
            var $li = $list.find("li");
            return new Card($list,$li,options,that);
        }
    })(jQuery);
});